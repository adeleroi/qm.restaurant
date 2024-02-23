import React from "react";
import { LoaderFunctionArgs, Outlet, json, redirect, useLoaderData, useNavigation } from "react-router-dom";
import { Product, ProductListSkeleton } from "..";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/fireStore";
import Cookies from "js-cookie";
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

export async function loader({params}: LoaderFunctionArgs) {
    const userId = Cookies.get('qm_session_id') as string;
    if (!userId) {
        return redirect('/',)
    }
    const { storeId, categoryId } = params as Record<string, string>;

    const productList: Array<Product> = [];

    const cartItemIds = new Map<string, number>();
    const productListRef = collection(db, "store", storeId, "product");
    const q = query(productListRef, where("category", "==", categoryId));
    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    const filteredProductSnapshot = await getDocs(q);

    cartSnapshot.forEach(cartItem => {
        cartItemIds.set(cartItem.id, cartItem.data().count)
    });

    filteredProductSnapshot.forEach(prod => {
        const product = { id: prod.id, count: 0, ...prod.data() } as Product;
        if (cartItemIds.has(prod.id)) {
            product.count = Number(cartItemIds.get(prod.id));
        }
        productList.push(product);
    });

    return json({productList});
}

export function FilteredProductList() {
    const loaderData = useLoaderData() as { productList: Array<Product> };
    const productList = loaderData?.productList;
    const navigation = useNavigation();
    return (
        <>
            {
                navigation.state === 'loading' && !navigation.location.pathname.includes('product') ?                
                    navigation.location?.pathname?.includes('category') ? (
                        <FilteredProductListSkeleton />
                    ) : (
                        <ProductListSkeleton />
                    ) : (
                    <React.Fragment>
                        <div className="mt-10">
                            <p className="text-md underline font-bold">{productList.length} Result(s)</p>
                        </div>
                        <div className="grid xl:grid-cols-5 2xl:grid-cols-6 gap-8 justify-between mt-10 mb-32">
                            {
                                productList?.map(product => {
                                    return <Product product={product} key={product?.id}/>
                                })
                            }            
                        </div>
                    </React.Fragment>
                ) 

            }
            <Outlet/>
        </>
    );
}

export function FilteredProductListSkeleton() {
    return (
        <>
            <div className="mt-16 w-32">
                <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={1} skeletonHeight={4}/>
            </div>
            <div className="grid xl:grid-cols-5 2xl:grid-cols-6 gap-8 mt-10">
                {
                    Array.from({length: 50}).map((_, idx) => (
                        <React.Fragment key={idx}>
                            <div>
                                <div className="w-52 h-48 rounded-xl overflow-hidden relative">
                                    <Skeleton startColor="gray.100" endColor="gray.200" key={idx} className="w-full h-full mb-2 rounded-3xl"></Skeleton>
                                    <SkeletonCircle startColor={"gray.100"} className="absolute top-36 right-2 bg-white" />
                                </div>
                                <div className="w-52">
                                    <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={2} mt={2} spacing={2} skeletonHeight={2}/>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    )
}
