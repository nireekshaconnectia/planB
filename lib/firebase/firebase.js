import { initializeApp } from 'firebase/app'; // Initialize Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth module

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Corrected `.app` to `.appspot.com`
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
  });
}
export const auth = getAuth(app); // Export auth for OTP
