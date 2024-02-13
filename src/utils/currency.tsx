export function priceFormat(value: number) {
    if (typeof value !== 'number') {
        return '$'+value;
    }
    return new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'}).format(value);
}

// very simple version just for now
export function getSubtotal(cart: Array<{count: number, price: number}>) {
    if (!cart || !cart?.length) return 0;
    return cart.map(item => item.price * item.count).reduce((acc, curr) => acc + curr, 0);
}
