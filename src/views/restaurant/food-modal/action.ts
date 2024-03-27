import { ActionFunctionArgs, json } from "react-router-dom";

export async function FoodModalAction({request}: ActionFunctionArgs) {
    const formData = await request.json();
    console.log('formData', formData);
    return json({});
}