import { Outlet, useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Product } from "..";
import { FilterByCategory } from "../list-product";
import { FilteredProductListSkeleton, ProductListSkeleton } from "../skeleton";

// This one must be ProductListFilteredBy-Sub-Category
export function ProductListFilteredByCategory() {
    const loaderData = useLoaderData() as { productList: Array<Product> };
    const productList = loaderData?.productList;
    const navigation = useNavigation();
    const { categoryId } = useParams();
    return (
        <>
            {
                navigation.state === 'loading' && !navigation.location.pathname.includes('product') ?                
                    navigation.location?.pathname?.includes('category') ? (
                        <FilteredProductListSkeleton />
                    ) : (
                        <ProductListSkeleton />
                    ) : (
                        <FilterByCategory productList={productList} category={categoryId as string} />
                    ) 
            }
            <Outlet/>
        </>
    );
}
