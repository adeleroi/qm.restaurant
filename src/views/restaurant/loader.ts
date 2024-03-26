import { LoaderFunctionArgs, json } from "react-router-dom";

export async function RestaurantLoader({ params } : LoaderFunctionArgs) {
    const storeData = await getMenu(params.restaurantId as string);
    console.log('storeData', storeData);

    return json({
        storeData,
    })
}

async function getMenu(restId: string) {
    const data = await fetch(`http://localhost:4242/api/v1/restaurant/${restId}`, { headers: { 'Content-Type': 'application/json' }});
    const menu = await data.json();
    return menu;
}
