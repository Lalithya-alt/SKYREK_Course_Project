export function getCart(){
    const  cartstring = localStorage.getItem('cart')
    if(cartstring == null){
        localStorage.setItem('cart', "[]")
        return []
    }
    else{
        return JSON.parse(cartstring)
    }
}

export function updateCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart))
}

export function AddToCart(product, quantity = 1) {
    const cart = getCart()
    //check if product exists in the cart
    const index = cart.findIndex((item) => item.product.productId === product.productId)
    if (index !== -1) {
        // increment quantity
        cart[index].quantity += quantity

        // remove if quantity is 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1)
            alert("Product removed from cart")
        }
    } else {
        // add new product if quantity is positive
        if (quantity > 0) {
            cart.push({ product, quantity })
        }
    }
    updateCart(cart)
    return cart
}

export function getTotalItems(){
    const cart = getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
}

export function getTotalPrice(){
    const cart = getCart()
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export function RemoveFromCart(productId){
    const cart = getCart()
    const index = cart.findIndex((item) => item.product.productId === productId)
    if(index !== -1){
        cart.splice(index, 1)
        updateCart(cart)
    }
}

export function ClearCart(){
    localStorage.removeItem('cart')
}