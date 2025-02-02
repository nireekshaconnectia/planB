import crypto from 'crypto';
import Cookies from "js-cookie";

// Decrypt session data from cookie or sessionStorage
const encryptedSessionData = Cookies.get('userSession');  // Or sessionStorage.getItem('userSession');

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, process.env.ENCRYPTION_IV);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};

// Decrypt session data
let sessionData;
try {
  sessionData = decryptData(encryptedSessionData);
} catch (error) {
  console.error("Failed to decrypt session:", error);
}

if (sessionData) {
  const { phoneNumber, otpVerified } = sessionData;

  if (otpVerified) {
    // Proceed to fetch data based on phone number
    fetch(`/api/user-data/${phoneNumber}`)
      .then(response => response.json())
      .then(userData => {
        console.log("User Data:", userData);
      })
      .catch(error => console.error("Failed to fetch user data:", error));
  } else {
    console.error("OTP verification failed.");
  }
} else {
  console.error("Invalid session data.");
}
