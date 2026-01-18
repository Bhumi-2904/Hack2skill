document.body.style.visibility = "hidden";

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


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  /* 🔐 ROLE CHECK – SOFT FAIL */
  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const role = snap.data().role;
      if (role && role !== "admin") {
        alert("You are not authorized to access admin panel.");
        window.location.href = "index.html";
        return;
      }
    }
    // If role doc missing → allow for now
  } catch (err) {
    console.warn("⚠️ Role check skipped:", err);
  }

  /* LOGOUT */
  const logoutBtn = document.getElementById("adminLogoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await signOut(auth);
      window.location.href = "index.html";
    };
  }

  document.body.style.visibility = "visible";

  attachAdminHandlers();
  loadAdminEvents();
});

/* =========================
   CREATE EVENT HANDLERS
   ========================= */
function attachAdminHandlers() {
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");

  if (!generateBtn || !saveBtn) {
    console.error("❌ Admin buttons not found in DOM");
    return;
  }

  generateBtn.addEventListener("click", async () => {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;

    if (!title || !date) {
      alert("Fill the Title and Date fields.");
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
          body: JSON.stringify({ title, date })
        }
      );

      const data = await res.json();
      document.getElementById("eventDescription").value = data.text || "";

    } catch (err) {
      console.error(err);
      alert("AI error");
    }

    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Description";
  });

  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDescription").value;

    if (!title || !date || !description) {
      alert("Fill all the fields.");
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
      console.error(err);
      alert("Firestore error");
    }
  });
}

/* =========================
   LOAD ADMIN EVENTS
   ========================= */
async function loadAdminEvents() {
  console.log("📋 Loading admin events");

  const container = document.getElementById("adminEvents");
  if (!container) {
    console.error("❌ adminEvents container missing");
    return;
  }

  container.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "events"));

    if (snapshot.empty) {
      container.innerHTML =
        "<p style='text-align:center; opacity:0.7;'>No events yet.</p>";
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
        <button class="delete-icon-btn" title="Delete event">🗑️</button>
      `;

      div.querySelector(".delete-icon-btn").onclick = async () => {
        if (!confirm(`Delete "${data.title}"?`)) return;
        await deleteDoc(doc(db, "events", eventDoc.id));
        loadAdminEvents();
      };

      container.appendChild(div);
    });

  } catch (err) {
    console.error("❌ Error loading events:", err);
    container.innerHTML =
      "<p style='text-align:center; color:#c0393b;'>Error loading events</p>";
  }
}
