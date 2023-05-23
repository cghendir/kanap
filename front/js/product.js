/**
 * Récupère les produit par Id depuis l'API
 * Construit le DOM html du produit
 */
async function displayProduct() {
    const product = await getProductWithId()
    const image = document.getElementsByClassName("item__img")[0]
    const title = document.getElementById("title")
    const price = document.getElementById("price")
    const description = document.getElementById("description")
    const colors = document.getElementById("colors")
    const img = document.createElement("img")

    img.setAttribute("src", product.imageUrl)
    img.setAttribute("alt", product.altTxt)

    for (const color of product.colors) {
        const option = document.createElement("option")
        option.setAttribute("value", color)
        option.innerText = color
        colors.appendChild(option)
    }

    title.innerText = product.name
    price.innerText = product.price
    description.innerText = product.description

    image.appendChild(img)
}

/**
 * Ajout ou mise a jour d'un produit dans le LocalStorage
 * @returns {Promise<void>}
 */
async function addToCart() {
    const product = await getProductWithId()
    const elColors = document.getElementById("colors")
    const elQuantity = document.getElementById("quantity")

    const color = elColors.value
    const quantity = parseInt(elQuantity.value)

    const error = document.getElementById("basket-error")
    if (error) {
        error.remove()
    }

    if (!color || !quantity) {
        const itemContainer = document.getElementsByClassName("item__content")[0]
        const btnContainer = document.getElementsByClassName("item__content__addButton")[0]
        const error = createCartError()
        itemContainer.insertBefore(error, btnContainer)
        return false;

    }

    let cart = localStorage.getItem("basket")
    if (!cart) {
        cart = [];
    } else {
        cart = JSON.parse(cart)
    }

    const data = {
        imageUrl: product.imageUrl,
        id: product._id,
        name: product.name,
        colors: color,
        quantity: quantity
    }

    const findIndex = findIndexByIdAndColor(cart, data.id, data.colors)

    if (findIndex < 0) {
        cart.push(data);
        alert("Le produit " + data.name + " a été ajouté au panier.") 
    } else {
        cart[findIndex].quantity = cart[findIndex].quantity + quantity;
        alert("La quantité du produit " + data.name + " a été modifié.")
    }

    localStorage.setItem("basket", JSON.stringify(cart));
}

/**
 * Construit un DOM html d'erreur
 * @returns {HTMLParagraphElement}
 */
function createCartError() {
    const p = document.createElement("p")
    p.style.cssText = "text-align:center; margin-top:35px;margin-bottom:0;color:#fbbcbc;"
    p.innerText = "Vous devez sélectionnez une couleur et une quantité."
    p.setAttribute("id", "basket-error")
    return p
}

/**
 * Ajout de l'action ajout au panier au bouton
 * @returns {void}
 */
function addActionToBtnCart() {
    const button = document.getElementById("addToCart")
    button.addEventListener("click", addToCart)
}


displayProduct()
addActionToBtnCart()