import React from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { ScrollableCategory, StoreFrontLoader } from "..";
import { FilteredProductListSkeleton } from "../product-list-filtered-category";

export function ProductList() {
    const { productMap, categories } = useLoaderData() as StoreFrontLoader;
    const navigation = useNavigation();
    return (
        <div className="mt-10">
            {
                navigation.state === 'loading' ? (
                        <FilteredProductListSkeleton />
                    ) : (
                        <React.Fragment>
                            {
                                categories?.map(category => (
                                    <div key={category}>
                                        {
                                            productMap[category]?.length ?
                                            <ScrollableCategory productMap={productMap} category={category} /> :
                                            null
                                        }
                                    </div>
                                ))
                            }
                        </React.Fragment>
                    )
            }
            <Outlet/>
        </div>
    )
}
