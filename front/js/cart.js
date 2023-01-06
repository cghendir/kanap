let allProducts = []

const orderBtn = document.getElementById("order")
orderBtn.addEventListener("click", orderAction)

function validateRequired(value, msgError, errorEl) {
    errorEl.innerText = ""
    if (!value) {
        errorEl.innerText = msgError
        return false
    } else {
        return true
    }
}

function validateRegEx(pattern, value, error, errorEl) {
    if (!pattern.test(value)) {
        errorEl.innerText = error
        return false
    } else {
        return true
    }
}

async function orderAction(event) {
    event.preventDefault()

    const elFirstName = document.getElementById("firstName")
    const elFirstNameError = document.getElementById("firstNameErrorMsg")
    const firstName = elFirstName.value
    let isValidFirstName = validateRequired(firstName, "Veuillez entrez votre Prénom.", elFirstNameError)

    if (isValidFirstName) {
        isValidFirstName = validateRegEx(/^[a-z\s-]{1,40}$/i, firstName, "Le prénom ne doit pas dépasser 40 caractères.", elFirstNameError)
    }

    const elLastName = document.getElementById("lastName")
    const elLastNameError = document.getElementById("lastNameErrorMsg")
    const lastName = elLastName.value
    let isValidLastName = validateRequired(lastName, "Veuillez entrez votre Nom.", elLastNameError)

    if (isValidLastName) {
        isValidLastName = validateRegEx(/^[a-z\s-]{1,40}$/i, lastName, "Le nom ne doit pas dépasser 40 caractères", elLastNameError)
    }

    const elAddress = document.getElementById("address")
    const elAddressError = document.getElementById("addressErrorMsg")
    const address = elAddress.value
    let isValidAddress = validateRequired(address, "Veuillez entrez votre Adresse.", elAddressError)

    if (isValidAddress) {
        isValidAddress = validateRegEx(/^[a-zA-Z0-9\s,.'-]{3,}$/, address, "L'adresse doit faire plus de 3 caractères", elAddressError)
    }

    const elCity = document.getElementById("city")
    const elCityError = document.getElementById("cityErrorMsg")
    const city = elCity.value
    let isValidCity = validateRequired(city, "Veuillez entrez votre Ville.", elCityError)

    if (isValidCity) {
        isValidCity = validateRegEx(/^[a-zA-Z0-9\s,.'-]{3,}$/, city, "La ville doit faire plus de 3 caractères", elCityError)
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
    
    window.location.href = "./confirmation.html?orderId=" + data.orderId
    console.log(data)
}

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

    const index = products.findIndex(function (product) {
        if (product.id === id && product.colors === color) {
            return true
        } else {
            return false
        }
    })
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

function deleteCartProduct(event) {
    const input = event.target
    const article = input.closest("article")
    const productId = article.dataset.id
    const productColor = article.dataset.color
    const products = getProductsInStorage()

    if (!products) {
        return
    }

    const findIndex = products.findIndex(function (p) {
        if (p.id === productId && p.colors === productColor) {
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

function postToConfirmation() {

}


displayCart()
