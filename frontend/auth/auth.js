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

firebase.initializeApp(firebaseConfig);

// ✅ Elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Email/Password Login
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value);
      alert("✅ Login successful");
      window.location.href = "/";
    } catch (err) {
      alert("❌ Login Failed: " + err.message);
    }
  });
}

// ✅ Register New Account
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
      alert("✅ Registered successfully!");
    } catch (err) {
      alert("❌ Registration Failed: " + err.message);
    }
  });
}

// ✅ Google Sign-in
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
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

// ✅ Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem("user");
      alert("🚪 Logged out");
      window.location.href = "/login.html";
    });
  });
}

// ✅ Protect Pages + Show Logged-in Info
firebase.auth().onAuthStateChanged(user => {
  const protectedPaths = ["/tools/", "/dashboard.html"];
  const onProtectedPage = protectedPaths.some(path => window.location.pathname.startsWith(path));

  if (onProtectedPage && !user) {
    window.location.href = "/login.html";
  }

  const info = document.getElementById("userInfo");
  if (info && user) {
    info.innerText = user.displayName || user.email || "Logged in";
  }
});
