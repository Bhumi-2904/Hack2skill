import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const navActions = document.getElementById("navActions");

onAuthStateChanged(auth, async (user) => {
  if (!navActions) return;

  navActions.innerHTML = "";

  if (!user) {
    navActions.innerHTML = `
      <button class="nav-login" onclick="location.href='login.html'">
        Login
      </button>
      <button class="nav-primary" onclick="location.href='signup.html'">
        Sign up
      </button>
    `;
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const role = snap.data()?.role;

  if (role === "admin") {
    navActions.innerHTML += `
      <button class="nav-login" onclick="location.href='admin.html'">
        Admin
      </button>
    `;
  }

  navActions.innerHTML += `
    <button class="nav-logout" id="logoutBtn">
      Logout
    </button>
  `;

  document.getElementById("logoutBtn").onclick = async () => {
    await signOut(auth);
    location.href = "index.html";
  };
});
