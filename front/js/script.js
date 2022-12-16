async function getProducts() {
    const res = await fetch("http://localhost:3000/api/products")
    const products = await res.json()
    return products
}
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



        /*const a = document.createElement("a");
        let item = document.getElementById("items");
        a.setAttribute("id", "42");
        item.appendChild(a);
        let button = document.getElementById("42");
        button.appendChild(article);
        

        const img = document.createElement("img");
        let articles = document.getElementsByTagName("article");
        articles.appendChild(img);

        const h3 = document.createElement("h3");
        document.getElementsByTagName("article");
        article.appendChild(h3);
        h3.classList.add("productionName");*/

    }
}
displayProducts()


