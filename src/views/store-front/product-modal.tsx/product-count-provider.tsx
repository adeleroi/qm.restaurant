

import React from "react";
import { useFetcher } from "react-router-dom";
import { Product } from "..";
import { productCountContext } from "./product-count-context";

export function ProductCountProvider({ children, product, isAlreadyInCart } : { children: React.ReactNode, product: Product, isAlreadyInCart?: boolean }) {
    const [ quantity, setQuantity ] = React.useState(product?.count || 0);
    const [ hasQuantityChanged, setQuantityChanged ] = React.useState(false);
    const updateQuantity = (count: number) => {
        setQuantity(count);
        setQuantityChanged(true);
    }
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state !== 'idle';

    function submitToCart() {
        if (isAlreadyInCart && !hasQuantityChanged) {
            return;
        }
        fetcher.submit(
            JSON.stringify({count: quantity, productId: product?.id}),
            { method: 'post', encType: 'application/json', action: `/store/${product.storeId}?openCart=true` }
        );
    }
    return (
        <productCountContext.Provider value={{
            hasQuantityChanged,
            quantity,
            updateQuantity,
            isAlreadyInCart,
            isSubmitting,
            submitToCart,
        }}>
            { children }
        </productCountContext.Provider>
    )
}
