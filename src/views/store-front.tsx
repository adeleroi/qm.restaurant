import clsx from "clsx";
import React from "react";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect, useFetcher, useLoaderData } from "react-router-dom"
import { db } from "../firebase/fireStore";
import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
// import { useFirebaseAuth } from "../firebase/auth";
import Cookies from "js-cookie";

export type Product = {
    id: string,
    name: string,
    count: number,
    description: string,
    price: number,
    offer: string,
    storeId: string,
}

export async function loader({params}: LoaderFunctionArgs) {
    const storeId = params.storeId as string;
    const products: Array<Product> = [];
    const carts: Array<Product> = [];
    const userId = Cookies.get('qm_session_id') as string;
    if (!userId) {
        return redirect('/',)
    }

    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    const productSnapshot = await getDocs(collection(db, "store", storeId, "product"));

    cartSnapshot.forEach(cartItem => {
        carts.push({id: cartItem.id, ...cartItem.data()} as Product);
    })

    productSnapshot.forEach(prod => {
        const productInStore = {id: prod.id, count: 0, ...prod.data()} as Product;
        if (carts.length) {
            const productInCart = carts.find(prod => prod.id === productInStore.id);
            if (productInCart) {
                productInStore.count = Number(productInCart.count);
            }
        }
        products.push(productInStore);
    });

    const storeDoc = await getDoc(doc(db, "store", storeId));
    const storeInfos = { id: storeDoc, ...storeDoc.data() }

    return json({products, storeInfos});
}

export async function action({request, params}: ActionFunctionArgs) {
    const formData = await request.formData();
    const storeId = params?.storeId as string;
    const userId = Cookies.get('qm_session_id') as string;
    const { productId, itemCount } = Object.fromEntries(formData) as Record<string, string>;

    const productInStore = await getDoc(doc(db, "store", storeId, "product", productId));
    const productInCartRef = doc(db, "users", userId, "cart", productId);

    await runTransaction(db, async (transaction) => {
        const productInCartDoc = await transaction.get(productInCartRef);
        if (!productInCartDoc.exists()) {
            transaction.set(productInCartRef, {
                ...productInStore.data(),
                timestamp: serverTimestamp(),
                count: +itemCount,
                storeId,
            })
            return;
        }
        if (+itemCount !== 0) {
            transaction.update(productInCartRef, {count: +itemCount, timestamp: serverTimestamp()});
        } else {
            transaction.delete(productInCartRef);
        }
    });

    return json({});
}

export function StoreFront() {
    const loaderData = useLoaderData();
    const productList = (loaderData as unknown as {products: Array<Product>, storeId: string})?.products as Array<Product>;
    const storeInfos = loaderData.storeInfos;
    return (
        <section className="grid pt-16 max-w-6xl mx-auto">
            <div className="flex w-full items-center pb-4 bg-brown-bg rounded-lg">
                <div className="pl-10">
                    <div className="w-20 flex justify-center items-center mr-2 my-4">
                        <img className='w-20 h-20 object-cover rounded-full' src="https://cdn.theorg.com/f1bbabce-f3da-42a0-89fe-8be4f53af00f_thumb.jpg" alt="lcbo-logo"/>
                    </div>
                    <div className="text-black">
                        <p className="font-bold text-3xl">{ storeInfos?.name }</p>
                        <span className="text-xs font-semibold">Delivery fee (3.69$) . {storeInfos.location.address}</span>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <ul className="grid grid-cols-4 gap-4">
                    {
                        productList?.map((prod, idx) => {
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
        <div className="rounded-xl overflow-hidden p-2 pb-4 cursor-pointer">
            <div className="relative p-4 h-44 rounded-lg bg-smoke mb-4">
                <img src="" alt=""/>
                <div className="absolute right-2 bottom-2">
                    <AddToCartButton cartCount={product?.count} productId={product.id}/>
                </div>
            </div>
            <div>
                <span className="text-xs">{product.name}</span>
                <p className="text-xs">{product.description}</p>
            </div>
        </div>
    )
}

export function AddToCartButton({cartCount, productId, action=""}: { cartCount: number, productId: string, action?: string}) {
    const [isOpen, setIsOpen] = React.useState<boolean|null>(null)
    const [ count, setCount ] = React.useState(cartCount ?? 0);
    const fetcher = useFetcher();
    // const { data } = useFirebaseAuth();

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
        <fetcher.Form method="post" onBlur={handleBlur} action={action}>
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
                {/* <input type="hidden" name="userId" value={data?.uid || ''}/> */}
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
