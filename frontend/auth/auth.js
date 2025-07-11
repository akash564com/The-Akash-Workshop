// ✅ Firebase Config (same as login.html)
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

// ✅ Google Login
const googleLoginBtn = document.getElementById("googleLoginBtn");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      alert("✅ Logged in as " + user.displayName);
      window.location.href = "/";
    } catch (err) {
      alert("❌ Google Login Error: " + err.message);
    }
  });
}

// ✅ Email/Password Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      alert("✅ Logged in");
      window.location.href = "/";
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    }
  });
}

// ✅ Email/Password Registration
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      alert("✅ Account created & logged in");
      window.location.href = "/";
    } catch (err) {
      alert("❌ Registration failed: " + err.message);
    }
  });
}

// ✅ Page Protection
firebase.auth().onAuthStateChanged(user => {
  const protectedPages = ["/tools/", "/dashboard.html"];
  const onProtectedPage = protectedPages.some(path => window.location.pathname.startsWith(path));
  if (onProtectedPage && !user) {
    window.location.href = "/login.html";
  }

  const info = document.getElementById("userInfo");
  if (info && user) {
    info.innerText = user.displayName || user.email || "Logged in";
  }
});
