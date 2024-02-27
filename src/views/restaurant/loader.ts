import { LoaderFunctionArgs, json } from "react-router-dom";
import { Food } from ".";
import { Restaurant } from "../feed";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/fireStore";

export async function RestaurantLoader({ params } : LoaderFunctionArgs) {
    const restaurantId = params.restaurantId as string;
    const restaurantDoc = await getDoc(doc(db, 'restaurant', restaurantId));
    const restaurant = { id: restaurantDoc.id, ...restaurantDoc.data() } as Restaurant;

    const searchQuery = "";
    const searchResults = [] as Array<Food>;
    const defaultSearchSuggestions = [] as Array<Food>;
    return json({
        searchQuery,
        searchResults, 
        defaultSearchSuggestions,
        restaurantInfos: restaurant,
    })
}
