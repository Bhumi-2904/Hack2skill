console.log("✅ events.js loaded");

import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const eventsContainer = document.getElementById("events");

if (!eventsContainer) {
  console.log("❌ #events container not found");
} else {
  try {
    const snapshot = await getDocs(collection(db, "events"));
    console.log("📦 Events fetched:", snapshot.size);

    snapshot.forEach((doc) => {
      const data = doc.data();

      const startDate = data.date.replaceAll("-", "") + "T100000";
      const endDate = data.date.replaceAll("-", "") + "T120000";

      const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE
&text=${encodeURIComponent(data.title)}
&dates=${startDate}/${endDate}
&details=${encodeURIComponent(data.description)}`;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <h3>${data.title}</h3>
        <p class="event-date">${data.date}</p>
        <p class="event-desc">${data.description}</p>
        <a class="calendar-btn" href="${calendarLink}" target="_blank">
          + Add to Google Calendar
        </a>
      `;

      eventsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("🔥 Error fetching events:", err);
  }
}
