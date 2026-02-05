import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Import Firebase config from local file
import { firebaseConfig } from "./firebase-config.js";

// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("doctorLoginForm");
const errorMsg = document.getElementById("errorMsg");

// ✅ Hardcoded list of doctor emails
const doctors = [
  "doctor1@healthhub.com",
  "doctor2@healthhub.com",
  "doctor3@healthhub.com",
];

// Ensure form exists before adding listener
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Trim inputs to remove extra spaces
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    // Reset previous error message
    if (errorMsg) errorMsg.textContent = "";

    if (!email || !password) {
      if (errorMsg) errorMsg.textContent = "Please enter email and password.";
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // ✅ Check if email is a registered doctor
      if (!doctors.includes(user.email)) {
        if (errorMsg)
          errorMsg.textContent = "Access denied: Not a registered doctor";
        await auth.signOut();
        return;
      }

      // ✅ Successful login → redirect
      window.location.href = "doctor-dashboard.html";
    } catch (error) {
      console.error("Login error:", error);
      switch (error.code) {
        case "auth/invalid-email":
          if (errorMsg) errorMsg.textContent = "Invalid email address.";
          break;
        case "auth/wrong-password":
          if (errorMsg) errorMsg.textContent = "Incorrect password.";
          break;
        case "auth/user-not-found":
          if (errorMsg)
            errorMsg.textContent = "No account found with this email.";
          break;
        default:
          if (errorMsg)
            errorMsg.textContent = "Login failed. Please try again.";
      }
    }
  });
}
