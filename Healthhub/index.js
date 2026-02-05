// ---------------- Firebase Setup ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence);

// ---------------- Logout ----------------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });
}

// ---------------- Book Appointment Links ----------------
const bookLinks = document.querySelectorAll('a[href="#appointment"]');
const appointmentSection = document.getElementById("appointment");

bookLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("Please login first to book appointment");
        window.location.href = "login.html";
      } else if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

// ---------------- Doctor Data ----------------
const doctors = {
  rahul: {
    name: "Dr. Rahul Mehta",
    speciality: "Orthopedic Specialist",
    experience: "10+ Years Experience",
    availability: "Mon – Fri",
    timing: "10:00 AM – 5:00 PM",
    rating: "⭐⭐⭐⭐⭐",
  },
  anjali: {
    name: "Dr. Anjali Sharma",
    speciality: "Cardiologist",
    experience: "8+ Years Experience",
    availability: "Mon – Sat",
    timing: "9:00 AM – 4:00 PM",
    rating: "⭐⭐⭐⭐",
  },
  aman: {
    name: "Dr. Aman Verma",
    speciality: "Neurologist",
    experience: "12+ Years Experience",
    availability: "Mon – Fri",
    timing: "11:00 AM – 6:00 PM",
    rating: "⭐⭐⭐⭐⭐",
  },
};

// ---------------- Elements ----------------
const profileSection = document.getElementById("doctorProfileSection");
const closeBtn = document.getElementById("closeBtn");
const profileBookBtn = document.getElementById("profileBookBtn");
const profileName = document.getElementById("profileName");
const profileSpeciality = document.getElementById("profileSpeciality");
const profileExperience = document.getElementById("profileExperience");
const profileAvailability = document.getElementById("profileAvailability");
const profileTiming = document.getElementById("profileTiming");
const profileRating = document.getElementById("profileRating");

// ---------------- Functions ----------------
function openProfile(doctorId) {
  const doc = doctors[doctorId];
  if (!doc || !profileSection) return;

  profileName.innerText = doc.name;
  profileSpeciality.innerText = "Speciality: " + doc.speciality;
  profileExperience.innerText = "Experience: " + doc.experience;
  profileAvailability.innerText = "Availability: " + doc.availability;
  profileTiming.innerText = "Timing: " + doc.timing;
  profileRating.innerText = "Rating: " + doc.rating;

  profileSection.classList.remove("hidden");
}

function closeProfile() {
  if (profileSection) profileSection.classList.add("hidden");
}

// ---------------- Event Listeners ----------------
if (closeBtn) {
  closeBtn.addEventListener("click", closeProfile);
}

if (profileBookBtn) {
  profileBookBtn.addEventListener("click", () => {
    const appointment = document.getElementById("appointment");
    if (appointment) appointment.scrollIntoView({ behavior: "smooth" });
    closeProfile(); // hide profile after booking click
  });
}

// ---------------- Doctor Buttons ----------------
document.querySelectorAll(".doctor-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const doctorId = btn.dataset.doctor;
    openProfile(doctorId);
  });
});

// ---------------- Appointment Form ----------------
const appointmentForm = document.getElementById("appointmentForm");

function getDoctorEmailByName(name) {
  const map = {
    "Dr. Rahul Mehta": "doctor1@healthhub.com",
    "Dr. Anjali Sharma": "doctor2@healthhub.com",
    "Dr. Aman Verma": "doctor3@healthhub.com",
  };
  return map[name];
}

if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please login first to book appointment");
        window.location.href = "login.html";
        return;
      }

      const patientName = document.getElementById("patientName").value;
      const patientEmail = document.getElementById("patientEmail").value;
      const appointmentDate = document.getElementById("appointmentDate").value;
      const appointmentTime = document.getElementById("appointmentTime").value;
      const doctorName = document.getElementById("doctorName").value;

      const doctorEmail = getDoctorEmailByName(doctorName);

      try {
        await addDoc(collection(db, "appointments"), {
          patientName,
          patientEmail,
          appointmentDate,
          appointmentTime,
          doctorName,
          doctorEmail,
          userId: user.uid,
          status: "pending",
          createdAt: serverTimestamp(),
        });

        alert("✅ Appointment booked successfully!");
        appointmentForm.reset();
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("❌ Failed to book appointment");
      }
    });
  });
}
