/** Variable permettant de sauvegarder tout les produits provenant de l'API 
 * afin de récupèrer le prix correct de chaque produit inséré au panier */
let allProducts = []

/** Ajout de l'action au bouton ayany pour ID "order" */
const orderBtn = document.getElementById("order")
orderBtn.addEventListener("click", orderAction)

/**
 * Valide si un champ n'est pas vide 
 * affiche un message d'erreur en cas de champ vide 
 * @param {string} value 
 * @param {string} msgError 
 * @param {HTMLElement} errorEl 
 * @returns {boolean}
 */
function validateRequired(value, msgError, errorEl) {
    errorEl.innerText = ""
    if (!value) {
        errorEl.innerText = msgError
        return false
    } else {
        return true
    }
}

/**
 * Valide le format d'un champ
 * affiche unmessage d'erreur en cas de format invalide
 * @param {string} pattern 
 * @param {string} value 
 * @param {string} error 
 * @param {HTMLElement} errorEl 
 * @returns {boolean}
 */
function validateRegEx(pattern, value, error, errorEl) {
    if (!pattern.test(value)) {
        errorEl.innerText = error
        return false
    } else {
        return true
    }
}

function validateMaxLength(len, value, error, errorEl) {
    if (value?.length > len) {
        errorEl.innerText = error
        return false
    } else {
        return true
    }
}

function validateMinLength(len, value, error, errorEl) {
    if (value?.length < len) {
        errorEl.innerText = error
        return false
    } else {
        return true
    }
}

/**
 * Valide tout les champs lié a la commande 
 * Soumet les données de commande a l'API
 * @param {Event} event 
 * @returns {Promise<void>}
 */
async function orderAction(event) {
    event.preventDefault()

    const elFirstName = document.getElementById("firstName")
    const elFirstNameError = document.getElementById("firstNameErrorMsg")
    const firstName = elFirstName.value
    let isValidFirstName = validateRequired(firstName, "Veuillez entrez votre Prénom.", elFirstNameError)

    if (isValidFirstName){
        isValidFirstName = validateMaxLength(41, firstName, "Le prénom ne doit pas dépasser 40 caractères.", elFirstNameError)
    }

    if (isValidFirstName) {
        isValidFirstName = validateRegEx(/[a-zA-Z\s]+/i, firstName, "Le format du prénom est invalide.", elFirstNameError)
    }

    const elLastName = document.getElementById("lastName")
    const elLastNameError = document.getElementById("lastNameErrorMsg")
    const lastName = elLastName.value
    let isValidLastName = validateRequired(lastName, "Veuillez entrez votre Nom.", elLastNameError)

    if (isValidLastName){
        isValidLastName = validateMaxLength(41, lastName, "Le nom ne doit pas dépasser 40 caractères.", elLastNameError)
    }

    if (isValidLastName) {
        isValidLastName = validateRegEx(/[a-z\s-]+/i, lastName, "Le format du nom est invalide.", elLastNameError)
    }

    const elAddress = document.getElementById("address")
    const elAddressError = document.getElementById("addressErrorMsg")
    const address = elAddress.value
    let isValidAddress = validateRequired(address, "Veuillez entrez votre Adresse.", elAddressError)
    

    if (isValidAddress){
        isValidAddress = validateMinLength(3, address, "L'adresse doit dépasser 3 caractères.", elAddressError)
    }

    if (isValidAddress) {
        isValidAddress = validateRegEx(/^[a-zA-Z0-9\s,.'-]{3,}$/, address, "Le format de l'adresse est invalide", elAddressError)
    }

    const elCity = document.getElementById("city")
    const elCityError = document.getElementById("cityErrorMsg")
    const city = elCity.value
    let isValidCity = validateRequired(city, "Veuillez entrez votre Ville.", elCityError)


    if (isValidCity){
        isValidCity = validateMinLength(3, city, "La ville doit dépasser 3 caractères.", elCityError)
    }

    if (isValidCity) {
        isValidCity = validateRegEx(/[a-zA-Z0-9\s,.'-]+/, city, "Le format de la ville est invalide.", elCityError)
    }

    const elEmail = document.getElementById("email")
    const elEmailError = document.getElementById("emailErrorMsg")
    const email = elEmail.value
    let isValidEmail = validateRequired(email, "Veuillez entrez votre Email.", elEmailError)

    if (isValidEmail) {
        isValidEmail = validateRegEx(/^(\w+[\.-]?\w+)@(\w+[\.-]?\w+).([a-z]{2,5})+$/i, email, "L'email doit être conforme", elEmailError)
    }

    if (!isValidFirstName || !isValidLastName || !isValidAddress || !isValidCity || !isValidEmail) {
        return
    }

    const contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    }

    const productsStore = getProductsInStorage()

    if ((productsStore?.length || 0) < 1) {
        alert("Vous devez avoir au moins 1 produit dans le panier")
        return
    }

    const products = []
    for (const product of productsStore) {
        products.push(product.id)
    }

    const res = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contact: contact,
            products: products
        })
    })
    const data = await res.json()

    localStorage.removeItem("basket")
    window.location.href = "./confirmation.html?orderId=" + data.orderId
}

/**
 * Modifie la quantité d'un produit dans le panier
 * Recalcule la quantité et prix total du panier
 * @param {InputEvent} event 
 * @returns {void}
 */
