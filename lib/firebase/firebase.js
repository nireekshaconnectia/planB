import { initializeApp } from 'firebase/app'; // Initialize Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Auth module

const firebaseConfig = {
  apiKey: "AIzaSyC3YY4VRw3dP47O9EbWzyup-IH5JA6HNk0",
  authDomain: "planbcafeqa-f3e47.firebaseapp.com",
  projectId: "planbcafeqa-f3e47",
  storageBucket: "planbcafeqa-f3e47.appspot.com", // Corrected `.app` to `.appspot.com`
  messagingSenderId: "553890367134",
  appId: "1:553890367134:web:9169192062cd1f3e53dd8f",
  measurementId: "G-NJPZRMRRP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
  });
}
export const auth = getAuth(app); // Export auth for OTP
