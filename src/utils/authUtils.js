/**
 * Authentication utility functions
 */

export const isUserAuthenticated = (currentUser, userData) => {
  return currentUser && userData;
};

export const isUserDataLoading = (currentUser, userData) => {
  return currentUser && !userData;
};

export const getUserRole = (userData) => {
  return userData?.role || null;
};

export const redirectPathForRole = (role) => {
  switch (role) {
    case 'artist':
      return '/dashboard';
    case 'buyer':
      return '/';
    default:
      return '/';
  }
};
