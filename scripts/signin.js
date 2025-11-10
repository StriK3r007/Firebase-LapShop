import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js"

const form = document.getElementById("form")
const email = document.getElementById("email")
const password = document.getElementById("password")

form.addEventListener("submit", (event) => {
    event.preventDefault()

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location = "../pages/dashboard.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
})