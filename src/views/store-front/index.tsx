import clsx from "clsx";
import React from "react";
import { Link, Outlet, useFetcher, useLoaderData, useLocation, useNavigate, useParams, useRouteLoaderData } from "react-router-dom"
import { priceFormat } from "../../utils/currency";
import { Restaurant, Store } from "../feed";
import { useDisclosure } from '@chakra-ui/react'
import { SubmitTarget } from "react-router-dom/dist/dom";
import { DrawerCart } from "../../components/cart/cart";
import { StoreInfoModal } from "../../components/store-info/modal";


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

type StoreInfos = Store & { cart: Array<Product> }

export type StoreFrontLoader = {
    productMap: Record<string, Array<Product>>,
    storeInfos: StoreInfos
    categories: Array<string>,
    searchQuery: string,
    searchResults: Array<Product>
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
            <React.Fragment>
                <div className="flex w-full px-16">
                    <div className="w-[250px] max-h-screen fixed top-[6.3rem]">
                        <StoreSummary storeInfos={storeInfos}/>
                        <div className="sticky top-[250px] max-h-[calc(100vh-250px)] pb-8 pt-3">
                            <div className="overflow-y-auto scroll-smooth h-[calc(100vh-250px)] pb-32" style={{ scrollbarWidth: 'thin'}}>
                                <CategoryList categories={categories}/>
                            </div>
                        </div>
                    </div>
                    <div className="ml-[250px] w-[calc(100%-250px)] pl-10">
                        <Outlet/>
                    </div>
                </div>
                { shouldOpenCart ? <DrawerCart storeId={storeId as string} onClose={() => {
                    navigate(location.pathname, { replace: true });
                    onClose();
                }} isOpen={isOpen} loaderData={rootData}/> : null}
            </React.Fragment>
    )
}

export function StoreSummary({ storeInfos }: { storeInfos: Store | Restaurant}) {
    return (
        <div className="text-black z-20 bg-white pb-4 border-b-[1px]">
            {
                storeInfos.imgUrl ? (
                    <div className="">
                        <div className="overflow-hidden w-28 h-28 border-[1px] shadow-custom bg-white rounded-full flex justify-center items-center mr-2 mb-4 px-2">
                            { storeInfos.imgUrl ? <img className="object-contain 2-24 h-24" src={storeInfos.imgUrl} alt="lcbo-logo"/> : null }
                        </div>
                    </div>
                ) : null
            }
            <div className="pl-2">
                <p className="font-bold text-xl mb-1">{ storeInfos?.name }</p>
                <div className="grid">
                    <span className="text-[12px] text-gray-600">{storeInfos?.location?.address}</span>
                    <span className="text-[12px] text-gray-600">Delivery fee (3.69$)</span>
                </div>
                <div className="text-[12px] text-gray-600r">
                    <div>
                        <span className="text-defaultGreen font-semibold">Open now</span>
                        <span> • </span>
                        <span>Closes at 11:39 PM</span>
                    </div>
                    <StoreInfoModal storeInfos={storeInfos}>
                        <span className="text-[12px] text-gray-600 underline cursor-pointer">More Infos</span>
                    </StoreInfoModal>
                </div>
            </div>
        </div>
    )
}

function CategoryList({ categories }: { categories: Array<string>}) {
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

    React.useEffect(() => {
        setSelected(currentCategory);
    }, [currentCategory])

    return (
        <ul className="w-full bg-white">
            { categories?.map((category:string) => (
                <li key={category} className={clsx("rounded-lg capitalize text-gray-800 font-semibold text-ls py-2 w-full  cursor-pointer px-2 first:mt-0",{
                    "bg-defaultGreen hover:bg-green-800 text-white": selected === category,
                    "hover:bg-gray-100 my-1": selected !== category
                })} onClick={() => handleSelection(category)}>{category}</li>
            ))}
        </ul>
    )
}

type ProductProps = {
    product: Product,
    action?: string,
    to?: string,
}

export function Product({product, action, to}: ProductProps) {
    return (
        <div className="relative overflow-hidden p-2 pb-4 w-56 group hover:scale-105 hover:shadow-custom rounded-xl transition-transform duration-500">
            <Link to={ to ?? `product/${product.id} `}>
                <div className="relative overflow-hidden rounded-lg grid place-items-center">
                    <div className="p-4 rounded-xl mb-4 h-[11rem] relative">
                        <img className="object-fit w-36" src={product.imgUrl} alt=""/>
                    </div>
                    <div className="bg-bg-product opacity-75 w-56 absolute inset-0"></div>
                </div>
                <div className="mt-1">
                    <p className="font-bold">{priceFormat(product.price)}</p>
                    <span className="text-[14px] capitalize text-gray-600">{product.name}</span>
                    <p className="text-[14px] capitalize text-gray-600">{product.description}</p>
                </div>
            </Link>
            <div className="absolute right-4 top-36 z-10">
                <ButtonIncrement type="submit" cartCount={product?.count} productId={product.id} action={action}/>
            </div>
        </div>
    )
}

export function CategoryFilter({ categories }: { categories: Array<string> }) {
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
        <div className="mt-20 flex items-center gap-2">
            <button className="h-10 rounded-xl flex items-center justify-between pr-3 gap-3">
                <span className="material-symbols-outlined text-3xl font-light">tune</span>
                <span className="font-bold capitalize">filters:</span>
            </button>
            <ul className="flex gap-2">
                { categories?.map(category => (
                    <Pill key={category} text={category} selected={selected === category} handleSelection={handleSelection} />
                ))}
            </ul>
        </div>
    )
}

export function Pill({ selected, handleSelection, text } : { selected: boolean, text: string, handleSelection: (t:string) => void }) {
    return (
        <>
        <li onClick={() => handleSelection(text)} className={clsx("capitalize flex items-center justify-center min-w-16 py-2 px-3 text-black font-black rounded-3xl text-[13px] cursor-pointer hover:shadow-custom", {
                'bg-realistic-btn bg-[black] text-white hover:bg-gray-700': selected,
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
