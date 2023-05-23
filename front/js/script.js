/**
 * Récupere les produitss depuis l'API
 * Parcours les produits récupèré
 * Construit et affiche le DOM html de chaque produit
 */
async function displayProducts() {
    const products = await getProducts()
    const items = document.getElementById("items")

    for (const product of products) {
        const a = document.createElement("a")
        const article = document.createElement("article");
        const img = document.createElement("img")
        const h3 = document.createElement("h3")
        const p = document.createElement("p")

        const url = "./product.html?id=" + product._id
        a.setAttribute("href", url)

        img.setAttribute("src", product.imageUrl)
        img.setAttribute("alt", product.altTxt)

        h3.setAttribute("class", "productName")
        h3.innerText = product.name

        p.setAttribute("class", "productDescription")
        p.innerText = product.description

        article.appendChild(img)
        article.appendChild(h3)
        article.appendChild(p)

        a.appendChild(article)

        items.appendChild(a)
    }
}


displayProducts()


