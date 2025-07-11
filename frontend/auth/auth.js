// Initialize Recaptcha
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => {
    console.log("Recaptcha verified");
  }
});

// Elements
const phoneInput = document.getElementById("phoneInput");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = document.getElementById("otpInput");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");

// Step 1: Send OTP
sendOtpBtn.addEventListener("click", async () => {
  const phoneNumber = phoneInput.value.trim();
  if (!phoneNumber.startsWith("+91")) {
    alert("Use +91 format for Indian numbers");
    return;
  }

  try {
    const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
    window.confirmationResult = confirmation;

    otpInput.classList.remove("hidden");
    verifyOtpBtn.classList.remove("hidden");
    alert("✅ OTP sent to " + phoneNumber);
  } catch (err) {
    alert("❌ OTP Error: " + err.message);
  }
});

// Step 2: Verify OTP
verifyOtpBtn.addEventListener("click", async () => {
  const otpCode = otpInput.value.trim();
  if (otpCode.length !== 6) {
    alert("OTP must be 6 digits");
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(otpCode);
    const user = result.user;
    alert("✅ Logged in: " + user.phoneNumber);
    window.location.href = "/"; // Redirect to homepage or dashboard
  } catch (err) {
    alert("❌ OTP Invalid: " + err.message);
  }
});

// Step 3: Google Login
googleLoginBtn.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    alert("✅ Google Login: " + user.displayName);
    window.location.href = "/"; // Redirect to homepage or dashboard
  } catch (err) {
    alert("❌ Google Login Error: " + err.message);
  }
});
// Firebase Recaptcha for OTP
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible',
  callback: () => console.log("Recaptcha verified")
});

// Elements (for login.html only)
const phoneInput = document.getElementById("phoneInput");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = document.getElementById("otpInput");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

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

// Logout (optional button in header or tools)
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem("user");
      alert("🚪 Logged out");
      window.location.href = "/login.html";
    });
  });
}

// Protect tool pages
firebase.auth().onAuthStateChanged((user) => {
  const protectedPages = ["/tools/", "/dashboard.html"]; // add protected paths
  const onProtectedPage = protectedPages.some(path => window.location.pathname.startsWith(path));

  if (onProtectedPage && !user) {
    window.location.href = "/login.html";
  }
});

