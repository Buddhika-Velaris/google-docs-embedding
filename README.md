# Google Authentication Setup Instructions

To use Google authentication and access Google Sheets in your app, you need to set up credentials in the Google Cloud Console:

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make note of your Project ID

## 2. Enable Required APIs

1. In your project, navigate to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Google Sheets API
   - Google Drive API
   - Google Identity OAuth 2.0

## 3. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add your app's domain to "Authorized JavaScript origins"
   - For development: http://localhost:5173 (Vite's default port)
   - For production: Your actual domain
5. Add redirect URIs:
   - For development: http://localhost:5173
   - For production: Your actual domain
6. Click "Create"
7. Note your Client ID and API Key

## 4. Update Your Code

1. Open `.env`
2. Replace the placeholder values with your actual credentials:
   ```javascript
   const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Client ID
   ```

