// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase/fireStore";
import { createRandomFood } from "./fake-food";
import { json } from "react-router-dom";

const food = createRandomFood();
export async function FoodModalLoader() {
    // const { restaurantId, foodId } = params as unknown as { restaurantId: string, foodId: string };
    // const foodDoc = doc(db, "restaurant", restaurantId, "meal", foodId);
    // const foodSnapshot = await getDoc(foodDoc);
    // const food = { id: foodSnapshot.id, ...foodSnapshot.data() } as Food;
    return json({
        food,
    })
}