// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDfXVdbqq-FdTd6oyymyydHDx9dSG9rGrE",
  authDomain: "the-akash-workshop.firebaseapp.com",
  projectId: "the-akash-workshop",
  storageBucket: "the-akash-workshop.appspot.com",
  messagingSenderId: "923020459137",
  appId: "1:923020459137:web:7ff57fb60ae8342d7ea180",
  measurementId: "G-7DG0LD185G"
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
