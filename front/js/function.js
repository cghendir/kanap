/**
 * Récupère les produits de l'API
 * @returns {Promise<Object[]>}
 */
async function getProducts() {
    const res = await fetch("http://localhost:3000/api/products")
    const products = await res.json()
    return products
}

/**
 * Récupère l'Id pour récupèrer le produit depuis l'API
 * @returns {Promise<Object>}
 */
async function getProductWithId() {
    const paramString = window.location.search
    const paramSearch = new URLSearchParams(paramString)

    const url = "http://localhost:3000/api/products/" + paramSearch.get("id")
    const res = await fetch(url)
    const product = await res.json()
    return product
}

/**
 * Retourne les produits du Localstorage
 * @returns {<object[]>}
 */
function getProductsInStorage() {
    const storageContent = localStorage.getItem("basket")
    const products = JSON.parse(storageContent)
    return products
}

/**
 * Récupère les produits par id et couleur
 * @param {object} products 
 * @param {string} id 
 * @param {string} color 
 * @returns {number}
 */
function findIndexByIdAndColor(products, id, color) {
    const findIndex = products.findIndex(function (p) {
        if (p.id === id && p.colors === color) {
            return true;
        } else {
            return false;
        }
    });
    return findIndex
}