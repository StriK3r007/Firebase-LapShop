import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js"

const form = document.getElementById("form")
const email = document.getElementById("email")
const password = document.getElementById("password")

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");


form.addEventListener("submit", (event) => {
    event.preventDefault()

    // * form validation
    emailError.textContent = "";
    passwordError.textContent = "";

    let formValid = true;

    if(email.value.trim() === "") {
        emailError.textContent = "Email is required!";
        formValid = false;
    }
    if(password.value.trim() === "") {
        passwordError.textContent = "Password is required!";
        formValid = false;
    }

    if(!formValid) {
        return
    }

    signInWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            window.location = "../pages/dashboard.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // * Handle Firebase error codes and show appropriate feedback
            if (errorCode === 'auth/invalid-email') {
                emailError.textContent = "Invalid email format.";
            } else if (errorCode === 'auth/user-not-found') {
                emailError.textContent = "No user found with this email.";
            } else if (errorCode === 'auth/wrong-password') {
                passwordError.textContent = "Incorrect password.";
            } else if (errorCode === 'auth/invalid-credential') {
                passwordError.textContent = "The provided credentials are invalid. Please check your input and try again.";
            } else {
                console.log(errorMessage);
            }
        });
})