function changeQuantity(event) {
    const input = event.target
    const quantity = input.value
    const article = input.closest("article")
    const id = article.dataset.id
    const color = article.dataset.color
    const products = getProductsInStorage()
    const priceEl = document.querySelector(`article[data-id="${id}"][data-color="${color}"] .cart__item__content__description p:nth-child(3)`)

    if (!products) {
        return
    }

    const index = findIndexByIdAndColor(products, id, color)
    if (index < 0) {
        return
    }
    const product = products[index]
    product.quantity = parseInt(quantity)

    const price = getProductPrice(product.id)
    priceEl.innerText = price * parseInt(quantity) + " €"

    localStorage.setItem("basket", JSON.stringify(products))

    displayTotalPriceAndQuantity(products)
}

/**
 * Récupère et retournele prix d'un produit a partir de son ID
 * @param {string} id 
 * @returns {number|null}
 */
function getProductPrice(id) {
    const findIndex = allProducts.findIndex(function (p) {
        if (p._id === id) {
            return true
        } else {
            return false
        }
    })
    if (findIndex > -1) {
        return allProducts[findIndex].price
    } else {
        return null
    }
}

/**
 * Construit et affiche le DOM Html d'un produit
 * @param {Object} product 
 * @returns {void}
 */
function displayCartProduct(product) {
    const cartItems = document.getElementById("cart__items")

    const price = getProductPrice(product.id)

    if (!price) {
        return
    }

    const article = document.createElement("article")
    const cartImg = document.createElement("div")
    const img = document.createElement("img")
    const cartContent = document.createElement("div")
    const cartDescription = document.createElement("div")
    const h2 = document.createElement("h2")
    const pColor = document.createElement("p")
    const pPrice = document.createElement("p")
    const cartSetting = document.createElement("div")
    const cartStgQuantity = document.createElement("div")
    const pQuantity = document.createElement("p")
    const inputQuantity = document.createElement("input")
    const cartStgDelete = document.createElement("dev")
    const pDelete = document.createElement("p")

    article.classList.add("cart__item")
    article.dataset.id = product.id
    article.dataset.color = product.colors

    cartImg.classList.add("cart__item__img")
    cartContent.classList.add("cart__item__content")
    cartDescription.classList.add("cart__item__content__description")
    cartSetting.classList.add("cart__item__content__settings")
    cartStgQuantity.classList.add("cart__item__content__settings__quantity")
    inputQuantity.classList.add("itemQuantity")
    cartStgDelete.classList.add("cart__item__content__settings__delete")
    pDelete.classList.add("deleteItem")

    img.setAttribute("src", product.imageUrl)
    img.setAttribute("alt", product.altTxt)

    inputQuantity.setAttribute("type", "number")
    inputQuantity.setAttribute("name", "itemQuantity")
    inputQuantity.setAttribute("min", "1")
    inputQuantity.setAttribute("max", "100")
    inputQuantity.setAttribute("value", product.quantity)
    inputQuantity.addEventListener("change", changeQuantity)


    h2.innerText = product.name
    pColor.innerText = product.colors
    pPrice.innerText = price * product.quantity + " €"
    pQuantity.innerText = "Qté : "
    pDelete.innerText = "Supprimer"
    pDelete.addEventListener("click", deleteCartProduct)

    cartItems.appendChild(article)
    article.appendChild(cartImg)
    cartImg.appendChild(img)
    article.appendChild(cartContent)
    cartContent.appendChild(cartDescription)
    cartContent.appendChild(cartSetting)
    cartDescription.appendChild(h2)
    cartDescription.appendChild(pColor)
    cartDescription.appendChild(pPrice)
    cartSetting.appendChild(cartStgQuantity)
    cartSetting.appendChild(cartStgDelete)
    cartStgQuantity.appendChild(pQuantity)
    cartStgQuantity.appendChild(inputQuantity)
    cartStgDelete.appendChild(pDelete)
}

/**
 * calcule et affiche la quantité et le prix total des produits
 * @param {Object[]} products 
 * @returns {void}
 */
function displayTotalPriceAndQuantity(products) {
    let total = 0
    let quantity = 0

    for (const product of products) {
        const price = getProductPrice(product.id)
        const totalPrice = price * product.quantity
        quantity += product.quantity
        total += totalPrice
    }

    const elTotalPrice = document.getElementById("totalPrice")
    const elTotalQuantity = document.getElementById("totalQuantity")
    elTotalPrice.innerText = total
    elTotalQuantity.innerText = quantity
}

/**
 * Récupère les produit du panier 
 * parcours les produits récupèré 
 * construit le DOM Html de chaque produit
 * @returns {Promise<void>}
 */
async function displayCart() {
    allProducts = await getProducts()
    const products = getProductsInStorage()

    if (!products) {
        return
    }

    for (const product of products) {
        displayCartProduct(product)
    }
    displayTotalPriceAndQuantity(products)
}

/**
 * Supprime un produit du panier et recalcule la quantité et le prix total des produits
 * @param {Event} event 
 * @returns {void}
 */
function deleteCartProduct(event) {
    const input = event.target
    const article = input.closest("article")
    const productId = article.dataset.id
    const productColor = article.dataset.color
    const products = getProductsInStorage()

    if (!products) {
        return
    }

    const findIndex = products.findIndex(function (product) {
        if (product.id === productId && product.colors === productColor) {
            return true
        } else {
            return false
        }
    })

    if (findIndex > -1) {
        products.splice(findIndex, 1)
    }
    localStorage.setItem("basket", JSON.stringify(products))

    article.remove()

    displayTotalPriceAndQuantity(products)
}


displayCart()
