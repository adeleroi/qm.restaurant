import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { LoaderFunctionArgs, json } from 'react-router-dom';
import { db } from '../../../firebase/fireStore';
import Cookies from 'js-cookie';
import { Product } from '..';

export async function ProductModalLoader({ params }: LoaderFunctionArgs) {
    const userId = Cookies.get('qm_session_id') as string;
    const { productId, storeId } = params as Record<string, string>;

    const cartItems = new Map<string, number>();
    const similarProductList: Array<Product> = [];

    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    cartSnapshot.forEach(item => {
        cartItems.set(item.id, item.data().count);
    });

    const productDoc = await getDoc(doc(db, 'store', storeId, 'product', productId));
    const count = !cartItems.get(productDoc.id) ? 1 : cartItems.get(productDoc.id);
    const currProduct = { id: productDoc.id, ...productDoc.data(), count, storeId } as Product ;
    
    const similarProductQuery = query(collection(db, "store", storeId, "product"), where('category', '==', currProduct.category));
    const similarProductSnapshot = await getDocs(similarProductQuery);

    similarProductSnapshot.forEach(product => {
        if (product.id == currProduct.id) return;
        similarProductList.push({ id: product.id, ...product.data(), count: cartItems.get(product.id), storeId } as Product);
    })

    return json({ product: currProduct, similarProductList, cartItemMap: Object.fromEntries(cartItems) });
}
