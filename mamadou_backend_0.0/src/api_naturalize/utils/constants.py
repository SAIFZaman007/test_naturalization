#   *** Standard Enums ***

from enum import Enum

class AccountStatus(str, Enum):
    """Standardized account status values"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended" 
    
class SubscriptionPlan(str, Enum):
    """Standardized subscription plan values"""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    
class UserRole(str, Enum):
    """User role types"""
    USER = "USER"
    ADMIN = "ADMIN"