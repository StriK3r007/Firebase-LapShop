import { getDataFromDB } from "./utils.js";

const renderProductDetail = async() => {
    const mainProductImage = document.getElementById('main-product-image')
    const mainProductName = document.getElementById('main-product-name')
    const mainProductPrice = document.getElementById('main-product-price')
    const mainProductDescription = document.getElementById('main-product-description')
    const mainProductCompanyName = document.getElementById('main-product-company-name')

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


        // 
        mainProductImage.src = productImage;
        mainProductImage.alt = productName;

        // 
        mainProductName.textContent = productName;
        mainProductPrice.textContent = `$${productPrice}.00`
        mainProductDescription.textContent = productDescription
        mainProductCompanyName.textContent = productCompanyName 
    }
}
renderProductDetail()