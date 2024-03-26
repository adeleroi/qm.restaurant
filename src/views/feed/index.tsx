import { Link, useLoaderData } from "react-router-dom";
import { priceFormat } from "../../utils/currency";
import { SportCarIcon } from "../../components/icons/icon";

export type Geolocation = {
    long?: number,
    lat?: number,
    latitude: number,
    longitude: number,
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
    _id: string,
    name: string,
    availabilityStatus: string,
    hours: Schedule,
    imgUrl: string,
    location: Location,
    phone: string,
    description: string,
    productLine: Array<string>,
    type?: 'shop' | 'restaurant',
    estimatedTimeRange: string,
    deliveryFee: number,
}

type Schedule = {
    dayRange: string,
    sectionHours: Array<string>
}

type FeedSection = {
    items: Array<Store>,
    title: string
}

type FeedLoaderType = {
    data: { sections: Array<FeedSection> },
}

const emojis: Record<string,string> = { 'Grocery stores': '🥦🍅🛒', 'Restaurants': '🍱 🍔😜'}

export function Feed() {
    const { data } = useLoaderData() as FeedLoaderType;
    console.log('data', data);
    return (
        <div className="grid place-items-center w-full">
            <div className="w-full px-16">
                {
                    data.sections?.map((section, idx) => {
                        return (
                            <section className="my-16" key={idx}>
                                <h1 className="text-2xl font-bold">{ section.title } { emojis[section.title] }</h1>
                                <ul className="flex gap-5 mt-8">
                                    {
                                        section.items.map((item, idx) => (
                                            <Link to={`/restaurant/${item._id}`} key={idx}>
                                                <FeedCard name={item.name} estimatedTimeRange={item.estimatedTimeRange} description={item.description}/>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </section>
                        )
                    })
                }
            </div>
        </div>
    )
}

type FeedCardProps = {
    name: string,
    estimatedTimeRange: string,
    description: string,
}

function FeedCard({ name, estimatedTimeRange, description } : FeedCardProps) {
    return (
        <li className='group cursor-pointer group w-96 h-72 shadow-custom rounded-lg flex flex-col overflow-hidden hover:shadow-lg'>
            <div className="overflow-hidden">
                <div className="relative h-44 overflow-hidden group-hover:scale-110 transition-transform duration-700">
                    <img className="absolute inset-0" src="https://duyt4h9nfnj50.cloudfront.net/resized/d97fd6350b8779bd06e3f1ed4bdc6e86-w1080-c8.jpg"/>
                </div>
            </div>
            <div>
                <div className='my-2 px-4'>
                    <div className="mb-2">
                        <p className='font-semibold text-lg'>{ name }</p>
                        <p className='text-[13px]'>{description}</p>
                    </div>
                    <p className='text-[13px]'>Delivery fee • { priceFormat(4.99) }</p>
                    <div className="flex mt-1">
                        <SportCarIcon fill="green"/>
                        <p className='ml-1 text-[12px] text-defaultGreen'>{ estimatedTimeRange } min</p>
                    </div>
                </div>
            </div>
        </li>
    )
}
