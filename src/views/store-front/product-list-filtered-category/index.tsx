import React from "react";
import { LoaderFunctionArgs, json, redirect, useLoaderData, useNavigation } from "react-router-dom";
import { Product, ProductSkeletonList } from "..";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/fireStore";
import Cookies from "js-cookie";

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
                navigation.state === 'loading' ? (
                    <ProductSkeletonList />
                ) : (
                    <React.Fragment>
                        <div className="mt-10">
                            <p className="text-md underline font-bold">{productList.length} Result(s)</p>
                        </div>
                        <div className="grid xl:grid-cols-6 2xl:grid-cols-7 gap-8 justify-between mt-10 mb-32">
                            {
                                productList?.map(product => {
                                    return <Product product={product} key={product?.id}/>
                                })
                            }            
                        </div>
                    </React.Fragment>
                ) 

            }
        </>
    );
}
