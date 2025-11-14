import { getDataFromDB } from "./utils.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { auth} from "./firebaseconfig.js";

const allProducts = document.getElementById("all-products")
const userName = document.getElementById("user-name")
const userNameInitials = document.getElementById("user-name-initials")
const logoutBtn = document.getElementById("logout-btn")
const statusLoggedIn = document.getElementById("status-logged-in")
const statusLoggedOut = document.getElementById("status-logged-out")
const viewAllProducts = document.getElementById("view-all-products")

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(user)

        const userInfo = await getDataFromDB(uid, "users");

        statusLoggedIn.classList.replace("hidden", "block")
        statusLoggedOut.classList.replace("block", "hidden")

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
        statusLoggedOut.classList.replace("hidden", "block")
        statusLoggedIn.classList.replace("block", "hidden")
    }
});

const renderProducts = async () => {
    const products = await getDataFromDB(null, "products");
    products.forEach(item => {
        const productId = item.docid
        const name = item.name
        const price = item.price
        const description = item.description
        const image = item.image
        allProducts.innerHTML +=
        `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:scale-[1.02]">
                        <div class="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                            <img src="${image}" alt="${name}">
                        </div>
                        <div class="p-4 space-y-2 mt-2">
                            <h4 class="text-lg font-bold text-gray-900 truncate">${name}</h4>
                            <p class="text-sm text-gray-500">${description}</p>
                            <div class="flex justify-between items-center pt-2">
                            <span class="text-xl font-extrabold text-indigo-600">$${price}</span>
                        <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition duration-150" data-id="${productId}">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `
    })
}; renderProducts()

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location = "../pages/signin.html";
        })
        .catch((error) => {
            console("error occured", error);
        });
});