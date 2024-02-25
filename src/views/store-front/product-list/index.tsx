import React from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { StoreFrontLoader } from "..";
import { ListOfProduct, ListOfProductByCategory } from "../list-product";
import { FilteredProductListSkeleton } from "../skeleton";

export function ProductList() {
    const { productMap, categories, searchQuery, searchResults } = useLoaderData() as StoreFrontLoader;
    const navigation = useNavigation();

    return (
        <div className="mt-5">
            {
                navigation.state === 'loading' && !navigation.location.pathname.includes('product') ? (
                        <FilteredProductListSkeleton />
                    ) : (
                        <React.Fragment>
                            {
                                searchQuery ? (
                                    <ListOfProduct productList={searchResults}/>
                                ) : (
                                    <ListOfProductByCategory categories={categories} productMap={productMap} />
                                )
                            }
                        </React.Fragment>
                    )
            }
            <Outlet/>
        </div>
    )
}
