import { Link, useLoaderData } from "react-router-dom";
import { StoreCard } from "../../components/card";
import Nigeria from '../../assets/country-flag/nigeria.png';
import China from '../../assets/country-flag/china.png';
import Italy from '../../assets/country-flag/italy.png';
import IvoryCoast from '../../assets/country-flag/ivory-coast.png';
import { priceFormat } from "../../utils/currency";
import { ScrollableList } from "../store-front/list-product";

const COUNTRY_FOODS = [
    { image: "https://restaurantclicks.com/wp-content/uploads/2022/06/Popular-Nigerian-Food.jpg", flag: Nigeria, name: "Nigerian BBQ", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
    { image: "https://images.pexels.com/photos/6896514/pexels-photo-6896514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", flag: China, name: "Mei tuan", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
    { image: "https://www.cuisineo.com/images/pays/recettes-espagnole-pieuvres.jpg", flag: Italy, name: "Pizza de Roma", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
    { image: "https://www.cuisineo.com/images/pays/recettes-espagnole-pieuvres.jpg", flag: Italy, name: "Pizza de Roma", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
    { image: "https://i.ytimg.com/vi/0auGEKaFYdk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDz6NBMRS0p_4UNYQ6GU8sJymA09A", flag: IvoryCoast, name: "Au poisson piqué", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
    { image: "https://i.ytimg.com/vi/0auGEKaFYdk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDz6NBMRS0p_4UNYQ6GU8sJymA09A", flag: IvoryCoast, name: "Au poisson piqué", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. blanditiis." },
]

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

export function Feed() {
    const loader = useLoaderData();
    const stores = (loader as unknown as  { stores: Array<Store>})?.stores;
    return (
        <div className="grid place-items-center w-full">

        <div className="w-full max-w-7xl">
            <section className="mt-16">
                <h1 className="text-2xl font-bold">Restaurants</h1>
                <ul className="max-w-7xl grid grid-cols-4 gap-5 mt-8">
                    {
                        COUNTRY_FOODS.map((food, idx) => {
                            return (
                                <RestaurantCard key={idx} name={food.name} flag={food.flag} image={food.image}/>
                            )
                        })
                    }
                </ul>
            </section>
            <section className="mt-16 mb-16">
                <h1 className="text-2xl font-bold">Grocery stores</h1>
                <ul className='grid grid-flow-col w-full gap-4 max-w-7xl mt-8'>
                    {
                        stores.map((store, idx) => (
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

export function Restaurant() {
    return (
        <section className="mt-16">
            <ScrollableList as={"ul"} title="Restaurants">
                {
                    COUNTRY_FOODS.map((food, idx) => {
                        return (
                            <RestaurantCard key={idx} name={food.name} flag={food.flag} image={food.image}/>
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
    flag: string,
    image: string,
    openingStatus?: string,
    deliveryTime?: string,
    offers?: Array<Offer>,
    distanceFrom?: number
}

function RestaurantCard({ name, flag, image } : RestaurantCardProps) {
    return (
        <li className='cursor-pointer group'>
            <div className="relative w-72 h-36 rounded-lg  flex items-center overflow-hidden">
                <img src={image} className='object-contain'/>
                <div className='absolute flex items-center justify-between px-2 w-full bg-gradient-to-t from-gray-800/85 from-8% bottom-0 h-8'>
                    <div className='w-6 h-6 border-black border-[1px] rounded-full'>
                        <img src={flag} alt={`${name}-flag`} className="object-fit"/>
                    </div>
                    <div className='text-white font-bold'></div>
                </div>
            </div>
            <div className='mt-2'>
                <p className='font-bold text-md'>{ name }</p>
                <span className='font-medium text-gray-500 text-[14px]'>16 km . 22-45 min</span> {'. '}
                <span className='font-medium text-gray-500 text-[14px]'>Delivery fee: {priceFormat(4.99)}</span>
            </div>
        </li>
    )
}
