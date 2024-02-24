import React from "react";
import clsx from "clsx";
import { CirclePulseButton } from "./button";
import { Form, useFetcher, useLocation, useRouteLoaderData } from "react-router-dom";
import { Product } from "../views/store-front";

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

function useRelativeResize(
    targetRef: React.MutableRefObject<HTMLElement | null>,
    toResizeRef: React.MutableRefObject<HTMLElement | null>,
) {
    React.useEffect(() => {
        const target = targetRef.current;
        const targetToResize = toResizeRef.current;
        if (!target || !targetToResize) return;

        const resizeObser = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
            const entry = entries[0];
            const { width, left } = entry.target.getBoundingClientRect();
            targetToResize.style.left = `${left}px`;
            targetToResize.style.width = `${width}px`;
        });

        resizeObser.observe(target);
        return () => resizeObser.unobserve(target);
    })
}

export function Search({ searchType } : { searchType?: string | undefined }) {
    const fetcher = useFetcher();
    const { searchQuery, storeInfos } = useRouteLoaderData(searchType as string);
    const { name, id: storeId } = storeInfos;
    const location = useLocation();
    const action = getAction(searchType, storeId);
    const formRef = React.useRef<HTMLFormElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const suggestionRef = React.useRef<HTMLFormElement | null>(null);

    const [ isOpen, setIsOpen ] = React.useState(false);

    function handleBlur(event: React.FocusEvent<HTMLElement, Element>) {
        console.log(event.relatedTarget?.contains?.(suggestionRef.current))
        if (!event.relatedTarget?.contains?.(suggestionRef.current)) {
                console.log('currentTarget', event.relatedTarget, suggestionRef.current, event.currentTarget);
            setIsOpen(false);
        } else {
            inputRef.current?.focus();
        }
    }

    React.useEffect(() => {
        const inputEl = inputRef.current;
        if (!inputEl) return;
        if (inputEl && location.search) {
            inputEl.value = searchQuery;
        }
    }, [searchQuery, location])

    useRelativeResize(formRef, suggestionRef);
    
    return (
        <div className="w-full grid">
            <Form ref={formRef} action={action} role="search" className="w-full rounded-xl relative py-1 focus:border-b-[2px]">
                <SearchIcon className="text-[24px] absolute top-1/2 -translate-y-1/2 left-4 text-black"/>
                <input
                    ref={inputRef}
                    onBlur={handleBlur}
                    onFocus={() => setIsOpen(true)}
                    autoComplete="off"
                    id="main-search-bar"
                    defaultValue={searchQuery}
                    name="searchQuery"
                    placeholder={ getPlaceholder(searchType, name) }
                    className="rounded-3xl w-full px-12 py-3 bg-gray-100 outline-black placeholder:font-semibold placeholder:text-gray-600"
                    onChange={(event) => {
                        fetcher.submit(event.currentTarget.form);
                    }}
                />
            </Form>
            {
                isOpen ? <SearchSuggestion results={fetcher.data?.searchResults}  ref={suggestionRef}/> : null
            }
        </div>
    )
}

const SearchSuggestion = React.forwardRef(function SearchSuggestion({ results } : { results: Array<Product> }, ref) {
    return (
        <div className="top-[4.5rem] left-0 fixed w-screen h-screen flex justify-center bg-search-overlay">
            <ul tabIndex={1} ref={ref} className="p-3 bg-white z-100 opacity-100 absolute h-96 shadow-custom rounded-md overflow-y-scroll"
                >
                {
                    results?.map((result: Product) => {
                        return (
                            <li className="rounded-lg flex hover:bg-gray-100 py-2 cursor-pointer" key={result.name}>
                                <div className="flex pl-3 text-lg  items-center">
                                    <div className="bg-white flex w-10 h-10 rounded-full overflow-hidden">
                                        <img className="flex w-10 h-10 object-contain" src={result.imgUrl} />
                                    </div>
                                    <div className="ml-3">
                                        <p>{ result.name }</p>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
})

function SearchIcon({ className }: { className: string }) {
    return (
        <button type="submit">
            <span className={clsx("material-symbols-outlined font-semibold", className)}>
                search
            </span>
        </button>
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
