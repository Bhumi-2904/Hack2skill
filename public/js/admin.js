import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   AUTH + ROLE CHECK
   ========================= */

onAuthStateChanged(auth, async (user) => {
  // Not logged in → bye
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    // No role doc OR not admin → kick
    if (!snap.exists() || snap.data().role !== "admin") {
      alert("Unauthorized access. Admins only.");
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }

    // ✅ Authorized admin
    attachAdminHandlers();
    loadAdminEvents();

  } catch (err) {
    console.error("Admin auth error:", err);
    alert("Auth check failed");
    window.location.href = "index.html";
  }
});

/* =========================
   LOGOUT
   ========================= */

const logoutBtn = document.getElementById("adminLogoutBtn");
if (logoutBtn) {
  logoutBtn.onclick = async () => {
    await signOut(auth);
    window.location.href = "index.html";
  };
}

/* =========================
   ADMIN HANDLERS
   ========================= */

function attachAdminHandlers() {
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");

  if (!generateBtn || !saveBtn) {
    console.error("Admin buttons missing");
    return;
  }

  generateBtn.onclick = async () => {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;

    if (!title || !date) {
      alert("Fill title and date");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Thinking...";

    try {
      const res = await fetch(
        "https://hack2skill-62n0.onrender.com/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title })
        }
      );

      const data = await res.json();
      document.getElementById("eventDescription").value = data.text || "";

    } catch (err) {
      alert("AI error");
    }

    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Description";
  };

  saveBtn.onclick = async () => {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDescription").value;

    if (!title || !date || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        description
      });

      document.getElementById("eventTitle").value = "";
      document.getElementById("eventDate").value = "";
      document.getElementById("eventDescription").value = "";

      loadAdminEvents();

    } catch (err) {
      alert("Firestore error");
    }
  };
}

/* =========================
   LOAD EVENTS
   ========================= */

async function loadAdminEvents() {
  const container = document.getElementById("adminEvents");
  container.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "events"));

    if (snapshot.empty) {
      container.innerHTML =
        "<p style='text-align:center;opacity:0.7;'>No events yet.</p>";
      return;
    }

    snapshot.forEach((eventDoc) => {
      const data = eventDoc.data();

      const div = document.createElement("div");
      div.innerHTML = `
        <div class="admin-event-info">
          <strong>${data.title}</strong>
          <small>${data.date}</small>
        </div>
        <button class="delete-icon-btn">🗑️</button>
      `;

      div.querySelector("button").onclick = async () => {
        if (!confirm(`Delete "${data.title}"?`)) return;
        await deleteDoc(doc(db, "events", eventDoc.id));
        loadAdminEvents();
      };

      container.appendChild(div);
    });

  } catch (err) {
    container.innerHTML =
      "<p style='color:red;text-align:center;'>Failed to load events</p>";
  }
}