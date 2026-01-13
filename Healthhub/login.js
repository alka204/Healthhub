// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfl4yfVI-DzewN1CBXi2t7l5ntbQbypQo",
  authDomain: "healthhub-d2995.firebaseapp.com",
  projectId: "healthhub-d2995",
  storageBucket: "healthhub-d2995.appspot.com",
  messagingSenderId: "788950836416",
  appId: "1:788950836416:web:7ea60edcf47f425bfd3925",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // ✅ Redirect to home page after successful login
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/invalid-email") {
      errorMsg.textContent =
        "Invalid email address. Please enter a valid email.";
    } else if (error.code === "auth/wrong-password") {
      errorMsg.textContent = "Incorrect password. Please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMsg.textContent = "No account found with this email.";
    } else {
      errorMsg.textContent = "Something went wrong. Please try again.";
    }
  }
});
