import clsx from "clsx"
import { CirclePulseButton } from "./button"
import { Form, useFetcher, useLocation, useRouteLoaderData } from "react-router-dom";
import React from "react";

const ROUTES_FOR_SEARCH = ['store', 'feed', 'restaurant'];

function getPlaceholder(searchType: string | undefined, name: string): string {
    // TODO: Put that to the utils folder after
    if (!ROUTES_FOR_SEARCH.includes(searchType as string)) return "";
    if (searchType && searchType !== 'feed') {
        return `Search in ${name}`
    }
    return  "Restaurants, groceries, Food, etc";
}

function getAction(searchType: string | undefined, storeId: string) {
    if (!ROUTES_FOR_SEARCH.includes(searchType as string)) return ".";
    if (searchType && searchType !== 'feed') {
        return `${searchType}/${storeId}`
    }
    return  "feed/";
} 

export function Search({ searchType } : { searchType?: string | undefined }) {
    const fetcher = useFetcher();
    const routeLoader = useRouteLoaderData(searchType as string);
    const location = useLocation();
    const storeId = routeLoader?.storeInfos?.id;
    const name = routeLoader?.storeInfos?.name;
    const searchQuery = routeLoader?.searchQuery;
    const action = getAction(searchType, storeId);
    
    React.useEffect(() => {
        const el = document.getElementById('main-search-bar') as HTMLInputElement; // better to do this way (it's from the doc) than sync with useState.
        if (el && location.search) {
            el.value = searchQuery;
        }
    }, [searchQuery, location])
    return (
        <Form action={action} role="search" className="w-full rounded-xl relative py-1 focus:border-b-[2px]  mx-8">
            <SearchLogo className="text-[20px] absolute top-1/2 -translate-y-1/2 left-2 text-black"/>
            <input
                autoComplete="off"
                id="main-search-bar"
                defaultValue={searchQuery}
                name="searchQuery"
                placeholder={ getPlaceholder(searchType, name) }
                className="rounded-xl w-full p-9 py-3 bg-gray-100 outline-black placeholder:font-semibold placeholder:text-gray-600"
                onChange={(event) => {
                    fetcher.submit(event.currentTarget.form);
                }}
            />
        </Form>
    )
}

function SearchLogo({ className }: { className: string }) {
    return (
        <span className={clsx("material-symbols-outlined font-semibold", className)}>
            search
        </span>
    )
}

export function PositionLogo({ className }: { className: string }) {
    return (
        <span className={clsx("material-symbols-outlined font-semibold text-[30px]", className)}>
            explore_nearby
        </span>
    )
}

export function SearchPosition({ themeColor = 'defaultGreen'} :{ themeColor?: string }) {
    const textColor = 'text-'+themeColor;
    return (
        <div id="search-location" className="w-[550px] relative py-1 focus:border-b-[2px] focus:border-black">
            <PositionLogo className={clsx("text-[20px] absolute top-1/2 -translate-y-1/2 left-2", textColor)}/>
            <input
                placeholder="Enter delivery address"
                className="h-16 text-xl text-black focus:shadow-search transition-[box-shadow] ease-in-out delay-150 w-full px-12 py-3 bg-[#EEEEEE] outline-none placeholder:font-semibold placeholder:text-gray-600"
            />
            <CirclePulseButton themeColor={themeColor}/>
        </div>
    )
}
