import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js"

const form = document.getElementById("form")
const fullName = document.getElementById("name")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirm-password")

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");

form.addEventListener("submit", (event) => {
    event.preventDefault()

    // * form validation
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let formValid = true;

    if(fullName.value.trim() === "") {
        nameError.textContent = "Full name is required!";
        formValid = false;
    }

    if(email.value.trim() === "") {
        emailError.textContent = "Email is required!";
        formValid = false;
    }

    if(password.value.trim() === "") {
        passwordError.textContent = "Password is required!";
        formValid = false;
    }

    if(confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Confirm password is required!";
        formValid = false;
    }

    if(confirmPassword.value.trim() !== password.value.trim()) {
        passwordError.textContent = "Password and confirm password should be same!";
        confirmPasswordError.textContent = "Password and confirm password should be same!";
        formValid = false;
    }

    if(!formValid) {
        return
    }

    createUserWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Account created successfuly!")
            window.location = "../pages/signin.html" 
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
            } else if (errorCode === 'auth/email-already-in-use') {
                emailError.textContent = "This email is already in use. Try signing in instead.";
            } else {
                console.log(errorMessage);
            }
        });
})