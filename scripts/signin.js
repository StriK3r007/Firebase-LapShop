import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";
import { getDataFromDB } from "./utils.js";

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
        .then(async (userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;

            const userInfo = await getDataFromDB(uid, "users")
            const userRole = userInfo[0].role

            // const role = localStorage.setItem("role", userRole)

            // const userID = localStorage.getItem(userData); // for single variable
            // localStorage.clear(); // clearing all local storage
            // localStorage.removeItem('username'); // removing specific item

            // let userData = localStorage.getItem('userData');
            // if (userData) {
            //     userData = JSON.parse(userData);
            //     // const signedInUserId = userData.uid
            // }

            if (userRole === "seller") {
                window.location = "../pages/seller_dashboard.html"
            } else if (userRole === 'admin') {
                window.location = "../pages/admin_dashboard.html"
            } else if (userRole === "buyer") {
                window.location = "../pages/dashboard.html"
            } else {
                window.location = "../index.html"
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
            } else if (errorCode === 'auth/wrong-password') {
                passwordError.textContent = "Incorrect password.";
            } else if (errorCode === 'auth/invalid-credential') {
                passwordError.textContent = "The provided credentials are invalid. Please check your input and try again.";
            } else if (errorCode === 'auth/network-request-failed') {
                passwordError.textContent = "No internet access";
            } else {
                console.log(errorMessage);
            }
        });
})