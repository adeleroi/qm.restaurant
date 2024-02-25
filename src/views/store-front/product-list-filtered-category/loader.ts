import { LoaderFunctionArgs, json, redirect } from "react-router-dom";
import { Product } from "..";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/fireStore";
import Cookies from "js-cookie";

export async function FilteredByCategoryProductLoader({params}: LoaderFunctionArgs) {
    const userId = Cookies.get('qm_session_id') as string;
    if (!userId) {
        return redirect('/',)
    }
    const { storeId, categoryId } = params as Record<string, string>;

    const productList: Array<Product> = [];

    const cartItemIds = new Map<string, number>();
    const productListRef = collection(db, "store", storeId, "product");
    const q = query(productListRef, where("category", "==", categoryId));
    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    const filteredProductSnapshot = await getDocs(q);

    cartSnapshot.forEach(cartItem => {
        cartItemIds.set(cartItem.id, cartItem.data().count)
    });

    filteredProductSnapshot.forEach(prod => {
        const product = { id: prod.id, count: 0, ...prod.data(), storeId } as Product;
        if (cartItemIds.has(prod.id)) {
            product.count = Number(cartItemIds.get(prod.id));
        }
        productList.push(product);
    });

    return json({ productList });
}
