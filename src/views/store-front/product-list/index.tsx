import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { ProductSkeletonList, ScrollableCategory, StoreFrontLoader } from "..";

export function ProductList() {
    const { productMap, categories } = useLoaderData() as StoreFrontLoader;
    const navigation = useNavigation();
    console.log(navigation.state);
    return (
        <div className="mt-10">
            {
                navigation.state === 'loading' ? (
                    <ProductSkeletonList/>
                ):(
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
        </div>
    )
}
