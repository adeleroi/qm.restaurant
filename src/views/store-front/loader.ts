import { LoaderFunctionArgs, json } from "react-router-dom";
import { Product } from ".";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/fireStore";
import Cookies from "js-cookie";

export async function storeFrontLoader({params, request}: LoaderFunctionArgs) {
    const userId = Cookies.get('qm_session_id') as string;

    const searchQuery = new URL(request.url).searchParams.get('searchQuery') || "";
    const searchResults = [] as Array<Product>;
    const defaultSearchSuggestions = [] as Array<Product>;

    const storeId = params.storeId as string;
    const carts: Array<Product> = [];
    const cartItemIds = new Map<string, number>();
    const productMap: Record<string, Array<Product>> = {};
    const categories: Array<string> = [];

    const productListRef = collection(db, "store", storeId, "product");

    if (userId) {
        const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
        cartSnapshot.forEach(cartItem => {
            const data = cartItem.data();
            carts.push({id: cartItem.id, ...data} as Product);
            cartItemIds.set(cartItem.id, data.count);
        });
    }
    
    const [
        productSnapshot,
        categorySnapshot,
    ] = await Promise.all([
        await getDocs(productListRef),
        await getDocs(productListRef),
    ]);
    
    categorySnapshot.forEach(cat => {
        categories.push(cat.data().category);
    });

    productSnapshot.forEach(prod => {
        const productInStore = { id: prod.id, count: 0, storeId, ...prod.data() } as Product;

        if (searchQuery) {
            if (productInStore.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
                productInStore.description.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
            ) {
                searchResults.push(productInStore);
            }
            return;
        }
        if (userId && cartItemIds.has(prod.id)) {
            productInStore.count = Number(cartItemIds.get(prod.id));
        }
        const { category } = productInStore;
        if (!productMap[category]) {
            productMap[category] = [];
        }
        productMap[category].push(productInStore);
    });

    const storeDoc = await getDoc(doc(db, "store", storeId));
    const storeInfos = { id: storeDoc.id, ...storeDoc.data() }

    return json({ productMap, storeInfos, categories: [...new Set(categories)], searchQuery, searchResults, defaultSearchSuggestions });
}