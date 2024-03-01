import { ActionFunctionArgs, json } from "react-router-dom";

export async function FoodModalAction({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const foodOption = {} as Record<string, FormDataEntryValue[] | null>;
    for (const key of formData.keys()) {
        foodOption[key] = null
        foodOption[key] = formData.getAll(key)
        console.log(foodOption);
    }
    // for (const [key, value] of formData.entries()) {
    //     console.log(key, value)
    // }
    return json({});
}