// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
}

// ✅ OTP Login
function sendOTP() {
  const phone = document.getElementById("phone").value;
  const appVerifier = window.recaptchaVerifier;

  firebase.auth().signInWithPhoneNumber(phone, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("OTP sent!");
    })
    .catch((error) => {
      alert("OTP Error: " + error.message);
    });
}

function verifyOTP() {
  const code = document.getElementById("otp").value;

  window.confirmationResult.confirm(code)
    .then((result) => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Invalid OTP");
    });
}
