from fastapi import APIRouter, HTTPException, Depends, status, File, UploadFile, Request
from typing import List, Optional
from pathlib import Path
import shutil
import uuid
import logging

from api_naturalize.auth.models.user_model import UserModel
from api_naturalize.auth.schemas.user_schemas import UserUpdate, UserResponse
from api_naturalize.dashboard.routers.dashboard import get_in_progress_lessons
from api_naturalize.dashboard.schemas.dashboard import ExtendedAppUserResponse
from api_naturalize.leader_board.models.leader_board_model import LeaderBoardModel
from api_naturalize.lesson.models.lesson_model import LessonModel
from api_naturalize.question.models.question_model import QuestionModel
from api_naturalize.utils.user_info import get_user_info
from api_naturalize.utils.get_hashed_password import get_hashed_password

# Configure logging
logger = logging.getLogger(__name__)

# Constants
UPLOAD_DIR = Path("uploaded_images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Router configuration
user_router = APIRouter(prefix="/users", tags=["Users"])


# USER CRUD ENDPOINTS
@user_router.get(
    "/",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all users",
    description="Retrieve paginated list of all users"
)
async def get_all_users(skip: int = 0, limit: int = 20) -> List[UserResponse]:
    """
    Get all users with pagination.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        List of user objects
    """
    if limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit cannot exceed 100"
        )
    
    users = await UserModel.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
    return users


@user_router.get(
    "/{id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user by ID",
    description="Retrieve a specific user by their ID"
)
async def get_user(id: str) -> UserResponse:
    """
    Get user by ID.
    
    Args:
        id: User ID
        
    Returns:
        User object
        
    Raises:
        HTTPException: If user not found
    """
    user = await UserModel.get(id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@user_router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete user",
    description="Delete a user by their ID"
)
async def delete_user(id: str) -> dict:
    """
    Delete user by ID.
    
    Args:
        id: User ID
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If user not found
    """
    user = await UserModel.get(id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await user.delete()
    logger.info(f"User {id} deleted successfully")
    return {"message": "User deleted successfully"}


# ============================================================================
# CURRENT USER ENDPOINTS
# ============================================================================

@user_router.get(
    "/info/me",
    response_model=ExtendedAppUserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    description="Retrieve detailed profile information for the authenticated user"
)
async def get_my_profile(user_info: dict = Depends(get_user_info)) -> ExtendedAppUserResponse:
    """
    Get current logged-in user's extended profile with statistics.
    
    Returns:
        Extended user profile with scores, lessons, and progress
        
    Raises:
        HTTPException: If user not found
    """
    user_id = user_info["user_id"]
    db_user = await UserModel.get(user_id)
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Convert user model to UserResponse
    user_response = UserResponse(
        id=db_user.id,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        email=db_user.email,
        phone_number=db_user.phone_number,
        is_verified=db_user.is_verified,
        profile_image=db_user.profile_image,
        auth_provider=db_user.auth_provider,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at,
        role=db_user.role,
        otp=db_user.otp,
        plan=db_user.plan,
        account_status=db_user.account_status
    )
    
    # Get total_score from LeaderBoardModel
    leaderboard_data = await LeaderBoardModel.find_one(
        LeaderBoardModel.user_id == user_id
    )
    total_score = leaderboard_data.total_score if leaderboard_data else 0
    
    # Get total lessons count
    total_lessons = await LessonModel.find_all().count()
    
    # Calculate success rate
    total_questions = await QuestionModel.find_all().count()
    success_rate = (
        (total_questions * total_score) / 100 
        if total_questions > 0 
        else 0.0
    )
    
    # Get in-progress lessons (progress > 0 and < 100)
    in_progress_lessons = await get_in_progress_lessons(user_id)
    
    return ExtendedAppUserResponse(
        total_score=total_score,
        total_lessons=total_lessons,
        success_rate=success_rate,
        user_details=user_response,
        in_progress_lessons=in_progress_lessons
    )


@user_router.patch(
    "/update/info",
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
    description="Update authenticated user's profile information"
)
async def update_user(
    user_data: UserUpdate,
    user_info: dict = Depends(get_user_info)
) -> dict:
    """
    Update current user's profile information.
    
    Args:
        user_data: Fields to update
        user_info: Authenticated user information
        
    Returns:
        Success message and updated user object
        
    Raises:
        HTTPException: If user not found or no data provided
    """
    user_id = user_info["user_id"]
    
    user_obj = await UserModel.get(user_id)
    if not user_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_data.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )
    
    # Hash password if provided
    if "password" in update_data:
        update_data["password"] = get_hashed_password(update_data["password"])
    
    await user_obj.set(update_data)
    
    # Fetch updated user
    updated_user = await UserModel.get(user_id)
    
    logger.info(f"User {user_id} profile updated successfully")
    
    return {
        "message": "Profile updated successfully",
        "user": UserResponse(**updated_user.model_dump())
    }


@user_router.post(
    "/update_profile_image",
    status_code=status.HTTP_201_CREATED,
    summary="Update profile image",
    description="Upload and update user's profile image"
)
async def update_profile_image(
    request: Request,
    profile_image: UploadFile = File(...),
    user_info: dict = Depends(get_user_info)
) -> dict:
    """
    Update user's profile image.
    
    Args:
        request: FastAPI request object
        profile_image: Image file to upload
        user_info: Authenticated user information
        
    Returns:
        Success message and image URL
        
    Raises:
        HTTPException: If user not found, invalid file type, or upload fails
    """
    user_id = user_info["user_id"]
    
    db_user = await UserModel.get(user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate file extension
    file_extension = Path(profile_image.filename).suffix.lower()
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Validate file size
    profile_image.file.seek(0, 2)
    file_size = profile_image.file.tell()
    profile_image.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024 * 1024)}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)
    except Exception as e:
        logger.error(f"Image upload failed for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload failed: {str(e)}"
        )
    finally:
        profile_image.file.close()
    
    # Construct image URL
    base_url = str(request.base_url).rstrip("/")
    image_url = f"{base_url}/static/{unique_filename}"
    
    # Update user profile image
    await db_user.set({UserModel.profile_image: image_url})
    
    logger.info(f"Profile image updated for user {user_id}")
    
    return {
        "message": "Successfully updated profile image",
        "profile_image": image_url
    }