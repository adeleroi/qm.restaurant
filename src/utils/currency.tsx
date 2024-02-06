export function priceFormat(value: number) {
    return new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'}).format(value);
}

// very simple version just for now
export function getSubtotal(cart) {
    return cart.map(item => item.price * item.count).reduce((acc, curr) => acc + curr, 0);
}
