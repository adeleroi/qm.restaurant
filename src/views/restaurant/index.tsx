import React from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { StoreSummary } from "../store-front";
import { priceFormat } from "../../utils/currency";
import { Article } from "../article-model";
import { Store } from "../store-model";
import { AddIcon } from "../../components/icons/icon";

export type MenuSection = {
    categoryId: string,
    categoryItems: Array<Article>,
    title: string,
}

export type Section = {
    _id: string,
    storeId: string,
    type: string,
    subCategoryIds: Array<string>,
    title: string,
}

type StoreData = {
    store: Store,
    sections: Array<Section>,
    menuSections: Array<MenuSection>
}

export function RestaurantFront() {
    const { storeData } = useLoaderData() as { storeData: StoreData };
    const infos = storeData.store;
    const sections = storeData.sections;
    const menuSections = storeData.menuSections;

    React.useEffect(() => {
        sections.forEach((section) => {
            const el = document.getElementById(section._id);
            if (el) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        const item = document.getElementById(`list-item-${section._id}`);
                        const defaultStyle = "capitalize py-3 rounded-lg underline-offset-8 px-2 cursor-pointer font-medium scroll-my-48 hover:bg-gray-100";
                        if (entry.isIntersecting) {
                            item?.setAttribute('class', defaultStyle + ' ' + "underline ");
                            item?.scrollIntoView({ block: 'nearest' })
                        } else {
                            item?.setAttribute('class', defaultStyle);
                        }
                    });
                }, { root: null, threshold: [0], rootMargin: '-12% 0% -84% 0%' })
        
                observer.observe(el)
            }
        })
    }, [])

    return (
        <React.Fragment>
            <section className="mb-16" id="food-section">
                <RestaurantHeader infos={infos}/>
                <div className="flex mt-8 px-16">
                    <div className="">
                        <div className="z-20 pt-8 bg-white">
                            <StoreSummary store={infos} />
                        </div>
                        <CuisineType sections={sections}/>
                    </div>
                    <div className="ml-4 pl-20">
                        {
                            menuSections.map((section, idx) => (
                                <FoodCategory key={idx} category={section}/>
                            ))
                        }
                    </div>
                </div>
                <Outlet/>
            </section>
        </React.Fragment>
    )
}

function CuisineType({sections} : {sections: Array<Section>}) {
    return (
        <div id="list-category" className="pb-20 mt-4 sticky overflow-y-auto top-[80px] w-[250px] max-h-[calc(100vh-80px)]">
            <ul>
                {
                    sections.map((section, idx) => (
                        <li
                            onClick={() => {
                                document.getElementById(section._id)?.scrollIntoView({behavior: "instant"});
                            }}
                            id={`list-item-${section._id}`}
                            key={idx}
                            className="capitalize py-2 rounded-lg px-2 cursor-pointer">
                            { section.title }
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export function ProductLine({ productLine } : { productLine: Array<string>}) {
    return (
        <ul className="flex gap-4">
            {
                productLine?.map(line => (
                    <li key={line} className="px-3 py-2 text-black bg-white z-50">{line}</li>
                ))
            }
        </ul>
    )
}

type RestaurantHeaderProps = {
    infos: Store,
}
export function RestaurantHeader({infos}: RestaurantHeaderProps) {
    return (
        <header className="relative w-full h-72 overflow-hidden">
            <div className="inset-0 bg absolute bg-hero-overlay h-72 z-10"></div>
            <img
                className="object-cover h-72 w-full"
                src={infos.imgUrl} />
            <div className="absolute top-1/2 left-16 z-10">
                <h1 className="text-5xl text-white z-10 font-extralight mb-1">{infos.name}</h1>
                <p className="text-2xl text-white z-10 font-extralight">{infos.description}</p>
                <ProductLine productLine={infos.productLine}/>
            </div>
        </header>
    )
}

export function FoodCard({ food } : { food: Article }) {
    return (
        <Link to={`food/${food._id}`}>
            <li className="relative pl-3 border-[1px] w-full rounded-xl overflow-hidden flex justify-between h-40 mb-2 hover:shadow-custom hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div className="pt-3 w-full">
                    <h1 className="font-bold capitalize">{ food.name }</h1>
                    <p className="font-black text-gray-500">{ priceFormat(food.price) }</p>
                    <p className=" text-gray-600 text-[14px] pt-2 w-full">{ food.description }</p>
                </div>
                <div className="w-72 ml-2">
                    <img className="h-40 object-fit" src={food.imgUrl}/>
                </div>
                <div className="absolute bottom-1 right-1 z-20">
                    <CircleButton/>
                </div>
                <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-green-100"></div>
            </li>
        </Link>
    )
}

type FoodListProps = {
    menuList: Array<Article>
}
export function FoodList({ menuList } : FoodListProps) {
    return (
        <ul className="grid grid-cols-2 gap-6 pt-4">
            {
                menuList.map((food, idx) => {
                    return (
                        <FoodCard
                            key={idx}
                            food={food}
                        />
                    )
                })
            }
        </ul>
    )
}

type FoodCategoryProps = {
    category: MenuSection
}
export function FoodCategory({ category } : FoodCategoryProps) {
    return (
        <div className="mt-8 scroll-mt-24" id={category.categoryId}>
            <h1 className="text-2xl font-bold capitalize">{ category.title }</h1>
            <div>
                <FoodList menuList={category.categoryItems} />
            </div>
        </div>
    )
}

function CircleButton({ count=0 } : { count?: number }) {
    return (
        <div className="bg-white text-black w-8 h-8 flex items-center justify-center shadow-custom rounded-full font-bold hover:bg-gray-200">
            <button className="flex items-center rounded-full">
                { count > 0 ? count : <AddIcon/> }
            </button>
        </div>
    )
}
