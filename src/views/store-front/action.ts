import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/fireStore";
import { ActionFunctionArgs, json, redirect } from "react-router-dom";
import Cookies from "js-cookie";

export async function storeFrontAction({request, params}: ActionFunctionArgs) {
    const shouldOpenCart = new URL(request.url).searchParams.get('openCart');
    const { storeId, categoryId } = params as Record<string, string>;
    const userId = Cookies.get('qm_session_id') as string;
    const { productId, count: itemCount } = await request.json() as Record<string, string>;
    const productInStore = await getDoc(doc(db, "store", storeId, "product", productId));
    const productInCartRef = doc(db, "users", userId, "cart", productId);

    await runTransaction(db, async (transaction) => {
        const productInCartDoc = await transaction.get(productInCartRef);
        if (!productInCartDoc.exists()) {
            transaction.set(productInCartRef, {
                ...productInStore.data(),
                timestamp: serverTimestamp(),
                count: +itemCount,
                storeId,
            })
            return;
        }
        if (+itemCount !== 0) {
            transaction.update(productInCartRef, {count: +itemCount, timestamp: serverTimestamp()});
        } else {
            transaction.delete(productInCartRef);
        }
    });

    if (!shouldOpenCart) return json({});
    const pathname = categoryId ? `/store/${storeId}/category/${categoryId}?openCart=true` : `/store/${storeId}?openCart=true`;
    return redirect(`${pathname}`);
}
