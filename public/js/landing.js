import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const heroActions = document.getElementById("heroActions");

onAuthStateChanged(auth, async (user) => {
  if (!heroActions) return;

  heroActions.innerHTML = "";

  // USER NOT LOGGED IN
  if (!user) {
    heroActions.innerHTML = `
      <button class="hero-primary" onclick="location.href='login.html'">
        Login
      </button>
      <button class="hero-secondary" onclick="location.href='signup.html'">
        Sign Up
      </button>
    `;
    return;
  }

  // USER LOGGED IN → CHECK ROLE
  const snap = await getDoc(doc(db, "users", user.uid));
  const role = snap.data()?.role;

  if (role === "admin") {
    heroActions.innerHTML = `
      <button class="hero-primary" onclick="location.href='admin.html'">
        Admin Dashboard
      </button>
    `;
  } else {
    heroActions.innerHTML = `
<button class="hero-primary" onclick="location.href='events.html'">
  Explore Events
</button>

    `;
  }
});
