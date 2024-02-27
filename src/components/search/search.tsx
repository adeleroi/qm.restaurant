import React, { LegacyRef } from "react";
import clsx from "clsx";
import { Form, useFetcher, useNavigate } from "react-router-dom";
import { Product } from "../../views/store-front";
import { useRelativeResize } from "../../utils/hooks";

type SearchProps = {
    searchType?: string | undefined,
    action: string,
    placeholder: string,
    searchQuery: string,
    searchResults: Array<Partial<Product>>,
    defaultSearchSuggestions: Array<Partial<Product>>,
}

export function Search({ action, placeholder, searchQuery, searchResults, defaultSearchSuggestions } : SearchProps) {
    const fetcher = useFetcher();
    const [ isOpen, setIsOpen ] = React.useState(false);
    const [ query, setQuery ] = React.useState(searchQuery);

    const formRef = React.useRef<HTMLFormElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const suggestionRef = React.useRef<HTMLFormElement | null>(null);

    function handleBlur(event: React.FocusEvent<HTMLElement, Element>) {
        console.log(event.relatedTarget?.contains?.(suggestionRef.current))
        if (!event.relatedTarget?.contains?.(suggestionRef.current)) {
            setIsOpen(false);
        } else {
            inputRef.current?.focus();
        }
    }

    React.useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery])

    useRelativeResize(formRef, suggestionRef);
    
    return (
        <div className="w-full grid">
            <Form 
                onSubmit={() => {setIsOpen(false)}}
                ref={formRef} action={action} role="search" className="w-full rounded-xl relative py-1 focus:border-b-[2px]">
                <SearchIcon className="text-[20px] absolute top-1/2 -translate-y-1/2 left-4 text-black"/>
                <input
                    ref={inputRef}
                    onBlur={handleBlur}
                    onClick={() => setIsOpen(true)}
                    onFocus={() => setIsOpen(true)}
                    autoComplete="off"
                    id="main-search-bar"
                    value={query}
                    name="searchQuery"
                    placeholder={ placeholder }
                    className="rounded-3xl w-full px-12 py-3 bg-gray-100 outline-black placeholder:font-semibold placeholder:text-gray-600"
                    onChange={(event) => {
                        setQuery(event.target.value);
                        fetcher.submit(event.currentTarget.form);
                    }}
                />
                {
                    query && <ClearIcon onClick={() => setQuery("")} className="absolute top-1/2 -translate-y-1/2 right-4 text-[24px]"/>
                }
            </Form>
            {
                isOpen ?
                    <SearchSuggestion
                        onSelect={() => setIsOpen(false)}
                        results={
                            query && (fetcher.data?.searchResults || searchResults) || defaultSearchSuggestions
                        }
                        ref={suggestionRef}/>
                    : null
            }
        </div>
    )
}

type SearchSuggestionProps = {
    results: Array<Product>,
    onSelect: () => void,
}

const SearchSuggestion = React.forwardRef(function SearchSuggestion({ results, onSelect } : SearchSuggestionProps, ref) {
    const navigate = useNavigate();
    function handleClick(suggestion: string, storeId: string) {
        navigate(`/store/${storeId}?searchQuery=${suggestion}`);
        onSelect();
    }
    return (
        <div className="top-[4.5rem] left-0 fixed w-screen h-screen flex justify-center bg-search-overlay">
            <ul tabIndex={0} ref={ref as LegacyRef<HTMLUListElement> | undefined} className="p-3 bg-white z-100 opacity-100 absolute min-h-[12rem] max-h-[26rem] shadow-custom rounded-md overflow-y-scroll">
                {
                    results?.map((result: Product) => {
                        return (
                            <li className="rounded-lg flex hover:bg-gray-100 py-2 cursor-pointer"
                                key={result.name}
                                onClick={() => handleClick(result.name, result.storeId)}>
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
        <button type="button">
            <span className={clsx("material-symbols-outlined font-semibold", className)}>
                search
            </span>
        </button>
    )
}

function ClearIcon({ className, onClick } : { className?: string, onClick: () => void }) {
    return (
        <button type="button" onClick={onClick}>
            <span className={clsx("material-symbols-outlined", className)}>close</span>
        </button>
    )
}
