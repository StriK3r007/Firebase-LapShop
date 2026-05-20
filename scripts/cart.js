import { getDataFromDB } from "./utils.js";

const renderProductDetail = async() => {
    const cartDisplay = document.getElementById('cart')
    // getting item from local storage
    let productData = localStorage.getItem('product')
    console.log(productData)
    if (productData) {
        productData = JSON.parse(productData);
        const productId = productData[0]?.docid
        const products = await getDataFromDB(null, "products");
        const filteredProduct = products.filter(product => product.docid === productId)

        const productName = filteredProduct[0].name; 
        const productImage = filteredProduct[0].image; 
        const productPrice = filteredProduct[0].price
        const productDescription = filteredProduct[0].description
        const productUser = await getDataFromDB(filteredProduct[0].uid, "users")
        const productCompanyName = productUser[0]?.companyName

        productData.map(product => {
            console.log(product)
            cartDisplay.innerHTML += `
                <div class="flex items-center border-b pb-6 mb-6">
                <div class="w-24 h-24 bg-gray-100 rounded-lg">
                    <img src="${product.image}" alt="" id="main-product-image">
                </div>

                <div class="ml-6 flex-1">
                    <h3 class="font-semibold text-lg">${product.name}</h3>
                    <p class="text-sm text-gray-500"></p>

                    <div class="flex items-center mt-3 space-x-3">
                        <input type="number" value="1" min="1"
                            class="w-16 border rounded-md text-center py-1">
                        <button class="text-sm text-red-500 hover:underline">
                            Remove
                        </button>
                    </div>
                </div>

                <p class="font-bold text-lg text-gray-900">Rs. ${product.price}</p>
            </div>
            `
        })
    }
    buyNowButton.addEventListener('click', () => {
        window.location = '../pages/cart.html'
    })
}
renderProductDetail()
