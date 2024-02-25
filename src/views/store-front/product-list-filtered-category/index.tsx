import { Outlet, useLoaderData, useNavigation } from "react-router-dom";
import { Product } from "..";
import { ListOfProduct } from "../list-product";
import { FilteredProductListSkeleton, ProductListSkeleton } from "../skeleton";

// This one must be ProductListFilteredBy-Sub-Category
export function ProductListFilteredByCategory() {
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
                        <ListOfProduct productList={productList} />
                    ) 
            }
            <Outlet/>
        </>
    );
}
