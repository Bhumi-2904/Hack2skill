import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  addDoc,
  collection
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  import {
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ admin.js DOM loaded");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("❌ Not logged in, redirecting");
      window.location.href = "login.html";
      return;
    }

    console.log("✅ Admin authenticated");
    attachAdminHandlers();
  });
});

function attachAdminHandlers() {
  const generateBtn = document.getElementById("generateBtn");
  const saveBtn = document.getElementById("saveBtn");

  if (!generateBtn || !saveBtn) {
    console.error("❌ Admin buttons not found");
    return;
  }

  console.log("✅ Admin buttons found");

  generateBtn.addEventListener("click", async () => {
    console.log("⚡ Generate clicked");

    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;

    if (!title || !date) {
      alert("Title aur date daal pehle");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.innerText = "Thinking...";

    try {
      const res = await fetch("https://hack2skill-62n0.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date })
      });

      const data = await res.json();
      document.getElementById("eventDescription").value = data.text;
    } catch (err) {
      console.error(err);
      alert("AI error");
    }

    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Description";
  });

  saveBtn.addEventListener("click", async () => {
    console.log("💾 Save clicked");

    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const description = document.getElementById("eventDescription").value;

    if (!title || !date || !description) {
      alert("Saare fields bhar");
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
    } catch (err) {
      console.error(err);
      alert("Firestore error");
    }
  });

  loadAdminEvents();
  async function loadAdminEvents() {
  const container = document.getElementById("adminEvents");
  if (!container) return;

  container.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "events"));

    if (snapshot.empty) {
      container.innerHTML = "<p>No events yet.</p>";
      return;
    }

    snapshot.forEach((eventDoc) => {
      const data = eventDoc.data();

      const div = document.createElement("div");
      div.style.border = "1px solid #eee";
      div.style.borderRadius = "10px";
      div.style.padding = "12px";
      div.style.marginBottom = "10px";

      div.innerHTML = `
        <strong>${data.title}</strong><br/>
        <small>${data.date}</small>
        <br/>
        <button class="delete-btn">Delete</button>
      `;

      const deleteBtn = div.querySelector(".delete-btn");

      deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(
          `Delete "${data.title}"? This cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "events", eventDoc.id));
          alert("Event deleted");
          loadAdminEvents(); // refresh list
        } catch (err) {
          console.error(err);
          alert("Delete failed");
        }
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading events</p>";
  }
}

}
