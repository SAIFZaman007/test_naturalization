from beanie import Document
from pydantic import Field, EmailStr
from datetime import datetime, timezone
from typing import Optional
import uuid

# Import standardized enums
from api_naturalize.utils.constants import AccountStatus, SubscriptionPlan, UserRole

class UserModel(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    
    # ***  enum with proper default  ***
    plan: SubscriptionPlan = Field(default=SubscriptionPlan.FREE)
    
    phone_number: Optional[str] = None
    password: Optional[str] = None
    is_verified: bool = False
    
    # ***  enum with proper default  ***
    account_status: AccountStatus = Field(default=AccountStatus.ACTIVE)
    
    otp: Optional[str] = None
    otp_created_at: Optional[datetime] = None  # ✅ Added for expiration
    otp_attempts: int = 0  # ✅ Added for rate limiting
    
    # ***  Use enum with proper default  ***
    role: UserRole = Field(default=UserRole.USER)
    
    profile_image: Optional[str] = Field(
        default="https://res.cloudinary.com/dg0i0hsqe/image/upload/v1731829933/default-profile_klmgwm.png"
    )
    auth_provider: str = Field(default="email")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"
        # *** indexes for performance ***
        indexes = [
            "email",
            "phone_number",
            [("created_at", -1)],
            [("account_status", 1)],
            [("plan", 1)],
            [("role", 1)]
        ]