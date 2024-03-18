import clsx from "clsx";
import { CustomMarker, SportCarIcon } from "../../components/icons/icon";
import { MapBoxMap } from "../../components/store-info/map-mapbox";
import { CheckoutSummary } from "./checkoutSummary";
import { CreatePaymentMethod, PaymentMethodList } from "./payment-method";
import { Elements } from '@stripe/react-stripe-js'
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js'
import { useLoaderData } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const stripeOptions: StripeElementsOptions = {
    mode: 'setup',
    currency: 'cad',
    paymentMethodCreation: 'manual'
}

export function CheckoutView() {
    return (
        <div className="w-full">
            <div className="w-full h-80 relative">
                <MapBoxMap zoom={12}/>
                {/* <div className="absolute inset-0 bg-map-overlay"></div> */}
            </div>
            <div className="bg-gray-100 h-screen w-full items-center gap-16 pt-16 relative pb-32">
                <div className="flex justify-center h-full gap-6 max-w-8xl w-full">
                    <CheckoutOrderSummary/>
                    <CheckoutSummary/>
                </div>
            </div>
        </div>
    )
}

function CheckoutOrderSummary() {
    const isDisabled = false;
    const paymentMethods = useLoaderData();
    console.log('paymentMethods =====>', paymentMethods?.paymentMethods?.data);
    return (
        <section className="bg-white h-full rounded-3xl w-1/2">
            <div className="h-full rounded-3xl w-full">
                <div className="p-6 border-b-2 border-gray-200">
                    <Location address="78 daly avenue" cityAndCountry="Ottawa, ON, Canada" description="du bon"/>
                </div>
                <div className="p-6 border-b-2 border-gray-200">
                    <Instruction/>
                </div>
                <div className="p-6 border-b-2 border-gray-200">
                    {
                        paymentMethods?.paymentMethods?.data?.length ? (
                            <PaymentMethodList data={paymentMethods.paymentMethods.data}/>
                        ) :
                        <Elements options={stripeOptions} stripe={stripePromise}>
                            <CreatePaymentMethod/>
                        </Elements>
                    }
                </div>
                <div className="p-6 border-b-2 border-gray-200">
                    <OrderSummary/>
                </div>
            </div>
            <button
                disabled={isDisabled}
                className={clsx("text-white font-bold rounded-xl px-3 py-4 w-full mt-4", {
                    "bg-green-800 cursor-not-allowed": isDisabled,
                    "bg-defaultGreen hover:bg-green-800 cursor-pointer": !isDisabled,
                })}>
                    Place order
            </button>
        </section>
    )
}

type LocationProps = {
    address: string,
    cityAndCountry: string,
    description: string,
}

function Location({ address, cityAndCountry } : LocationProps) {

    return (
        <CheckoutSummaryListItem
            title="Location"
            subtitle={address}
            subtext={cityAndCountry}
            icon={<CustomMarker fill="#000" width={20} height={20}/>}
        />
    )
}

type CheckoutSummaryListItemProps = {
    title: string,
    subtitle?: string,
    subtext?: string,
    onClick?: () => void,
    icon?: React.ReactNode,
}

export function CheckoutSummaryListItem({ title, subtitle, subtext, onClick, icon } : CheckoutSummaryListItemProps) {
    return (
        <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <div className="group rounded-lg flex py-3 cursor-pointer"
                onClick={onClick}
            >
                <div className="relative flex text-[16px] font-medium items-center w-full z-">
                    <div className="w-10 h-10 rounded-full bg-gray-100  flex items-center justify-center">
                        { icon }
                    </div>
                    <div className="ml-4">
                        <p className="font-semibold">{ subtitle }</p>
                        {
                            subtext ? <p className="text-[14px] text-gray-500">{ subtext }</p> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

function Instruction() {
    const title = "Instructions"
    const subtitle = "Add delivery instructions";
    const subtext = "Ex: Meet outside";
    return (
        <CheckoutSummaryListItem
            title={title}
            subtitle={subtitle}
            subtext={subtext}
            icon={<SportCarIcon width={20} height={20}/>}
        />
    )
}

function OrderSummary() {
    return (
        <div>
            <h1 className="text-xl font-bold">Selected items</h1>
        </div>
    )
}
