import { getDataFromDB } from "./utils.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

const companyName = document.getElementById("company-name")
const companyNameInitials = document.getElementById("company-name-initials")
const logoutBtn = document.getElementById("logout-btn")

// product
const productForm = document.getElementById("product-form")
const productName = document.getElementById("product-name")
const productPrice = document.getElementById("price")
const productStock = document.getElementById("stock")
const productDescription = document.getElementById("description")
const productImage = document.getElementById("image")

// ! product-errors
const productNameError = document.getElementById("product-name-error")
const productPriceError = document.getElementById("product-price-error")
const productStockError = document.getElementById("product-stock-error")
const productDescriptionError = document.getElementById("product-description-error")
const productImageError = document.getElementById("product-image-error")

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;

        const userInfo = await getDataFromDB(uid, "users");

        const compName = userInfo[0].companyName
        companyName.textContent = compName

        if (userInfo[0].profile == '') {
            const compNameInitials = compName.split(" ").slice(0, 2).map(word => word[0]).join('')
            companyNameInitials.textContent = compNameInitials
        } else {
            const profileImage = document.createElement("img")
            profileImage.classList.add("rounded-full", "h-10", "w-10", "object-cover")
            profileImage.src = userInfo[0].profile
            companyNameInitials.appendChild(profileImage)
        }

        addProduct(uid)


    } else {
        window.location = "../pages/signin.html"
    }
});

// * cloudnary
let uploadedImageUrl = "";
var myWidget = cloudinary.createUploadWidget(
    {
        cloudName: "dhutmj2vk",
        uploadPreset: "lapshop_products",
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            uploadedImageUrl = result.info.secure_url
        }
    }
);

productImage.addEventListener("click", () => {
        myWidget.open();
    }, false
);

// * add product
const addProduct = (uid) => {
    productForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        productNameError.textContent = "";
        productPriceError.textContent = "";
        productStockError.textContent = "";
        productDescriptionError.textContent = "";
        // productImageError.textContent = "";

        const name = productName.value.trim()
        const price = productPrice.value.trim()
        const stock = productStock.value.trim()
        const description = productDescription.value.trim()

        let formValid = true;

        if (name === "") {
            productNameError.textContent = "Product name is required!";
            formValid = false;
        }
        if (price === "") {
            productPriceError.textContent = "Product price is required!";
            formValid = false;
        }
        if (stock === "") {
            productStockError.textContent = "Product stock is required!";
            formValid = false;
        }
        if (description === "") {
            productDescriptionError.textContent = "Product description is required!";
            formValid = false;
        }
        if (!uploadedImageUrl) {
            productImageError.textContent = "Please upload a product image!";
            formValid = false;
        }
        if (!formValid) {
            return
        }

        try {
            const productData = {
                uid,
                name,
                price,
                stock,
                description,
                image: uploadedImageUrl,
                createdAt: Timestamp.now()
            }
            await addDoc(collection(db, "products"), productData);
            alert("product published")
            productForm.reset();
            uploadedImageUrl = "";
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    })
};

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location = "../pages/signin.html";
        })
        .catch((error) => {
            console("error occured", error);
        });
});