async function getProducts() {
    const res = await fetch("http://localhost:3000/api/products")
    const products = await res.json()
    return products
}

async function getProductWithId() {
    const paramString = window.location.search
    const paramSearch = new URLSearchParams(paramString)

    const url = "http://localhost:3000/api/products/" + paramSearch.get("id")
    const res = await fetch(url)
    const product = await res.json()
    return product
}

function getProductsInStorage() {
    const storageContent = localStorage.getItem("basket")
    const products = JSON.parse(storageContent)
    return products
}