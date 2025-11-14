import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js"


const form = document.getElementById("form");
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const userPassword = document.getElementById("password");
const userConfirmPassword = document.getElementById("confirm-password");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const statusError = document.getElementById("status-error");

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const name = userName.value.trim()
    const email = userEmail.value.trim()
    const password = userPassword.value.trim()
    const confirmPassword = userConfirmPassword.value.trim()

    // * form validation
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let formValid = true;

    if (name === "") {
        nameError.textContent = "Full name is required!";
        formValid = false;
    }

    if (email === "") {
        emailError.textContent = "Email is required!";
        formValid = false;
    }

    if (password === "") {
        passwordError.textContent = "Password is required!";
        formValid = false;
    }

    if (confirmPassword === "") {
        confirmPasswordError.textContent = "Confirm password is required!";
        formValid = false;
    }

    if (confirmPassword !== password) {
        passwordError.textContent = "Password and confirm password should be same!";
        confirmPasswordError.textContent = "Password and confirm password should be same!";
        formValid = false;
    }

    if (!formValid) {
        return
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            try {
                const userData = {
                    uid: user.uid,
                    fullName: name,
                    email: email,
                    profile: "",
                    role: "customer",
                    createdAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date())
                }

                const docRef = await addDoc(collection(db, "users"), userData);

                // Use firebaseConfig.db here
                // const docRef = await addDoc(collection(firebaseConfig.db, "users"), userData);

                console.log("Document written with ID: ", docRef.id);
                // localStorage.setItem('userID', user.uid); // for single variable

                // localStorage.setItem('userData', JSON.stringify(userData));

                window.location = "../pages/signin.html"
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // * Handle Firebase error codes and show appropriate feedback
            if (errorCode === 'auth/invalid-email') {
                emailError.textContent = "Invalid email format.";
            } else if (errorCode === 'auth/user-not-found') {
                emailError.textContent = "No user found with this email.";
            } else if (errorCode === 'auth/email-already-in-use') {
                emailError.textContent = "This email is already in use. Try signing in instead.";
            } else if (errorCode === 'auth/wrong-password') {
                passwordError.textContent = "Incorrect password.";
            } else if (errorCode === 'auth/invalid-credential') {
                passwordError.textContent = "The provided credentials are invalid. Please check your input and try again.";
            } else if (errorCode === 'auth/weak-password') {
                passwordError.textContent = "Password must be at least 6 characters.";
            } else if (errorCode === 'auth/network-request-failed') {
                statusError.textContent = "No internet access";
            } else {
                console.log(errorMessage);
            }
        });
})