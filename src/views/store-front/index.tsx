import clsx from "clsx";
import React from "react";
import { ActionFunctionArgs, Link, LoaderFunctionArgs, Outlet, json, redirect, useFetcher, useLoaderData, useLocation, useNavigate, useNavigation, useParams, useRouteLoaderData } from "react-router-dom"
import { db } from "../../firebase/fireStore";
import { collection, doc, getDoc, getDocs, runTransaction, serverTimestamp } from "firebase/firestore";
import Cookies from "js-cookie";
import { priceFormat } from "../../utils/currency";
import { Store } from "../store-list";

import { Skeleton, SkeletonCircle, SkeletonText, useDisclosure } from '@chakra-ui/react'
import { SubmitTarget } from "react-router-dom/dist/dom";
import { DrawerCart } from "../../components/cart/cart";

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
    maxPurchasedQuantity?: number,
}

export async function loader({params}: LoaderFunctionArgs) {
    const userId = Cookies.get('qm_session_id') as string;
    if (!userId) {
        return redirect('/',)
    }

    const storeId = params.storeId as string;
    const carts: Array<Product> = [];
    const cartItemIds = new Map<string, number>();
    const productMap: Record<string, Array<Product>> = {};
    const categories: Array<string> = [];

    const productListRef = collection(db, "store", storeId, "product"); 

    const [
        cartSnapshot,
        productSnapshot,
        categorySnapshot,
    ] = await Promise.all([
        await getDocs(collection(db, "users", userId, "cart")),
        await getDocs(productListRef),
        await getDocs(productListRef),
    ]);

    categorySnapshot.forEach(cat => {
        categories.push(cat.data().category);
    });

    cartSnapshot.forEach(cartItem => {
        const data = cartItem.data();
        carts.push({id: cartItem.id, ...data} as Product);
        cartItemIds.set(cartItem.id, data.count);
    });

    productSnapshot.forEach(prod => {
        const productInStore = { id: prod.id, count: 0, storeId, ...prod.data() } as Product;
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
    const storeInfos = { id: storeDoc.id, ...storeDoc.data() }

    return json({ productMap, storeInfos, categories: [...new Set(categories)] });
}

export async function action({request, params}: ActionFunctionArgs) {
    const storeId = params?.storeId as string;
    const userId = Cookies.get('qm_session_id') as string;
    const { productId, count: itemCount } = await request.json() as Record<string, string>;
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

export type StoreFrontLoader = {
    productMap: Record<string, Array<Product>>,
    storeInfos: StoreInfos
    categories: Array<string>,
}

export function StoreFront() {
    const location = useLocation();
    const navigate = useNavigate();
    const { storeId } = useParams();
    const { storeInfos, categories } = useLoaderData() as StoreFrontLoader;
    const rootData = useRouteLoaderData('root');
    const { onClose, onOpen, isOpen} = useDisclosure();
    const shouldOpenCart = new URLSearchParams(location.search).get('openCart');

    React.useEffect(() => {
        if (shouldOpenCart) {
            onOpen();
        }
            
        return onClose;
    }, [onOpen, onClose, shouldOpenCart])

    return (
        <section className="px-16">
            <div style={{backgroundColor: storeInfos?.backgroundColor}} className="flex w-full items-center pb-4 rounded-b-lg">
                <div className="pl-8">
                    <div className="w-20 h-20 border-[1px] bg-white rounded-full flex justify-center items-center mr-2 my-4 px-2">
                        <img className="object-contain" src={storeInfos.imgUrl} alt="lcbo-logo"/>
                    </div>
                    <div className="text-white">
                        <p className="font-bold text-3xl">{ storeInfos?.name }</p>
                        <span className="text-xs font-semibold">Delivery fee (3.69$) . {storeInfos.location.address}</span>
                    </div>
                </div>
            </div>
            <CategoryFilter categories={categories} />
            { shouldOpenCart ? <DrawerCart storeId={storeId} onClose={() => {
                navigate(location.pathname)
                onClose();
            }} isOpen={isOpen} loaderData={rootData}/> : null}
            <Outlet/>
        </section>
    )
}


export function ScrollableCategory({ category, productMap }: { category: string, productMap: Record<string, Array<Product>>}) {
    const slideRef = React.useRef<HTMLDivElement | null>(null);
    const [ disabledNextBtn, setDisabledNextBtn ] = React.useState(false);
    const [ disabledPrevBtn, setDisabledPrevBtn ] = React.useState(true);

    const [ displayScrollBtn, setDisplayScrollBtn ] = React.useState(false);

    function handleClick(position: 'left' | 'right') {
        const el = slideRef.current;
        if (!el) return;
        el.scrollBy({
            left: position === 'left' ? - el.offsetWidth : el.offsetWidth,
            behavior: "smooth",
        });
    }

    function handleScroll() {
        const el = slideRef.current
        if (!el) return;
        const prevBtnActivationTreshold = 0; // 0.5 * el.offsetWidth;
        if (el.scrollLeft > prevBtnActivationTreshold) {
            setDisabledPrevBtn(false)
        } else {
            setDisabledPrevBtn(true)
        }

        const hasReachedTheRightEndSide = el.scrollLeft + el.offsetWidth == el.scrollWidth;
        if (hasReachedTheRightEndSide) {
            setDisabledNextBtn(true);
        } else {
            setDisabledNextBtn(false)
        }
    }

    React.useEffect(() => {
        const el = slideRef.current;
        if (el) {
            setDisplayScrollBtn(el.scrollWidth > el.offsetWidth);
        }
    }, [])

    return (
        <div className="my-16" key={category}>
            <div className="flex justify-between w-full">
                <h1 className="text-2xl font-bold capitalize">{category}</h1>
                {
                  displayScrollBtn ? (
                    <div className="flex gap-2">
                        <button disabled={disabledPrevBtn} onClick={() => handleClick('left')} className="disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-gray-200 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 text-black grid place-items-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                                arrow_back_ios
                            </span>
                        </button>
                        <button disabled={disabledNextBtn} onClick={() => handleClick('right')} className="disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-gray-200  rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 text-black grid place-items-center">
                            <span className="material-symbols-outlined text-[16px] font-bold">
                                arrow_forward_ios
                            </span>
                        </button>
                    </div>
                    ): null

                }
            </div>
            <div className="item-list my-5 py-4 gap-2 mb-10 flex overflow-x-auto snap-x scroll-smooth" ref={slideRef} onScroll={handleScroll}>
                {
                    productMap?.[category]?.map((prod, idx) => {
                        return (
                            <div key={idx} className="snap-center">
                                <Product product={prod} action={`.`}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

type ProductProps = {
    product: Product,
    action?: string,
    to?: string,
}

export function Product({product, action, to}: ProductProps) {
    return (
        <div className="relative overflow-hidden p-2 pb-4 w-56">
            <Link to={ to ?? `product/${product.id} `}>
                <div className="p-4 rounded-xl mb-4 h-52 relative">
                    <img className="object-contain" src={product.imgUrl} alt=""/>
                </div>
                <div>
                    <p className="font-bold">{priceFormat(product.price)}</p>
                    <span className="text-[14px] capitalize text-gray-600">{product.name}</span>
                    <p className="text-[14px] capitalize text-gray-600">{product.description}</p>
                </div>
            </Link>
            <div className="absolute right-4 top-40">
                <ButtonIncrement type="submit" cartCount={product?.count} productId={product.id} action={action}/>
            </div>
        </div>
    )
}

function CategoryFilter({ categories }: { categories: Array<string> }) {
    const { categoryId: currentCategory } = useParams();
    const [selected, setSelected] = React.useState(currentCategory);
    const navigate = useNavigate();

    function handleSelection(value: string) {
        if (currentCategory === value) {
            setSelected('')
            navigate("./", { relative: 'path' });
            return;
        }
        setSelected(value);
        navigate(`category/${encodeURIComponent(value)}`);
    }

    return (
        <>
            <ul className="mt-10 flex gap-2">
                { categories?.map(category => (
                    <Pill key={category} text={category} selected={selected === category} handleSelection={handleSelection} />
                ))}
            </ul>
        </>
    )
}

export function ProductListSkeleton() {
    return (
        <React.Fragment>
            {
                Array.from({length: 5}).map((_, idx) => ((
                    <React.Fragment key={idx}>
                    <div className="mt-14 w-32">
                        <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={1} skeletonHeight={4}/>
                    </div>
                    <div className="grid xl:grid-cols-6 2xl:grid-cols-7 gap-8 my-10">
                        {
                            Array.from({length: 6}).map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <div>
                                        <div className="w-56 h-52 rounded-xl overflow-hidden relative">
                                            <Skeleton startColor="gray.100" endColor="gray.200" key={idx} className="w-full h-full mb-2 rounded-3xl"></Skeleton>
                                            <SkeletonCircle startColor={"gray.100"} className="absolute top-40 right-2 bg-white" />
                                        </div>
                                        <div className="w-56">
                                            <SkeletonText startColor="gray.100" endColor="gray.200" noOfLines={2} mt={2} spacing={2} skeletonHeight={2}/>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                    </React.Fragment>
                )))
            }
        </React.Fragment>

    )
}

export function Pill({ selected, handleSelection, text } : { selected: boolean, text: string, handleSelection: (t:string) => void }) {
    return (
        <>
        <li onClick={() => handleSelection(text)} className={clsx("capitalize flex items-center justify-center min-w-16 py-2 px-3 text-black font-black rounded-3xl text-[13px] cursor-pointer hover:shadow-custom", {
                'bg-black text-white': selected,
                'bg-gray-200 hover:bg-gray-100': !selected,
            })}>{ text }</li>
        </>
    )
}

type  AddToCartButtonProps = {
    productId?: string,
    getCount?: (value: number) => void,
    cartCount?: number,
    action?: string,
    textStyle?: "medium" | "small",
    type?: "button" | "submit",
    disabled?: boolean,
    limitInf?: number,
    limitMax?: number,
    onLimitDisable?: boolean,
    alwaysOnDisplay?: boolean,
}
export function ButtonIncrement({ getCount, productId, disabled, limitInf=1, limitMax=100, onLimitDisable=false, type="button", action=".", textStyle="medium", cartCount=0, alwaysOnDisplay=false }: AddToCartButtonProps) {
    // limitInf must be in [1, Inf[ with onLimitDisable set to false by default
    const [isOpen, setIsOpen] = React.useState<boolean | null>(alwaysOnDisplay || null); // null is to prevent the animation to start on page load.
    const [ count, setCount ] = React.useState(0);
    const fetcher = useFetcher();

    const disabledOnLimitInf = onLimitDisable && limitInf === count;
    const disabledOnLimitMax = onLimitDisable && limitMax === count;

    function handleBlur(event: React.FocusEvent<HTMLDivElement, HTMLElement>) {
        if (alwaysOnDisplay) return;
        if (!event.currentTarget.contains(event?.relatedTarget)) {
            setIsOpen(false);
        }
    }

    function handleRemoveButton() {
        if (count < limitInf+1) {
            if (!alwaysOnDisplay) {
                setIsOpen(false);
            }
        }
        const newCount = count == limitInf ? 0 : count - 1
        setCount(newCount);
        type == "button" ? getCount?.(newCount) : fetcher.submit(
                JSON.stringify({count: newCount, productId}) as SubmitTarget,
                {method: 'POST', action, encType: 'application/json'}
            );
    }

    function handleAddButton() {
        setIsOpen(true);
        let newCount = 0;
        if (!isOpen && count === 0) {
            newCount = limitInf;
        } else if (isOpen) {
            newCount = count + 1;
        } else {
            // if button is closed and count !== 0;
            return;
        }
        setCount(newCount);
        type == "button" ? getCount?.(newCount) : fetcher.submit(
            JSON.stringify({count: newCount, productId}) as SubmitTarget,
            {method: "POST", action, encType: 'application/json'}
        );
    }

    React.useEffect(() => {
        setCount(cartCount);
    }, [cartCount]);

    return (
        <div tabIndex={1} onBlur={handleBlur}  className={clsx("focus:outline-none", {"cursor-not-allowed": disabled})}>
            <div className={clsx("will-change-[width] border rounded-3xl flex shadow-custom items-center bg-white", {
                    "animate-open-add-to-card": isOpen,
                    "animate-close-add-to-card": isOpen === false,
                    "bg-[#ededed] cursor-not-allowed": disabled,
                    "cursor-pointer": !disabled
                })}>
                <button onClick={handleRemoveButton}
                    disabled={disabled || disabledOnLimitInf}
                    type={type}
                    className={clsx("bg-white rounded-full m-[1px] w-8 h-8 justify-center items-center", {
                        "flex": isOpen,
                        "hidden": !isOpen,
                        "text-lg font-bold": textStyle === 'medium',
                        "bg-[#ededed] cursor-not-allowed": disabled,
                        "cursor-not-allowed": disabledOnLimitInf,
                        "hover:bg-[#ededed]": !disabled && !disabledOnLimitInf
                    })}>
                    { count !== limitInf ? (
                            <span className={clsx("font-semibold", {"cursor-not-allowed text-gray-300": disabledOnLimitInf})}>-</span>
                        ) : (
                            <span className={clsx("material-symbols-outlined font-semibold", {
                                "cursor-not-allowed text-gray-200": disabledOnLimitInf,
                            })}>delete</span>
                        )
                    }
                </button>
                <div className={clsx("items-center justify-center px-2 cursor-default", {
                    "flex": isOpen,
                    "hidden": !isOpen,
                })}>
                    {count}
                </div>
                <button onClick={handleAddButton}
                    disabled={disabled || disabledOnLimitMax && !!isOpen}
                    type={type}
                    className={clsx("will-change-auto cursor-pointer flex bg-white rounded-full m-[1px] w-8 h-8 justify-center items-center", {
                        "text-lg font-bold": textStyle === "medium",
                        "bg-[#ededed] text-gray-600 cursor-not-allowed": disabled,
                        "cursor-not-allowed": disabledOnLimitMax && isOpen,
                        "hover:bg-[#ededed]": !disabled && !disabledOnLimitMax
                    })}>
                    <span className={clsx({"text-gray-300": disabledOnLimitMax && isOpen})}>{ !isOpen && count > 0 ? count : "+" }</span>
                </button>
            </div>
        </div>
    )
}
