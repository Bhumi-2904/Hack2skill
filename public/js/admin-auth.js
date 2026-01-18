import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* SHOW PAGE AFTER DOM LOAD */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.visibility = "visible";

  const loginBtn = document.getElementById("loginBtn");

  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    // hide ONLY while authenticating
    document.body.style.visibility = "hidden";

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));

      if (!snap.exists() || snap.data().role !== "admin") {
        alert("Not authorized as admin");
        await signOut(auth);
        document.body.style.visibility = "visible";
        return;
      }

      window.location.href = "admin.html";

    } catch (err) {
      alert(err.message);
      document.body.style.visibility = "visible";
    }
  };
});
