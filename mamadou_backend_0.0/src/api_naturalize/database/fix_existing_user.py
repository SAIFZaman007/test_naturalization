"""
Fix Existing User Script
This script will:
1. Find the user by email
2. Verify them (remove OTP, set is_verified=True)
3. Update their password with proper Argon2 hashing
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timezone

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Use Argon2 to match your current setup
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

async def fix_user():
    """Fix the existing user"""
    
    print("=" * 70)
    print("🔧 MAMADOU USER FIX TOOL")
    print("=" * 70)
    
    # Connect to database
    print("\n[1/4] Connecting to MongoDB...")
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        await client.admin.command('ping')
        print("✅ Connected to MongoDB!")
    except Exception as e:
        print(f"❌ Failed to connect: {str(e)}")
        return
    
    db = client[DATABASE_NAME]
    users_collection = db["users"]
    
    # Get user email
    print("\n[2/4] Enter User Email to Fix:")
    email = input("Email: ").strip().lower()
    
    # Find user
    user = await users_collection.find_one({"email": email})
    
    if not user:
        print(f"\n❌ No user found with email: {email}")
        client.close()
        return
    
    print(f"\n✅ User found!")
    print(f"  Name: {user.get('first_name')} {user.get('last_name')}")
    print(f"  Role: {user.get('role')}")
    print(f"  Verified: {user.get('is_verified')}")
    print(f"  OTP: {user.get('otp', 'None')}")
    
    # Ask for new password
    print("\n[3/4] Set New Password:")
    new_password = input("Enter new password: ").strip()
    
    if not new_password:
        print("❌ Password cannot be empty!")
        client.close()
        return
    
    # Hash the password with Argon2
    print("\n[4/4] Fixing user...")
    hashed_password = pwd_context.hash(new_password)
    
    # Update user
    result = await users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed_password,
                "is_verified": True,
                "updated_at": datetime.now(timezone.utc)
            },
            "$unset": {
                "otp": ""
            }
        }
    )
    
    if result.modified_count > 0:
        print("\n" + "=" * 70)
        print("✅ USER FIXED SUCCESSFULLY!")
        print("=" * 70)
        print(f"\n📧 Email: {email}")
        print(f"🔐 New Password: {new_password}")
        print(f"✓ Status: VERIFIED & ACTIVE")
        print(f"🔑 Password Hash: {hashed_password[:30]}...")
        print("\n💡 You can now login with these credentials!")
        
        # Test password verification
        print("\n🧪 Testing password verification...")
        is_valid = pwd_context.verify(new_password, hashed_password)
        if is_valid:
            print("✅ Password verification test: PASSED")
            print("🎉 Everything is working correctly!")
        else:
            print("❌ Password verification test: FAILED")
            print("⚠️ There might be an issue with Argon2")
    else:
        print("\n❌ Failed to update user!")
    
    print("=" * 70)
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_user())