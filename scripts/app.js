import { getDataFromDB } from "./utils.js";

const allProducts = document.getElementById("all-products")
const viewAllProducts = document.getElementById("view-all-products")
const renderProducts = async () => {
    const products = await getDataFromDB(null, "products");
    products.forEach(item => {
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
                        <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full text-sm transition duration-150">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `
    })
}; renderProducts()