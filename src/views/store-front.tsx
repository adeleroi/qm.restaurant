import clsx from "clsx";
import React from "react";
import { ActionFunctionArgs, Link, LoaderFunctionArgs, Outlet, json, redirect, useFetcher, useLoaderData } from "react-router-dom"
import { db } from "../firebase/fireStore";
import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import { priceFormat } from "../utils/currency";
import { Store } from "./store-list";

export type Product = {
    id: string,
    name: string,
    count: number,
    description: string,
    price: number,
    offer: string,
    storeId: string,
    imgUrl: string,
    category: string;
}

function groupProductByCategory(products: Array<Product>) {
    const productMap: Record<string, Array<Product>> = {};
    products.forEach(product => {
        const { category } = product
        if (!productMap[category]) {
            productMap[category] = [];
        }
        productMap[category].push(product);
    })
    return productMap;
  }

export async function loader({params}: LoaderFunctionArgs) {
    const storeId = params.storeId as string;
    const products: Array<Product> = [];
    const carts: Array<Product> = [];
    const cartItemIds = new Map<string, number>();
    const productMap: Record<string, Array<Product>> = {};
    const userId = Cookies.get('qm_session_id') as string;
    if (!userId) {
        return redirect('/',)
    }
    const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
    const productSnapshot = await getDocs(collection(db, "store", storeId, "product"));

    cartSnapshot.forEach(cartItem => {
        const data = cartItem.data();
        carts.push({id: cartItem.id, ...data} as Product);
        cartItemIds.set(cartItem.id, data.count);
    })

    productSnapshot.forEach(prod => {
        const productInStore = { id: prod.id, count: 0, ...prod.data() } as Product;
        if (cartItemIds.has(prod.id)) {
            productInStore.count = Number(cartItemIds.get(prod.id));
        }
        const { category } = productInStore;
        if (!productMap[category]) {
            productMap[category] = [];
        }
        productMap[category].push(productInStore);
    });

    const storeDoc = await getDoc(doc(db, "store", storeId));
    const storeInfos = { id: storeDoc, ...storeDoc.data() }
    return json({ productMap, storeInfos });
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

type StoreInfos = Store & { cart: Array<Product> }

type StoreFrontLoader = {
    productMap: Record<string,
    Array<Product>>, storeInfos: StoreInfos
}

export function StoreFront() {
    const { storeInfos, productMap } = useLoaderData() as StoreFrontLoader;
    const categories = Object.keys(productMap);
    return (
        <section className="pt-16 px-16">
            <div className="flex w-full items-center pb-4 bg-brown-bg rounded-lg">
                <div className="pl-10">
                    <div className="w-20 h-20 border-[1px] bg-white rounded-full flex justify-center items-center mr-2 my-4 px-2">
                        <img className="object-contain" src={storeInfos.imgUrl} alt="lcbo-logo"/>
                    </div>
                    <div className="text-black">
                        <p className="font-bold text-3xl">{ storeInfos?.name }</p>
                        <span className="text-xs font-semibold">Delivery fee (3.69$) . {storeInfos.location.address}</span>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div>
                    {
                        categories?.map(category => {
                            return (
                                <div key={category}>
                                    <h1 className="text-2xl font-bold capitalize">{category}</h1>
                                    <div className="item-list my-5 flex overflow-x-auto snap-x scroll-smooth">
                                        {
                                            productMap[category].map((prod, idx) => {
                                                return (
                                                    <div key={idx} className="snap-center">
                                                        <Product product={prod}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Outlet/>
        </section>
    )
}

type ProductProps = {
    product: Product
}

export function Product({product}: ProductProps) {
    return (
        <div className="relative  overflow-hidden p-2 pb-4 cursor-pointer w-52">
            <Link to={`product/${product.id}`}>
                <div className="p-4 rounded-xl mb-4 bg-smoke h-48">
                    <img className="object-contain" src={product.imgUrl} alt=""/>
                </div>
                <div>
                    <p className="font-bold">{priceFormat(product.price)}</p>
                    <span className="text-[14px] capitalize text-gray-600">{product.name}</span>
                    <p className="text-[14px] capitalize text-gray-600">{product.description}</p>
                </div>
            </Link>
            <div className="absolute right-4 top-36">
                <AddToCartButton cartCount={product?.count} productId={product.id}/>
            </div>
        </div>
    )
}

export function AddToCartButton({cartCount, productId, action=""}: { cartCount: number, productId: string, action?: string}) {
    const [isOpen, setIsOpen] = React.useState<boolean|null>(null)
    const [ count, setCount ] = React.useState(cartCount ?? 0);
    const fetcher = useFetcher();

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
