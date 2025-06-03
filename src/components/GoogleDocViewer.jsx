import { useEffect, useState } from 'react';
import { 
  signOut, 
  isSignedIn,
  storeUserProfile
} from '../services/googleAuth';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleDocViewer = ({ initialDocType, initialDocId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [docUrl, setDocUrl] = useState('');
  const docId = initialDocId;
  const docType = initialDocType;
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        sessionStorage.setItem('googleAccessToken', tokenResponse.access_token);
        const expiryTime = Date.now() + 3600 * 1000;
        sessionStorage.setItem('googleTokenExpiry', expiryTime.toString());
        if (tokenResponse.refresh_token) {
          sessionStorage.setItem('googleRefreshToken', tokenResponse.refresh_token);
        }
        
        const userProfileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        
        if (userProfileResponse.ok) {
          const userProfile = await userProfileResponse.json();
          const userData = storeUserProfile(userProfile);
          setUser(userData);
          
          if (docType === 'sheet') {
            setDocUrl(`https://docs.google.com/spreadsheets/d/${docId}/edit?usp=sharing`);
          } else if (docType === 'document') {
            setDocUrl(`https://docs.google.com/document/d/${docId}/edit?usp=sharing`);
          }
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (err) {
        setError('Authentication error: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      setError('Google login failed: ' + error.message);
      setLoading(false);
      console.error('Login error:', error);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/documents.readonly profile email'
  });
  

  const handleSignIn = () => {
    setLoading(true);
    login();
  };
  
  // Handle sign out button click
  const handleSignOut = () => {
    try {
      signOut();
      setUser(null);
    } catch (err) {
      setError('Sign out failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  
  
  useEffect(() => {
    const init = async () => {
      try {
        const storedUserData = sessionStorage.getItem('googleUserData');
        
        if (storedUserData && isSignedIn()) {
          console.log('User is authenticated, restoring session');
          
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          
          if (docType === 'sheet') {
            setDocUrl(`https://docs.google.com/spreadsheets/d/${docId}/edit?usp=sharing`);
          } else if (docType === 'document') {
            setDocUrl(`https://docs.google.com/document/d/${docId}/edit?usp=sharing`);
          }
        } else {
          console.log('User is not authenticated');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize component: ' + err.message);
        setLoading(false);
        console.error('Initialization error:', err);
      }
    };
    
    init();
  }, [docId, docType]);
  

  if (loading) {
    return <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>;
  }
  
  return (
    <div>
      <Link to="/">← Back to Links</Link>
      <h1>Google Docs Viewer</h1>
      {user ? (
        <>
          <div className="user-info">
            <img src={user.imageUrl} alt={user.name} width="50" height="50" />
            <p>Welcome, {user.name}</p>
            <button onClick={handleSignOut}>Sign Out</button>
            <div className="doc-type-indicator">
              <span>Currently viewing: {docType === 'sheet' ? 'Google Sheet' : 'Google Document'}</span>
            </div>
          </div>
         
          <div className="iframe-container">
            <iframe
              src={docUrl}
              width="100%"
              height="500px"
              frameBorder="0"
              title={docType === 'sheet' ? "Embedded Google Sheet" : "Embedded Google Document"}
            />
            <p className="auth-note">
              You are viewing this {docType === 'sheet' ? 'sheet' : 'document'} as {user.name}. 
              The content will respect your Google account&apos;s permissions.
            </p>
          </div>
        </>
      ) : (
        <button onClick={handleSignIn} className="sign-in-button">Sign in with Google</button>
      )}
      
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

GoogleDocViewer.propTypes = {
  initialDocType: PropTypes.oneOf(['sheet', 'document']),
  initialDocId: PropTypes.string
};

export default GoogleDocViewer;
