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

    const findIndex = cart.findIndex(function (p) {
        if (p.id === data.id && p.colors === data.colors) {
            return true;
        } else {
            return false;
        }
    });

    if (findIndex < 0) {
        cart.push(data);
    } else {
        cart[findIndex].quantity = cart[findIndex].quantity + quantity;
    }

    localStorage.setItem("basket", JSON.stringify(cart));


}

function createCartError() {
    const p = document.createElement("p")
    p.style.cssText = "text-align:center; margin-top:35px;margin-bottom:0;color:#fbbcbc;"
    p.innerText = "Vous devez sélectionnez une couleur et une quantité."
    p.setAttribute("id", "basket-error")
    return p
}

function addActionToBtnCart() {
    const button = document.getElementById("addToCart")
    button.addEventListener("click", addToCart)
}

displayProduct()
addActionToBtnCart()