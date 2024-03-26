import { LoaderFunctionArgs, json } from "react-router-dom";

function getUserData() {
    return { customerId: 'cus_Pl1jmprDk2lvue' };
}

export async function CheckoutLoader({request} : LoaderFunctionArgs) {
    const storeId = new URL(request.url).searchParams.get('storeId');
    // const order = getOrder(storeId)
    const userData = getUserData();
    const res = await fetch(`http://localhost:4242/get-payment-method?customerId=${userData.customerId}`);
    const paymentMethods = await res.json();

    console.log('loader paymentMethod', paymentMethods)
    return json({ paymentMethods });
}
