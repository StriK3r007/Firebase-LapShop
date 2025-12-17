import { getDataFromDB } from "./utils.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
// import { collection, addDoc, Timestamp, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { auth} from "./firebaseconfig.js";

const userName = document.getElementById("user-name")
const userNameInitials = document.getElementById("user-name-initials")
const logoutBtn = document.getElementById("logout-btn")

// counter
const totalSellersCount = document.getElementById('total-sellers')
const totalCutomersCount = document.getElementById('total-buyers')
const totalProductsCount = document.getElementById('total-products-count')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const userInfo = await getDataFromDB(uid, "users");

        const role = userInfo[0].role;
        if(role !== 'admin') {
            window.location = "../pages/signin.html";
            return
        }


        const name = userInfo[0].fullName
        userName.textContent = `${name}!`

        if (userInfo[0].profile == '') {
            const nameInitials = name.split(" ").slice(0, 2).map(word => word[0]).join('')
            userNameInitials.textContent = nameInitials
        } else {
            const profileImage = document.createElement("img")
            profileImage.classList.add("rounded-full", "h-10", "w-10", "object-cover")
            profileImage.src = userInfo[0].profile
            userNameInitials.appendChild(profileImage)
        }
    } else {
        window.location = "../pages/signin.html"
    }
});

const renderCounter = async() => {
    const products = await getDataFromDB(null, "products");
    const users = await getDataFromDB(null, "users");
    console.log(users)

    // protducts counter
    const totalProducts = products.filter(product => product);
    totalProductsCount.textContent = totalProducts.length;

    // sellers counter
    const totalSellers = users.filter(user => user.role === 'seller')
    totalSellersCount.textContent = totalSellers.length

    // users counter
    const totalCustomers = users.filter(user => user.role === 'customer')
    totalCutomersCount.textContent = totalCustomers.length
}
renderCounter()

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location = "../pages/signin.html";
        })
        .catch((error) => {
            console("error occured", error);
        });
});