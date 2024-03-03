// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase/fireStore";
import { createRandomFood } from "./fake-food";
import { json } from "react-router-dom";
import { Food } from "./model";

const food = createRandomFood();

function getRequiredOptions(food: Food) {
    return food.customization.filter((foodOptionList) => (foodOptionList.minNumOptions > 0));
}

function buildRequiredOptionState(food: Food) {
    const requiredOptions = getRequiredOptions(food);
    const requiredOptionsMap = {} as Record<string, boolean>;
    requiredOptions.forEach(opList => {
        requiredOptionsMap[opList.title] = false; 
    });
    console.log('map', requiredOptionsMap);
    return requiredOptionsMap;
}

export async function FoodModalLoader() {
    // const { restaurantId, foodId } = params as unknown as { restaurantId: string, foodId: string };
    // const foodDoc = doc(db, "restaurant", restaurantId, "meal", foodId);
    // const foodSnapshot = await getDoc(foodDoc);
    // const food = { id: foodSnapshot.id, ...foodSnapshot.data() } as Food;
    const requiredOptionState = buildRequiredOptionState(food);
    return json({
        food,
        requiredOptionState
    })
}