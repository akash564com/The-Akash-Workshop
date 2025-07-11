// ✅ 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDfXVdbqq-FdTd6oyymyydHDx9dSG9rGrE",
  authDomain: "the-akash-workshop.firebaseapp.com",
  projectId: "the-akash-workshop",
  storageBucket: "the-akash-workshop.firebasestorage.app",
  messagingSenderId: "923020459137",
  appId: "1:923020459137:web:7ff57fb60ae8342d7ea180",
  measurementId: "G-7DG0LD185G"
};
firebase.initializeApp(firebaseConfig);

// ✅ 2. Setup Recaptcha
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => console.log("Recaptcha verified")
});

// ✅ 3. Elements
const phoneInput = document.getElementById("phoneInput");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = document.getElementById("otpInput");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ 4. Send OTP
if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", async () => {
    const phoneNumber = phoneInput.value.trim();
    if (!phoneNumber.startsWith("+91")) return alert("Use +91 format");

    try {
      const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmation;
      otpInput.classList.remove("hidden");
      verifyOtpBtn.classList.remove("hidden");
      alert("✅ OTP sent!");
    } catch (err) {
      alert("❌ OTP Error: " + err.message);
    }
  });
}

// ✅ 5. Verify OTP
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async () => {
    const code = otpInput.value.trim();
    try {
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      alert("✅ Logged in as " + user.phoneNumber);
      window.location.href = "/";
    } catch (err) {
      alert("❌ Invalid OTP: " + err.message);
    }
  });
}

// ✅ 6. Google Login
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      alert("✅ Google Login: " + user.displayName);
      window.location.href = "/";
    } catch (err) {
      alert("❌ Google Login Error: " + err.message);
    }
  });
}

// ✅ 7. Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem("user");
      alert("🚪 Logged out");
      window.location.href = "/login.html";
    });
  });
}

// ✅ 8. Protect Pages
firebase.auth().onAuthStateChanged(user => {
  const protectedPaths = ["/tools/", "/dashboard.html"];
  const onProtectedPage = protectedPaths.some(path => window.location.pathname.startsWith(path));

  if (onProtectedPage && !user) {
    window.location.href = "/login.html";
  }

  const info = document.getElementById("userInfo");
  if (info && user) {
    info.innerText = user.displayName || user.email || user.phoneNumber || "Logged in";
  }
});
