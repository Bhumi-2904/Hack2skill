import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const eventsContainer = document.getElementById("eventsContainer");

if (!eventsContainer) {
  console.warn("⚠️ eventsContainer not found in DOM");
} else {
  loadEvents();
}

async function loadEvents() {
  try {
    const snapshot = await getDocs(collection(db, "events"));

    // EMPTY STATE
    if (snapshot.empty) {
      eventsContainer.innerHTML = `
        <p style="text-align:center; opacity:0.7;">
          No upcoming events yet.
        </p>
      `;
      return;
    }

    snapshot.forEach((eventDoc) => {
      const data = eventDoc.data();

      const title = data.title || "Untitled Event";
      const date = data.date || "TBA";
      const description =
        data.description || "Event details will be updated soon.";

      // Google Calendar formatting
      const startDate = date !== "TBA"
        ? date.replaceAll("-", "") + "T100000"
        : "";
      const endDate = date !== "TBA"
        ? date.replaceAll("-", "") + "T120000"
        : "";

      const calendarLink =
        `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(title)}` +
        `&dates=${startDate}/${endDate}` +
        `&details=${encodeURIComponent(description)}`;

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <div class="event-card-body">
          <span class="event-badge">Event</span>

          <h3 class="event-title">${title}</h3>

          <div class="event-meta">
            <span>📅 ${date}</span>
          </div>

          <p class="event-desc">
            ${description}
          </p>

          <a
            class="calendar-btn"
            href="${calendarLink}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Add to Google Calendar
          </a>
        </div>
      `;

      eventsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Error fetching events:", err);
    eventsContainer.innerHTML = `
      <p style="text-align:center; color:#c0393b;">
        Failed to load events. Please try again later.
      </p>
    `;
  }
}
