function changeQuantity(event) {
    const input = event.target
    const quantity = input.value
    const article = input.closest("article")
    const id = article.dataset.id
    const color = article.dataset.color
    const cart = localStorage.getItem("cart");
    const priceEl = document.querySelector(`article[data-id="${id}"][data-color="${color}"] .cart__item__content__description p:nth-child(3)`)

    if(!cart) {
        return 
    }
    const products = JSON.parse(cart)
    const index = products.findIndex(function(product){
        if(product.id === id && product.colors === color){
            return true
        }else{
            return false
        }
    })
    if(index < 0){
        return
    }
    products[index].quantity = parseInt(quantity)
    
    priceEl.innerText = products[index].price * parseInt(quantity) + " €"

    localStorage.setItem("cart", JSON.stringify(products))
}

function cartProduct() {
    const cart = localStorage.getItem("cart");
    if (!cart) {
        return
    }

    const products = JSON.parse(cart)

    const cartItems = document.getElementById("cart__items")

    for (const product of products) {
        const article = document.createElement("article")
        const cartImg = document.createElement("div")
        const img = document.createElement("img")
        const cartContent = document.createElement("div")
        const cartDescription = document.createElement("div")
        const h2 = document.createElement("h2")
        const pColor = document.createElement("p")
        const pPrice = document.createElement("p")
        const price = product.price * product.quantity
        const cartSetting = document.createElement("div")
        const cartStgQuantity = document.createElement("div")
        const pQuantity = document.createElement("p")
        const inputQuantity = document.createElement("input")


        article.classList.add("cart__item")
        article.dataset.id = product.id
        article.dataset.color = product.colors

        cartImg.classList.add("cart__item__img")
        cartContent.classList.add("cart__item__content")
        cartDescription.classList.add("cart__item__content__description")
        cartSetting.classList.add("cart__item__content__settings")
        cartStgQuantity.classList.add("cart__item__content__settings__quantity")
        inputQuantity.classList.add("itemQuantity")

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

        pPrice.innerText = price + " €"

        pQuantity.innerText = "Qté : "

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

        cartStgQuantity.appendChild(pQuantity)
        cartStgQuantity.appendChild(inputQuantity)
    }

}

cartProduct()