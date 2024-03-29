import clsx from "clsx";
import React from "react";
import { ActionFunctionArgs, json, useFetcher, useLoaderData } from "react-router-dom"
import { productCollection, db } from "../firebase/fireStore";
import { doc, getDocs, updateDoc } from "firebase/firestore";


export type Product = {
    id: string,
    name: string,
    count: number,
    description: string,
    price: number,
    offer: string,
}

export async function loader() {
    const products: Array<Product> = [];
    const snapshot = await getDocs(productCollection);
    snapshot.forEach(prod => {
        products.push({id: prod.id, ...prod.data()} as Product)
    })
    return json({products});
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const count = formData.get('itemCount') as string;
    const productId = formData.get('productId') as string;
    if (!productId) throw Error('product without id');

    const productRef = doc(db, 'product', productId);
    await updateDoc(productRef, {
        count: +count
    })
    return +count;
}

export function StoreFront() {
    const loader = useLoaderData();
    const data = (loader as unknown as {products: Array<Product>})?.products as Array<Product>;
    return (
        <section className="grid pt-16 max-w-6xl mx-auto">
            <div className="flex w-full items-center pb-4 bg-brown-bg rounded-lg">
                <div className="pl-10">
                    <div className="w-20 flex justify-center items-center mr-2 my-4">
                        <img className='w-20 h-20 object-cover rounded-full' src="https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg" alt="lcbo-logo"/>
                    </div>
                    <div className="text-black">
                        <p className="font-bold text-3xl">LCBO</p>
                        <span className="text-xs font-semibold">Delivery fee (3.69$) . 275 Rideau St, Ottawa, K1N5Y3</span>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <ul className="grid grid-cols-4 gap-4">
                    {
                        data.map((prod, idx) => {
                            return (
                                <li key={idx}>
                                    <Product product={prod}/>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </section>
    )
}


type ProductProps = {
    product: Product
}

export function Product({product}: ProductProps) {
    return (
        <div className="relative border-[1px] rounded-xl overflow-hidden p-2 pb-4 hover:shadow-custom cursor-pointer">
            <div className="p-4 h-32 bg-smoke mb-4">
                <img src="" alt=""/>
            </div>
            <div>
                <span className="text-xs">{product.name}</span>
                <p className="text-xs">{product.description}</p>
            </div>
            <div className="absolute right-2 bottom-10">
                <AddToCartButton cartCount={product?.count} productId={product.id}/>
            </div>
        </div>
    )
}

export function AddToCartButton({cartCount, productId}: { cartCount: number, productId: string}) {
    const fetcher = useFetcher({key: 'bag-count'});
    const [isOpen, setIsOpen] = React.useState<boolean|null>(null)
    const [ count, setCount ] = React.useState(cartCount || 0);

    function handleBlur(event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
        }
    }

    function handleRemoveButton() {
        if (count === 1) setIsOpen(false);
        setCount(count => count == 0 ? 0 : count - 1);
    }

    function handleAddButton() {
        setIsOpen(true);
        if (isOpen || !isOpen && count === 0) {
            setCount(count => count + 1);
        }
    }

    React.useEffect(() => {
        setCount(cartCount);
    }, [cartCount])

    return (
        <fetcher.Form method="post" onBlur={handleBlur} action="/store/:storeId">
            <div className={clsx("border rounded-3xl flex shadow-custom items-center bg-white", {
                    "animate-open-add-to-card": isOpen,
                    "animate-close-add-to-card": isOpen === false,
                })}>
                <button
                    value={count}
                    defaultValue={0}
                    onClick={handleRemoveButton}
                    type="submit"
                    name="itemCount"
                    className={clsx("hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center", {
                        "flex": isOpen,
                        "hidden": !isOpen,
                    })}>
                    { count !== 1 ? <span className="font-semibold">-</span> : <span className="material-symbols-outlined font-semibold">delete</span> }
                </button>
                {/** this button[type=button] allows us to handler blur event nicely*/}
                <button type="button" className={clsx("items-center justify-center px-2", {
                    "flex": isOpen,
                    "hidden": !isOpen,
                })}>{count}</button>
                <input type="hidden" name="productId" value={productId}/>
                <button
                    id="test-id"
                    value={count}
                    defaultValue={0}
                    onClick={handleAddButton}
                    name="itemCount"
                    type="submit"
                    className="flex hover:bg-[#ededed] bg-white rounded-full m-1 w-8 h-8 text-md font-semibold justify-center items-center">
                    <span>{ !isOpen && count > 0 ? count : "+" }</span>
                </button>
            </div>
        </fetcher.Form>
    )
}
