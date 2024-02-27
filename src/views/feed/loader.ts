import { getDocs } from "firebase/firestore";
import { json } from "react-router-dom";
import { Restaurant, Store } from ".";
import { restaurantCollection, storeCollection } from "../../firebase/fireStore";
import { Product } from "../store-front";

export async function Feedloader() {
    const stores: Array<Store> = [];
    const restaurants: Array<Restaurant> = [];
    const storeDocs = getDocs(storeCollection);
    const restaurantDocs = getDocs(restaurantCollection);

    const [
        storeSnapshot,
        restaurantSnapshot,
    ] = await Promise.all([
        storeDocs,
        restaurantDocs,
    ]);

    storeSnapshot.forEach(doc => {
        stores.push({id: doc.id, ...doc.data()} as Store)
    })
    restaurantSnapshot.forEach(doc => {
        restaurants.push({ id: doc.id, ...doc.data() } as Restaurant)
    })

    const searchQuery = "";
    const searchResults = [] as Array<Partial<Product>>;
    const defaultSearchSuggestions = [] as Array<Partial<Product>>;

    return json({
        stores,
        restaurants,
        searchQuery,
        searchResults,
        defaultSearchSuggestions
    })
}
