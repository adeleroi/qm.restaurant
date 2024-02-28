import { LoaderFunctionArgs, json } from "react-router-dom";
import { Food } from ".";
import { Restaurant } from "../feed";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/fireStore";

export async function RestaurantLoader({ params } : LoaderFunctionArgs) {
    const restaurantId = params.restaurantId as string;
    const foodList: Array<Food> = [];
    const [
        restaurantSnapshot,
        foodSnapshot,
    ] = await Promise.all([
        getDoc(doc(db, 'restaurant', restaurantId)),
        getDocs(collection(db, 'restaurant', restaurantId, 'meal')),
    ])

    const restaurant = { id: restaurantSnapshot.id, ...restaurantSnapshot.data() } as Restaurant;
    foodSnapshot.forEach((food) => {
        foodList.push({ id: food.id, ...food.data() } as Food);
    });


    const searchQuery = "";
    const searchResults = [] as Array<Food>;
    const defaultSearchSuggestions = [] as Array<Food>;
    return json({
        searchQuery,
        searchResults, 
        defaultSearchSuggestions,
        restaurantInfos: restaurant,
        foodList,
    })
}
