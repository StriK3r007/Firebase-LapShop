import { getDataFromDB } from "./utils.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { collection, addDoc, Timestamp, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
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

// product render
const listedProductsCount = document.getElementById("listed-products-count")
const productRenderTable = document.getElementById("product-render-table")

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
        renderProducts(uid)

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
        productImageError.textContent = "";

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
            Swal.fire({
                title: "Product Added Successfuly!",
                icon: "success",
                draggable: true
            });
            productForm.reset();
            uploadedImageUrl = "";
            await renderProducts()
        } catch (e) {
            console.error("Error adding document: ", e);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!"
            });
        }
    })
};

// * render products
const renderProducts = async (uid) => {
    productRenderTable.innerHTML = ''
    const products = await getDataFromDB(null, "products");

    const filteredProducts = products.filter(product => product.uid === uid);

    listedProductsCount.textContent = filteredProducts.length;

    filteredProducts.forEach((product) => {
        const stockVal = product.stock

        productRenderTable.innerHTML += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${product.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold" id="stock-td-${product.docid}">In Stock (${product.stock})</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button class="text-indigo-600 hover:text-indigo-900 cursor-pointer product-edit-btn" data-id="${product.docid}">Edit</button>
                    <button class="text-red-600 hover:text-red-900 cursor-pointer product-delete-btn" data-id="${product.docid}">Delete</button>
                </td>
            </tr>
        `;
        if(stockVal <= 10) {
            const stockTd = document.querySelectorAll(`#stock-td-${product.docid}`)
            if (stockTd) {
                stockTd[0].classList.toggle("text-red-600")
                stockTd[0].textContent = `Low Stock (${product.stock})`;
            }
        }
    });
    attachEventListeners();
};

const attachEventListeners = () => {
    const productEditBtns = document.querySelectorAll(".product-edit-btn");
    productEditBtns.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.id;

            const docRef = doc(db, 'products', productId);

            const productDoc = await getDoc(docRef);
            const productData = productDoc.exists() ? productDoc.data() : {};
            const { name = "", price = "", stock = "", description = "" } = productData;

            Swal.fire({
                title: "Edit your product",
                html: `
                    <input id="productName" class="swal2-input" placeholder="Product Name" value="${name}">
                    <input id="productPrice" class="swal2-input" placeholder="Product Price" value="${price}">
                    <input id="productStock" class="swal2-input" placeholder="Product Stock" value="${stock}">
                    <textarea id="productDescription" rows="4" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Product Description">${description}</textarea>
                `,
                showCancelButton: true,
                confirmButtonText: "Save",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                preConfirm: () => {
                    const productName = document.getElementById('productName').value.trim();
                    const productPrice = document.getElementById('productPrice').value.trim();
                    const productStock = document.getElementById('productStock').value.trim();
                    const productDescription = document.getElementById('productDescription').value.trim();

                    if (!productName || !productPrice || !productStock ||! productDescription) {
                        Swal.showValidationMessage("All fields are required!");
                        return false;
                    }
                    return { productName, productPrice, productStock, productDescription };
                }
            }).then( async(result) => {
                if (result.isConfirmed) {
                    const { productName, productPrice, productStock, productDescription } = result.value;
                    const productData = {
                        name: productName,
                        price: productPrice,
                        stock: productStock,
                        description: productDescription,
                        updatedAt: Timestamp.now()
                    }
                    await updateDoc(docRef, productData);
                    await renderProducts()

                    // console.log({ productName, productPrice, productStock, productDescription });
                }
            });

        });
    });

    const productDeleteBtns = document.querySelectorAll(".product-delete-btn");
    productDeleteBtns.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.dataset.id;
            console.log("Delete product with ID:", productId);

            // const confirmDelete = confirm("Are you sure you want to delete this product?");
            // if (!confirmDelete) return; 

            try {
                const docRef = doc(db, 'products', productId);

                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await deleteDoc(docRef);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        console.log(`Product with ID ${productId} deleted successfully.`);
                        await renderProducts();
                    }
                });


            } catch (error) {
                console.error("Error deleting product:", error);
            }
        });
    });
};
renderProducts()

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location = "../pages/signin.html";
        })
        .catch((error) => {
            console("error occured", error);
        });
});