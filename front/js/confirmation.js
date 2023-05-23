/**
 * Récupère l'orderId depuis l'url
 * @returns {void}
 */
function displayOrderId() {
    const orderConfirmationId = document.getElementById("orderId")

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    const orderId = urlParams.get('orderId');

    orderConfirmationId.innerText = orderId
}


displayOrderId()