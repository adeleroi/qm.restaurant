import { LoaderFunctionArgs, json } from "react-router-dom";
import { Article } from "..";


function getRequiredOptions(food: Article) {
    return food.customizations?.filter((foodOptionList) => (foodOptionList.minNumOptions > 0)) || [];
}

function buildRequiredOptionState(food: Article) {
    const requiredOptions = getRequiredOptions(food);
    const requiredOptionsMap = {} as Record<string, boolean>;
    requiredOptions.forEach(opList => {
        requiredOptionsMap[opList.title] = false; 
    });
    return requiredOptionsMap;
}

export async function FoodModalLoader({ params } : LoaderFunctionArgs) {
    const { restaurantId, foodId } = params as Record<string, string>
    const food = await getMenuItem(restaurantId, foodId)
    const requiredOptionState = buildRequiredOptionState(food);
    return json({
        food,
        requiredOptionState
    })
}

async function getMenuItem(restaurantId: string, foodId: string) {
    const data = await fetch(`http://localhost:4242/api/v1/restaurant/${restaurantId}/food/${foodId}`, {
        headers: {'Content-Type': 'application/json'}
    })
    const menu = await data.json();
    return menu;
}