import { Link, json, useLoaderData } from "react-router-dom";
import { StoreCard } from "../components/card";
import { getDocs } from "firebase/firestore";
import { storeCollection } from "../firebase/fireStore";


type StoreOffer = {
    isPercentage: boolean,
    value: number,
    description: string,
}

type Geolocation = {
    long: number,
    lat: number,
    postalCode: string,
    streetAddress: string,
}

type Location = {
    address: string,
    city: string, 
    country: string,
    geoLocation: Geolocation
} 

type Store = {
    id: string,
    name: string,
    availablityStatus: string,
    location: Location,
    phoneNumber: string,
    description: string,
    deliveryTime: Date,
    imageUrl: string,
    offers: StoreOffer,
    sells: string,
    closingHour: Date,
    openingHour: Date
    // estimatedDeliveryTime: Date 
}

export async function loader() {
    const stores: Array<Store> = [];
    const snapshot = await getDocs(storeCollection);
    snapshot.forEach(doc => {
        stores.push({id: doc.id, ...doc.data()} as Store)
    })
    return json({stores})
}

export function StoreList() {
    const loader = useLoaderData();
    const stores = (loader as unknown as  { stores: Array<Store>})?.stores;
    return (
        <section className="grid mx-auto max-w-6xl">
            <div className="mt-20">
                <h1 className="text-4xl font-bold mb-8">Grocery store</h1>
            </div>
            <ul className='grid grid-cols-3 w-full gap-4 max-w-6xl'>
                {
                    stores.map((store, idx) => (
                        <Link to={`${store.id}`} key={idx}>
                            <StoreCard
                                title={store.name}
                                description={store?.sells ?? "Groceries . Organic . Alcohol"}
                                alt={store?.name + 'img'}
                                src={store?.imageUrl ?? "https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg"}
                                className=''
                                offer={store?.offers?.description ?? "20% off"}
                                deliveryTime="Delivery by 11am"
                                key={idx}
                            />
                        </Link>
                ))
                }
            </ul>
        </section>
    )
}
