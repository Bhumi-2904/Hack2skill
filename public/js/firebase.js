import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  /* same config */
    apiKey: "AIzaSyAowY65Z8J7OlDhVD9DXNCPUprzwCM2qJY",
  authDomain: "campus-event-reminder.firebaseapp.com",
  projectId: "campus-event-reminder",
  storageBucket: "campus-event-reminder.firebasestorage.app",
  messagingSenderId: "481087841052",
  appId: "1:481087841052:web:81d3d04be6e29849bd90d9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
