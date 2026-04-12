# Firebase Setup for Community Tips

This guide will help you set up Firebase to enable real-time sharing of community tips in the Homework Planner app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Give your project a name (e.g., "homework-planner")
4. Follow the setup steps

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose one closest to your users)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. In the "Your apps" section, click the web app icon (`</>`)
3. Give your app a nickname
4. Click "Register app"
5. Copy the `firebaseConfig` object

## Step 4: Update Firebase Configuration

Replace the placeholder config in `src/lib/firebase.ts` with your actual configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Configure Firestore Rules

For testing and development, you can start with permissive rules. Go to Firestore → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sharedTips/{tipId} {
      allow read, create: if true;
      allow update, delete: if false;
    }
  }
}
```

For production, you should secure your Firestore with authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sharedTips/{tipId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 6: Test the Integration

1. Restart your development server
2. Go to the Self Care page
3. Try adding a tip and selecting "Share with Others"
4. The tip should appear in the Community Tips section

## Features Enabled by Firebase

- ✅ Real-time sharing of tips between users
- ✅ Persistent storage of community tips
- ✅ Author attribution for shared tips
- ✅ Timestamp tracking for when tips were shared

Note: In the current implementation, Firebase is used for sharing tips while personal tips remain stored in localStorage for privacy.
