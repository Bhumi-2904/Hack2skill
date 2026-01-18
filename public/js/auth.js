import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
});

function initAuth() {
  const signupBtn = document.getElementById("signupBtn");
  const loginBtn = document.getElementById("loginBtn");

  /* SIGNUP */
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;

      if (!email || !password) {
        alert("Fill all the fields");
        return;
      }

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", cred.user.uid), {
          role
        });

        window.location.href =
          role === "admin" ? "admin.html" : "index.html";
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }

  /* LOGIN */
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Fill all fields");
        return;
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);

        const snap = await getDoc(doc(db, "users", cred.user.uid));
        const role = snap.data().role;

        window.location.href =
          role === "admin" ? "admin.html" : "events.html";
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    });
  }
}
