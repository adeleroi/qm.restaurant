import { Spinner } from "@chakra-ui/react";
import { PaymentElement, AddressElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { CustomerOptions, StripeError } from "@stripe/stripe-js";
import clsx from "clsx";
import React from "react";
import { useFetcher } from "react-router-dom";

const userData = {
    email: 'wilfriednguess@gmail.com',
    name: "Ange-Wilfried N'guessan",
    phone: '(581) 777-4338',
}

// little summary because that's really really needed

// With the setupIntent, I will extract the customerId, and paymentMethodId to create a paymentIntent. The core of this feature is the paymentIntent and not the setupIntent as I thought.
// https://docs.stripe.com/payments/save-during-payment?platform=web#charge-saved-payment-method  7

// get userInfo for the setup intent post request to create the customer (name, email, delivery_address);
export function PaymentForm({ onClose }) {
    const fetcher = useFetcher();
    const stripe = useStripe();
    const elements = useElements();
    
    const [errorMessage, setErrorMessage] = React.useState<string | null>();
    const [loading, setLoading] = React.useState(false);
    
    const isDisabled = !stripe || loading;

    const handleError = (error: StripeError) => {
      setLoading(false);
      setErrorMessage(error.message);
    }
  
    async function handleSubmit() {
        if (!stripe || !elements) return;

        setLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        const {error: paymentMethodError, paymentMethod} = await stripe.createPaymentMethod({
            elements,
        });

        if (paymentMethodError) {
            handleError(paymentMethodError);
            return;
        }

        console.log('payment method', paymentMethod);

        const res = await fetch("http://localhost:4242/create-setup-intent", {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify({
                paymentMethodId: paymentMethod.id,
                userData,
            }),
        });

        const { client_secret: clientSecret } = await res.json();
        console.log('client secret', clientSecret);
        const { error } = await stripe.confirmSetup({
            clientSecret,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.href,
            }
        });

        if (error) {
            handleError(error);
        }
        console.log('there');

        onClose();
    }

    return (
        <fetcher.Form onSubmit={handleSubmit} className="w-full">
            {/* <AddressElement options={{mode: 'shipping'}}/> */}
            <PaymentElement/>
            <div className="w-full my-6">
                { errorMessage ? <span className="text-[14px] text-red-500">{ errorMessage }</span> : null }
                <button
                    disabled={isDisabled}
                    className={clsx("text-white font-bold rounded-xl p-3 w-full", {
                        "bg-green-800 cursor-not-allowed": isDisabled,
                        "bg-defaultGreen hover:bg-green-800 cursor-pointer": !isDisabled,
                    })}>
                        <span className='mr-4'>{ loading ? <Spinner color='white' size="sm" /> : null }</span>
                        <span>Save</span>
                </button>
            </div>
        </fetcher.Form>
    )
}
