import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =================================
   REDIRECT LOGGED-IN USERS
   (ONLY ON LOGIN / SIGNUP PAGES)
   ================================= */
document.body.style.visibility = "hidden";

onAuthStateChanged(auth, async (user) => {
  const isAuthPage =
    location.pathname.includes("login") ||
    location.pathname.includes("signup");

  // auth.js should NOT control other pages
  if (!isAuthPage) {
    document.body.style.visibility = "visible";
    return;
  }

  // user not logged in → show page
  if (!user) {
    document.body.style.visibility = "visible";
    return;
  }

  // user logged in → check role
  const snap = await getDoc(doc(db, "users", user.uid));

  // Firestore doc may not exist yet (Google first login)
  if (!snap.exists()) {
    document.body.style.visibility = "visible";
    return;
  }

  const role = snap.data().role;

  window.location.href =
    role === "admin" ? "/admin.html" : "/events.html";
});

/* =================================
   INIT AUTH
   ================================= */
document.addEventListener("DOMContentLoaded", initAuth);

function initAuth() {
  const signupBtn = document.getElementById("signupBtn");
  const loginBtn = document.getElementById("loginBtn");
  const googleSignupBtn = document.getElementById("googleSignupBtn");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  const provider = new GoogleAuthProvider();

  /* ========= STUDENT SIGNUP (EMAIL) ========= */
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Fill all the fields");
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", cred.user.uid), {
          role: "student"
        });

        window.location.href = "/events.html";

      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }

  /* ========= LOGIN (EMAIL) ========= */
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Fill all fields");
        return;
      }

      try {
        const cred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const snap = await getDoc(doc(db, "users", cred.user.uid));

        if (!snap.exists()) {
          document.body.style.visibility = "visible";
          return;
        }

        const role = snap.data().role;

        window.location.href =
          role === "admin" ? "/admin.html" : "/events.html";

      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }

  /* ========= GOOGLE SIGNUP / LOGIN ========= */
  async function googleAuth() {
    try {
      const cred = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);

      // first-time Google user
      if (!snap.exists()) {
        await setDoc(userRef, {
          role: "student"
        });
      }

      window.location.href = "/events.html";

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (googleSignupBtn) {
    googleSignupBtn.addEventListener("click", googleAuth);
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", googleAuth);
  }
}
