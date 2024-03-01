import { Link, useLoaderData } from "react-router-dom";
import { StoreCard } from "../../components/card";
import Nigeria from '../../assets/country-flag/nigeria.png';
import China from '../../assets/country-flag/china.png';
import Italy from '../../assets/country-flag/italy.png';
import IvoryCoast from '../../assets/country-flag/ivory-coast.png';
import { priceFormat } from "../../utils/currency";
import { ScrollableList } from "../store-front/list-product";

const FLAGMAP = {
    "NGA": Nigeria,
    "CNA": China,
    "RDC": IvoryCoast,
    "ITA": Italy,
}

type StoreOffer = {
    isPercentage: boolean,
    value: number,
    description: string,
}

type Geolocation = {
    long?: number,
    lat?: number,
    latitude?: number,
    longitude?: number,
    postalCode: string,
    streetAddress: string,
}

type Location = {
    address: string,
    city: string, 
    country: string,
    geolocation: Geolocation
} 

export type Store = {
    id: string,
    name: string,
    availablityStatus: string,
    location: Location,
    phoneNumber: string,
    description: string,
    deliveryTime: Date,
    imgUrl: string,
    offers: StoreOffer,
    sells: string,
    closingHour: Date,
    openingHour: Date
    backgroundColor: string,
    // estimatedDeliveryTime: Date 
}

export type Restaurant = {
    id: string,
    name: string,
    location: Location,
    phoneNumber: string,
    description: string,
    countryTag: Array<keyof typeof FLAGMAP>,
    imgUrl: string,
}

type FeedLoaderType = {
    stores: Array<Store>,
    restaurants: Array<Restaurant>,
}

export function Feed() {
    const { stores, restaurants } = useLoaderData() as FeedLoaderType;

    return (
        <div className="grid place-items-center w-full">
        <div className="w-full max-w-7xl">
            <section className="mt-16">
                <h1 className="text-2xl font-bold">Restaurants</h1>
                <ul className="max-w-7xl grid grid-cols-4 gap-3 mt-8">
                    {
                        restaurants?.map((rest, idx) => {
                            return (
                                <Link to={`/restaurant/${rest.id}`} key={idx}>
                                    <RestaurantCard name={rest.name} flags={rest.countryTag} image={rest.imgUrl}/>
                                </Link>
                            )
                        })
                    }
                </ul>
            </section>
            <section className="mt-16 mb-16">
                <h1 className="text-2xl font-bold">Grocery stores</h1>
                <ul className='grid grid-flow-col w-full gap-4 max-w-7xl mt-8'>
                    {
                        stores?.map((store, idx) => (
                            <Link to={`/store/${store.id}`} key={idx}>
                                <StoreCard
                                    title={store.name}
                                    description={store?.sells ?? "Groceries . Organic . Alcohol"}
                                    alt={store?.name + 'img'}
                                    src={store?.imgUrl ?? "https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg"}
                                    className=''
                                    deliveryTime="Delivery by 11am"
                                    key={idx}
                                />
                            </Link>
                        ))
                    }
                </ul>
            </section>
        </div>
        </div>
    )
}

export function Restaurant({ restaurants } : { restaurants: Array<Restaurant>}) {
    return (
        <section className="mt-16">
            <ScrollableList as={"ul"} title="Restaurants">
                {
                    restaurants?.map((rst, idx) => {
                        return (
                            <RestaurantCard key={idx} name={rst.name} flags={rst.countryTag} image={rst.imgUrl}/>
                        )
                    })
                }
            </ScrollableList>
        </section>
    )
}

type Offer = {
    value: number,
}

type RestaurantCardProps = {
    name: string,
    flags: Array<keyof typeof FLAGMAP>,
    image: string,
    openingStatus?: string,
    deliveryTime?: string,
    offers?: Array<Offer>,
    distanceFrom?: number
}

function RestaurantCard({ name, image } : RestaurantCardProps) {
    return (
        <li className='cursor-pointer group'>
            <div className="relative w-72 h-36 flex items-center overflow-hidden py-3 rounded-xl border-gray-200 border-[1px]">
                <img src={image} className='object-contain w-full h-full'/>
            </div>
            <div className='mt-2'>
                <p className='font-bold text-md'>{ name }</p>
                <span className='font-medium text-gray-500 text-[14px]'>16 km . 22-45 min</span> {'. '}
                <span className='font-medium text-gray-500 text-[14px]'>Delivery fee: {priceFormat(4.99)}</span>
            </div>
        </li>
    )
}
