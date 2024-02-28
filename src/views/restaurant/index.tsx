import React from "react";
import { useLoaderData } from "react-router-dom";
import { Restaurant } from "../feed";
import { StoreSummary } from "../store-front";
import { priceFormat } from "../../utils/currency";

export type Food = {
    id: string,
    name: string,
    price: number,
    imgUrl: string,
    description?: string,
}

export function RestaurantFront() {
    const { restaurantInfos: infos, foodList } = useLoaderData() as { restaurantInfos: Restaurant, foodList: Array<Food> };
    return (
        <React.Fragment>
            <section className="px-16 mb-16">
                <header className="w-full h-44 overflow-hidden">
                    <img
                        className="object-cover h-44 w-full"
                        src="https://tb-static.uber.com/prod/image-proc/processed_images/6a3368e8b89834d00d62c35a9658baff/16bb0a3ab8ea98cfe8906135767f7bf4.webp" />
                </header>
                <div className="flex mt-8">
                    <div className="">
                        <div className="sticky top-[73px] z-20 pt-8 bg-white">
                            <StoreSummary storeInfos={infos} />
                        </div>
                        <div className="mt-4 sticky overflow-y-auto top-[350px] w-[250px]">
                            <ul>
                                {
                                    CATEGORIES.map((category, idx) => (
                                        <li
                                            key={idx}
                                            className="capitalize py-2 rounded-lg underline-offset-8 px-2 cursor-pointer font-semibold">
                                            { category }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="ml-10">
                        {
                            CATEGORIES.map((category, idx) => (
                                <FoodCategoryTest key={idx} category={category}/>
                            ))
                        }
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

const CATEGORIES = [
    "Featured items",
    "Buy 1, Get 1 Free",
    "Bundles Meals",
    "chicken & fish",
    "happy meals",
    "hot drinks",
    "cold Drinks",
    "bakery",
    "sweets & treats",
    "snacks & sides",
    "condiments",
    "individual items"
]

export function FoodCard({ food } : { food: Food }) {
    return (
        <li className="relative pl-3 border-[1px] w-full rounded-xl overflow-hidden flex justify-between h-40 mb-2 hover:shadow-custom cursor-pointer">
            <div className="pt-3 w-full">
                <h1 className="font-bold">{ food.name }</h1>
                <p>{ priceFormat(food.price) }</p>
                <p className=" text-gray-600 text-[14px] pt-2 text-ellipsis w-full">adkjfalskdf Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate quo deleniti, est itaque nesciunt quod harum voluptatem ullam veniam asperiores?</p>
            </div>
            <div className="w-72 ml-2">
                <img className="h-40 object-fit" src={food.imgUrl}/>
            </div>
            <div className="absolute bottom-2 right-2">
                <CircleButton/>
            </div>
        </li>
    )
}

export function FoodListTest() {
    return (
        <ul className="grid grid-cols-2 gap-4 pt-4">
        {
            Array.from({length: 5}, (_, idx) => {
                return (
                    <FoodCard food={{
                        id: idx + "food",
                        name: "Half BBQ chicken with plantain",
                        price: 17.5,
                        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore expedita quo voluptate voluptas deleniti doloremque harum nostrum. Qui, deserunt accusantium.",
                        imgUrl: "https://static.wixstatic.com/media/f0ea0e_ba9eacf0e3964acdaa70bf36cc88b3b4~mv2.png/v1/fill/w_400,h_266,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/african-bbq-house-your-favourites-quarter-chicken.png"
                    }} key={idx} />
                )
            })        }
    </ul>
    )
}

export function FoodCategoryTest({ category } : FoodCategoryProps) {
    return (
        <div className="mb-16 mt-8">
            <h1 className="text-2xl font-black capitalize">{ category }</h1>
            <div>
                <FoodListTest />
            </div>
        </div>
    )
}

function CircleButton() {
    return (
        <div className="bg-black w-8 h-8 flex items-center justify-center shadow-custom rounded-full font-semibold text-white">
            <span className="material-symbols-outlined">add</span>
        </div>
    )
}

// export function FoodList({ foodList } : { foodList: Array<Food>}) {
//     return (
//         <ul className="grid grid-cols-2 gap-4 pt-4">
//             {
//                 foodList.map((food, idx) => {
//                     return (
//                         <FoodCard food={food} key={idx} />
//                     )
//                 })
//             }
//         </ul>
//     )
// }

type FoodCategoryProps = {
    foodList?: Array<Food>,
    category: string,
}
// export function FoodCategory({ category, foodList } : FoodCategoryProps) {
//     return (
//         <div className="mb-16 mt-8">
//             <h1 className="">{ category }</h1>
//             <div>
//                 <FoodList foodList={foodList}/>
//             </div>
//         </div>
//     )
// }

