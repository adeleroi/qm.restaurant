import React from "react";

type ProductContextState = {
    quantity: number,
    updateQuantity: (t:number) => void,
    hasQuantityChanged: boolean,
    isAlreadyInCart?: boolean,
    isSubmitting: boolean,
    submitToCart: () => void,
};

export const productCountContext = React.createContext<ProductContextState|null>(null);

export function useProductCountContext() {
    const value = React.useContext(productCountContext);
    if (!value) {
        throw new Error("The useProductCountContext hooks must be used within a ProductCountProvider");
    }
    return value;
}
