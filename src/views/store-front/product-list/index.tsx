import React from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { Product, ScrollableList, StoreFrontLoader } from "..";
import { FilteredProductListSkeleton } from "../product-list-filtered-category";

export function ProductList() {
    const { productMap, categories } = useLoaderData() as StoreFrontLoader;
    const navigation = useNavigation();

    return (
        <div className="mt-10">
            {
                navigation.state === 'loading' && !navigation.location.pathname.includes('product') ? (
                        <FilteredProductListSkeleton />
                    ) : (
                        <React.Fragment>
                            {
                                categories?.map(category => (
                                    <div key={category}>
                                        {
                                            productMap[category]?.length ? (
                                                <ScrollableList as="ul" title={category}>
                                                    <React.Fragment>
                                                        {
                                                            productMap?.[category]?.map((prod, idx) => {
                                                                return (
                                                                    <div key={idx} className="snap-center">
                                                                        <Product product={prod} action={`.`}/>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </React.Fragment>
                                                </ScrollableList>
                                            ) : null
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
