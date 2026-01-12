/**
 * Test file to demonstrate profile picture handling
 * This shows how the profileUtils functions work
 */

import {
  getProfilePicture,
  getUserInitials,
  isValidProfilePic,
} from './profileUtils';

// Test data similar to what you provided
const testUserData = {
  id: '6d3a1731-3223-41bf-94c3-81e94001ad47',
  fname: 'Md. Ridoy Hasan',
  lname: 'Kamrul',
  email: 'mdridoyhasankamrul@gmail.com',
  profilePic:
    'https://lh3.googleusercontent.com/a/ACg8ocJjSsjr7hy-KjcwtTaaq2IuKA9hwE7M9_OFlFqviJpqDNMddyw=s96-c',
  isVerified: true,
  createdAt: '2025-11-01T04:22:13.461Z',
};

// Test cases
console.log('=== Profile Picture Testing ===');

// Test 1: Valid profile picture
console.log('Test 1 - Valid profile pic:');
console.log('Input profilePic:', testUserData.profilePic);
console.log(
  'Result:',
  getProfilePicture(
    testUserData.profilePic,
    `${testUserData.fname} ${testUserData.lname}`
  )
);
console.log('Is valid:', isValidProfilePic(testUserData.profilePic));

// Test 2: Null profile picture
console.log('\nTest 2 - Null profile pic:');
const nullProfilePic = null;
console.log('Input profilePic:', nullProfilePic);
console.log(
  'Result:',
  getProfilePicture(
    nullProfilePic,
    `${testUserData.fname} ${testUserData.lname}`
  )
);
console.log('Is valid:', isValidProfilePic(nullProfilePic));

// Test 3: "null" string profile picture
console.log('\nTest 3 - "null" string profile pic:');
const stringNullProfilePic = 'null';
console.log('Input profilePic:', stringNullProfilePic);
console.log(
  'Result:',
  getProfilePicture(
    stringNullProfilePic,
    `${testUserData.fname} ${testUserData.lname}`
  )
);
console.log('Is valid:', isValidProfilePic(stringNullProfilePic));

// Test 4: Empty string profile picture
console.log('\nTest 4 - Empty string profile pic:');
const emptyProfilePic = '';
console.log('Input profilePic:', emptyProfilePic);
console.log(
  'Result:',
  getProfilePicture(
    emptyProfilePic,
    `${testUserData.fname} ${testUserData.lname}`
  )
);
console.log('Is valid:', isValidProfilePic(emptyProfilePic));

// Test 5: User initials
console.log('\nTest 5 - User initials:');
console.log('Full name:', `${testUserData.fname} ${testUserData.lname}`);
console.log(
  'Initials:',
  getUserInitials(`${testUserData.fname} ${testUserData.lname}`)
);
console.log('Single name initials:', getUserInitials('John'));
console.log('Empty name initials:', getUserInitials(''));
console.log('Null name initials:', getUserInitials(null));

export { testUserData };
