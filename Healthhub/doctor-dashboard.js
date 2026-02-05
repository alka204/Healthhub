import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Import Firebase config from local file
import { firebaseConfig } from "./firebase-config.js";


// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 DOM elements
const appointmentsContainer = document.getElementById("appointmentsContainer");
const doctorNameDisplay = document.getElementById("doctorNameDisplay");
const logoutBtn = document.getElementById("logoutBtn");

// ✅ Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "doctor-login.html";
});

// ✅ Function to load appointments
function loadAppointments(doctorEmail) {
  const q = query(
    collection(db, "appointments"),
    where("doctorEmail", "==", doctorEmail),
  );

  onSnapshot(q, (snapshot) => {
    appointmentsContainer.innerHTML = "";

    if (snapshot.empty) {
      appointmentsContainer.innerHTML = "<p>No appointments yet.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const status = data.status || "pending";

      // Create card
      const card = document.createElement("div");
      card.className = "appointment-card";

      card.innerHTML = `
        <p><strong>Patient:</strong> ${data.patientName}</p>
        <p><strong>Email:</strong> ${data.patientEmail}</p>
        <p><strong>Date:</strong> ${data.appointmentDate}</p>
        <p><strong>Time:</strong> ${data.appointmentTime}</p>
        <p><strong>Status:</strong> 
          <span id="status-${docId}" class="${status}">${status}</span>
        </p>
        ${
          status === "pending"
            ? `
          <button id="accept-${docId}">Accept</button>
          <button id="reject-${docId}">Reject</button>
        `
            : ""
        }
      `;

      appointmentsContainer.appendChild(card);

      // ✅ Accept button
      if (status === "pending") {
        document
          .getElementById(`accept-${docId}`)
          .addEventListener("click", async () => {
            await updateDoc(doc(db, "appointments", docId), {
              status: "accepted",
            });
          });

        // ❌ Reject button
        document
          .getElementById(`reject-${docId}`)
          .addEventListener("click", async () => {
            await updateDoc(doc(db, "appointments", docId), {
              status: "rejected",
            });
          });
      }
    });
  });
}

// ✅ Auth Guard + load appointments
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "doctor-login.html";
    return;
  }

  doctorNameDisplay.textContent = user.email;
  loadAppointments(user.email); // Load appointments for logged-in doctor
});
