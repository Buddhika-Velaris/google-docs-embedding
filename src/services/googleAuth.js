import { googleLogout } from '@react-oauth/google';

export const storeUserProfile = (profileObj) => {
  if (!profileObj) return;
  
  const userData = {
    id: profileObj.sub,
    name: profileObj.name,
    email: profileObj.email,
    imageUrl: profileObj.picture
  };
  
  sessionStorage.setItem('googleUserData', JSON.stringify(userData));
  return userData;
};

export const signOut = () => {
  try {
    googleLogout();
    
    sessionStorage.removeItem('googleAccessToken');
    sessionStorage.removeItem('googleIdToken');
    sessionStorage.removeItem('googleTokenExpiry');
    sessionStorage.removeItem('googleUserData');
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};


export const isSignedIn = () => {
  try {
    const accessToken = sessionStorage.getItem('googleAccessToken');
    const tokenExpiry = sessionStorage.getItem('googleTokenExpiry');
    const userData = sessionStorage.getItem('googleUserData');
    
    if (accessToken && userData) {
      if (tokenExpiry) {
        const currentTime = Date.now();
        const expiryTime = parseInt(tokenExpiry, 10);
        
        if (expiryTime > currentTime) {
          return true;
        }
      } else {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking authentication state:', error);
    return false;
  }
};



// Get the ID token for backend validation
export const getIdToken = () => {
  const storedIdToken = sessionStorage.getItem('googleIdToken');
  const tokenExpiry = sessionStorage.getItem('googleTokenExpiry');
  
  if (storedIdToken && tokenExpiry) {
    const currentTime = Date.now();
    const expiryTime = parseInt(tokenExpiry, 10);
    
    if (expiryTime > currentTime) {
      return storedIdToken;
    }
  }
  
  return null;
};

export const sendIdTokenToBackend = async (idToken) => {
  if (!idToken) {
    idToken = getIdToken();
  }
  
  if (!idToken) {
    throw new Error('No ID token available. User might not be signed in.');
  }
  
  try {
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate token with backend');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending ID token to backend:', error);
    throw error;
  }
};



export const extractSpreadsheetId = (url) => {
  if (!url) return null;
  
  try {
    // Handle different URL formats
    // Format 1: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    // Format 2: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=SHEET_ID
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)(?:\/|$|\?|#)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting spreadsheet ID:', error);
    return null;
  }
};

// Extract a document ID from a Google Docs URL
export const extractDocumentId = (url) => {
  if (!url) return null;
  
  try {
    // Handle different URL formats
    // Format 1: https://docs.google.com/document/d/DOCUMENT_ID/edit
    // Format 2: https://docs.google.com/document/d/DOCUMENT_ID/edit?usp=sharing
    const regex = /\/document\/d\/([a-zA-Z0-9-_]+)(?:\/|$|\?|#)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting document ID:', error);
    return null;
  }
};


export const getGoogleDocType = (url) => {
  if (!url) return null;
  
  try {
    if (url.includes('docs.google.com/spreadsheets')) {
      return 'sheet';
    } else if (url.includes('docs.google.com/document')) {
      return 'document';
    } else if (url.includes('docs.google.com/presentation')) {
      return 'presentation';
    } else if (url.includes('docs.google.com/forms')) {
      return 'form';
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error determining Google Doc type:', error);
    return null;
  }
};


