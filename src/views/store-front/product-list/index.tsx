import { useLoaderData, useNavigation } from "react-router-dom";
import { ScrollableCategory, StoreFrontLoader } from "..";


export function ProductList() {
    const { productMap, categories } = useLoaderData() as StoreFrontLoader;
    const navigation = useNavigation();
    console.log(navigation.state);
    return (
        <div className="mt-10">
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
        </div>
    )
}
