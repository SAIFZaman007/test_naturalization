/**
 * Utility functions for handling profile picture display
 */

/**
 * Get a valid profile picture URL or default fallback
 * @param {string|null} profilePic - The profile picture URL from user data
 * @param {string} userName - The user's name for generating default avatar
 * @returns {string} - Valid profile picture URL or default avatar URL
 */
export const getProfilePicture = (profilePic, userName = 'User') => {
  // Check if profile picture is valid (not null, undefined, empty string, or 'null' string)
  if (profilePic && profilePic !== 'null' && profilePic !== '') {
    return profilePic;
  }

  // Return default avatar using ui-avatars API
  const cleanName = userName.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    cleanName
  )}&background=7C3AED&color=ffffff&size=128&bold=true`;
};

/**
 * Get user initials for fallback display
 * @param {string} userName - The user's name
 * @returns {string} - User initials (1-2 characters)
 */
export const getUserInitials = (userName = 'User') => {
  if (!userName || userName === 'null') return 'U';

  const cleanName = userName.trim();
  const nameParts = cleanName.split(' ').filter((part) => part.length > 0);

  if (nameParts.length === 0) return 'U';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

  // Return first letter of first and last name
  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
};

/**
 * Check if a profile picture URL is valid
 * @param {string|null} profilePic - The profile picture URL
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidProfilePic = (profilePic) => {
  return (
    profilePic &&
    profilePic !== 'null' &&
    profilePic !== '' &&
    typeof profilePic === 'string'
  );
};
