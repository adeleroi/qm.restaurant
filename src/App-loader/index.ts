import { json } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/fireStore'
import { Product } from '../views/store-front'
import Cookies from 'js-cookie'
import { Store } from '../views/feed'
import { SearchResult, UserType } from '../user-location/new-google-place-autocomplete'

export async function AppLoader() {
  const userId = Cookies.get('qm_session_id') as string;
  if (userId) {
    console.log('connected');
    const userDoc = await getDoc(doc(db, 'users', userId));
    const user = { ...userDoc.data() } as UserType;

    const addressSnapshot = await getDocs(query(collection(db, 'users', userId, 'addresses'), orderBy('timestamp', "desc")));
    const addresses: Array<SearchResult> = [];
    addressSnapshot.forEach(address => {
      addresses.push({ id: address.id, ...address.data() } as SearchResult);
    })

    const carts: Array<Product> = [];
    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    cartSnapshot.forEach(cartItem => {
        carts.push({id: cartItem.id, ...cartItem.data()} as Product);
    })
    const uniqueStoreList = [...new Set(carts.map(item => item.storeId))];
    const storeCartInfosDocs = await Promise.all(
        uniqueStoreList.map(storeId => getDoc(doc(db, "store", storeId))),
    )
    const storeCartInfos = storeCartInfosDocs.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: {id: curr.id, ...curr.data()}}), {}) as Record<string, Store & {cart: Array<Product>, storeId: string }>;

    const cartMap: Record<string, Array<Product>> = {};
    carts.forEach(item => {
        if (!cartMap[item.storeId]) {
            cartMap[item.storeId] = [];
        }
        cartMap[item.storeId].push(item);
    })
    for (const [key, ] of Object.entries(storeCartInfos)) {
      storeCartInfos[key]['cart']  = cartMap[key]
      storeCartInfos[key]['storeId'] = key;
    }

    console.log('new address', addresses)
  
    return json({ carts, storeCartInfos: storeCartInfos, cartCount: uniqueStoreList.length, user, addresses: [...addresses] })
  }
  return json({ carts: [], storeCartInfos: [], cartCount: 0, user: {}, addresses: [] })

}
