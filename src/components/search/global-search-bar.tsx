import { useLocation, useParams, useRouteLoaderData } from "react-router-dom";
import { Search } from "./search";
import { Store } from "../../views/feed";
import { Product } from "../../views/store-front";


export function SearchSwitcher() {
    const { storeId, restaurantId } = useParams();
    const location = useLocation();
    const feed = location.pathname.includes("feed");

    if (storeId) {
        return <StoreSearch action={`/store/${storeId}`}/>
    }
    if (restaurantId) {
        return <RestaurantSearch action={`/restaurant/${restaurantId}`} />
    }
    if (feed) {
        return <FeedSearch action={`/feed`} />
    }
    return null;
}

type SearchData = {
    searchQuery: string,
    searchResults: Array<Partial<Product>>,
    defaultSearchSuggestions: Array<Partial<Product>>,
    storeInfos: Store,
}

function StoreSearch({ action } : { action: string }) {
    const {
        searchQuery,
        searchResults,
        defaultSearchSuggestions,
        storeInfos: { name }
    } = useRouteLoaderData('store') as SearchData;

    return (
        <Search
            action={action}
            placeholder={ `Search in ${ name }` }
            searchQuery={ searchQuery }
            searchResults={ searchResults }
            defaultSearchSuggestions={ defaultSearchSuggestions }
        />
    )
}

function FeedSearch({ action } : { action: string }) {
    const {
        searchQuery,
        searchResults,
        defaultSearchSuggestions
    } = useRouteLoaderData('feed') as SearchData;

    return (
        <Search
            action={action}
            placeholder={ `Search groceries, dishes` }
            searchQuery={ searchQuery }
            searchResults={ searchResults }
            defaultSearchSuggestions={ defaultSearchSuggestions }
        />
    )
}

function RestaurantSearch({ action } : { action: string }) {
    const {
        searchQuery,
        searchResults, 
        defaultSearchSuggestions,
        storeInfos: { name }
    } = useRouteLoaderData('restaurant') as SearchData;

    return (
        <Search
            action={ action }
            placeholder={ `Search in ${ name }` }
            searchQuery={ searchQuery }
            searchResults={ searchResults }
            defaultSearchSuggestions={ defaultSearchSuggestions }
        />
    )
}
