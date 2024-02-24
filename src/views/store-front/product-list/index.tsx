import React from "react";
import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { Product, ScrollableList, StoreFrontLoader } from "..";
import { FilteredProductListSkeleton, ListOfProduct } from "../product-list-filtered-category";

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

function ListOfProductByCategory({ categories, productMap } : { categories: Array<string>, productMap: Record<string, Array<Product>> }) {
    return (
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
