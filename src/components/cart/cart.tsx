import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    DrawerHeader,
} from '@chakra-ui/react';
import { Trigger } from '../../utils/trigger';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import React from 'react';
import { ButtonIncrement, Product } from '../../views/store-front';
import { getSubtotal, priceFormat } from '../../utils/currency';
import clsx from 'clsx';

export function CarTriggerForCheckout({ triggerElement }: { triggerElement: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { storeId, restaurantId } = useParams();
    const loaderData = useLoaderData();

    return (
        <React.Fragment>
            <Trigger onOpen={onOpen}>
                { triggerElement }
            </Trigger>
            <DrawerCart
                isOpen={isOpen}
                onClose={onClose}
                loaderData={loaderData}
                storeId={storeId || restaurantId}
                action={`store/${storeId}`}
            />
        </React.Fragment>
    )
}

export function DrawerCart({ isOpen, onClose, loaderData, storeId, action }: { isOpen: boolean, onClose: () => void, loaderData: any, action: string, storeId: string }) {
    const initialFocusRef = React.useRef(null);
    const cartCount = loaderData?.cartCount;
    const data = loaderData?.storeCartInfos;
    const storeAndCartSummary = Object.values(data);

    const storeInfos = data[storeId];
    const cartItems = storeInfos?.cart;
    const subtotal = getSubtotal(cartItems);
    return (
        <>
        <Drawer
            initialFocusRef={initialFocusRef}
            size={'sm'}
            isOpen={isOpen}
            placement='right'
            onClose={() => {
                onClose();
        }}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                    <div className='relative'>
                        <DrawerCloseButton className='outline-2' style={{zIndex: 2, fontSize: '16px', top: '50%', transform: 'translateY(-50%)', borderRadius: '50%', padding: '0px', left: '-13px'}} />
                        {
                            !storeInfos?.name ? (
                                <div>
                                    <p className='text-center text-[16px] font-medium'>Your carts</p>
                                    <p className='text-center text-xs text-gray-400'>Deliver to K1N6E3</p>
                                </div>
                            ) : (
                                <div className=''>
                                    <h1 className='text-2xl text-center font-bold'>{ storeInfos?.name }</h1>
                                    <p className='text-center text-xs text-gray-500'>{ storeInfos?.location.address }</p>
                                </div>
                            )
                        }
                    </div>
                </DrawerHeader>
                <DrawerBody className='pt-a grid bg-gray-100' style={{padding: 0, position: 'relative'}}>
                    {
                        cartCount === 0 ?
                            <NoCart onClose={onClose} /> :
                            <>
                                {
                                   storeId ?
                                   <Cart action={action} onClose={onClose} subtotal={subtotal} cartItems={cartItems} storeInfos={storeInfos} storeId={storeId}/>
                                   : null
                                }
                                <CartList onClose={onClose} list={storeAndCartSummary} showTitle={storeId}/>
                            </>
                    }
                </DrawerBody>
                { cartItems?.length ?
                    <div className='sticky top-full w-full py-5 gap-2 shadow-custom border-2 px-2 grid place-items-center bg-white'>
                        <ButtonActionAndValue ref={initialFocusRef} subtotal={subtotal}>Checkout</ButtonActionAndValue>
                        <button onClick={onClose} className='bg-gray-200 text-black py-2 rounded-3xl font-bold w-full hover:cursor-pointer hover:bg-gray-100'>Add more items</button>
                    </div> : null
                }
            </DrawerContent>
        </Drawer>
        </>
    )
}

export function NoCart({ onClose }: {onClose: () => void}) {
    return (
        <div className='h-full grid place-items-center'>
            <div className='flex items-center justify-center flex-col'>
                <h1 className='font-bold text-xl mb-3'>You have no cart yet</h1>
                <button
                    onClick={onClose}
                    className='bg-defaultGreen h-8 rounded-3xl hover:bg-green-800 p-5 text-white text-lg font-bold flex items-center'>Start shopping</button>
            </div>
        </div>
    )
}

function cartListFilteredFunc(list: Array<any>, against:string) {
    return list?.filter(elem => elem.cart[0].storeId !== against);
}

export function CartList({ list, showTitle, onClose }) {
    const { storeId } = useParams() as Record<string, string>;
    const filteredList = cartListFilteredFunc(list, storeId);
    return (
        filteredList?.length ? (
            <div className={clsx('relative bg-gray-100', {
                'mt-8': !showTitle
            })}>
                { showTitle ? <h1 className='px-5 mb-4 mt-8 font-bold text-lg'>Your other carts:</h1> : null }
                <div className='mb-8'>
                    <ul>
                        { filteredList?.map((summary) => { return <CartSummary onClose={onClose} key={summary.name} store={summary} /> }) }
                    </ul>    
                </div>
            </div>
        ) : null
    )
}

export function Cart({cartItems, storeId, subtotal, onClose, action}) {
    const isCurrentStoreCartEmpty = cartItems?.length;
    const formattedSubtotal = priceFormat(subtotal);
    return (
        <>
            {
                isCurrentStoreCartEmpty ? (
                    <div className='bg-white pt-8'>
                        <div className='mb-3 flex justify-between w-full px-5 text-[14px]'>
                            <p className='font-bold'>{cartItems?.length} {cartItems?.length > 1 ? "items" : "item"}</p>
                            <p className='text-md font-bold'>{formattedSubtotal}</p>
                        </div>
                        <ul className=''>
                            {
                                cartItems?.map((prod:Product) => {
                                    return <CartItem action={action} product={prod} storeId={storeId} key={prod.id}/>
                                })
                            }
                        </ul>
                        <div className='flex w-full justify-between px-5 pb-5'>
                            <p className='font-bold text-xl'>Subtotal </p>
                            <p className='font-bold'>{formattedSubtotal}</p>
                        </div>
                    </div>
                ):
                <EmptyCart onClose={onClose} />
            }
        </>
    )
}

function EmptyCart({ onClose }: { onClose: () => void}) {
    return (
        <div className='px-5 flex items-center flex-col justify-center gap-2'>
            <h1 className='text-center'>
                You have no item from this store in your cart
            </h1>
            <button onClick={onClose} className='p-2 rounded-3xl hover:bg-green-800  bg-defaultGreen hover:green-800 text-white font-bold'>Start shopping</button>
        </div>
    )
}

export const ButtonActionAndValue = React.forwardRef(function ButtonActionAndValue({subtotal, children} : { subtotal: number, children: React.ReactNode }, ref) {
    return (
        <button ref={ref} className='relative group w-full font-bold text-lg hover:bg-green-800 bg-defaultGreen py-2 rounded-3xl text-white px-4'>
            <span>{ children }</span>
            <span className='absolute right-2 bg-green-900 px-2 rounded-3xl text-[14px] group-hover:bg-defaultGreen'>{priceFormat(subtotal)}</span>
        </button>
    )
})

function CartItem({ product, storeId, action="." }: { product: Product, storeId?: string, action: string}) {
    return (
        <li className='relative border-t-[1px] px-5 py-4 bg-white hover:bg-smoke last:border-b-[1px] last:mb-3'>
            <Link key={product.id} to={`/store/${storeId}/product/${product.id}`}>
                <div className='w-full items-end py-4  cursor-pointer'>
                    <div className='h-full flex justify-between items-center'>
                        <div className='flex items-center'>
                            <div className='w-10 h-10 mb-2'>
                                <img src={product?.imgUrl}/>
                            </div>
                            <div className='text-[16px] capitalize'>
                                <h1 className='pl-2 font-medium'>{product.name}</h1>
                                <span className='pl-2 font-normal'>{priceFormat(product.price)}</span>&nbsp;
                                { product.offer ? <span className='font-semibold text-white px-1 rounded bg-defaultGreen'>{product.offer}</span>: null }
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className='absolute top-1/2 -translate-y-1/2 right-5 z-0'>
                <ButtonIncrement alwaysOnDisplay type="submit" textStyle='small' action={action} productId={product.id} cartCount={product.count}/>
            </div>
        </li>
    )
}

function getSubtotalAndCount(arr: Array<Product> = []) {
    return arr?.reduce((acc, curr) => ({...acc, count: acc?.count + curr?.count, price: curr?.price * curr?.count + acc?.price}), {count: 0, price: 0});
}

const fullCartIcon = <span className="material-symbols-outlined text-white font-bold text-xl">remove_shopping_cart</span>;

const emptyCartIcon = <span className="material-symbols-outlined text-white font-bold text-xl">shopping_cart</span>

export function CartIcon() {
    const {  storeCartInfos, carts } = useLoaderData();
    const { storeId } = useParams();
    const totalNumberOfCartItem = getSubtotalAndCount(carts).count;
    const { count: numberOfCartItemByStore } = getSubtotalAndCount(storeCartInfos[storeId]?.cart);
    const showEmptyCartIcon = storeId && numberOfCartItemByStore == 0 || !storeId && totalNumberOfCartItem == 0;

    return (
        <div className="flex justify-between items-center text-white w-full gap-2">
            { showEmptyCartIcon ? emptyCartIcon : fullCartIcon }
            <span className="font-bold text-[14px] bg-green-800 px-2 rounded-3xl group-hover/cartbtn:bg-defaultGreen"> { storeId ? numberOfCartItemByStore : totalNumberOfCartItem }</span>
        </div>
    )
}

export function Ping({color="defaultGreen"}: {color?: string}) {
    return (
        <div data-test-id="cart-ping" className="absolute top-0 right-0">
            <span className="relative flex h-3 w-3">
                <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-65", `bg-${color}`)}></span>
                <span className={clsx("relative inline-flex rounded-full h-3 w-3", `bg-${color}`)}></span>
            </span>
        </div>
    )
}

function CartSummary({ store, onClose }) {
    const { count, price: subtotal } = getSubtotalAndCount(store?.cart);

    return (
        <li className='bg-white rounded-xl shadow-custom mx-2 mb-8 flex flex-col py-8 px-5 justify-between group min-h-24'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex justify-center items-center'>
                    <div className='px-1 h-14 w-14 flex rounded-full border-[1px]'>
                        <img className='object-contain' src={store?.imgUrl} alt={store?.name}/>
                    </div>
                    <div className='ml-4'>
                        <p className='text-[14px] font-bold'>{ store?.name }</p>
                        <p className='text-[14px] font-semibold'>Subtotal: ${ subtotal }</p>
                        <p className='text-[14px] font-bold'>{  }</p>
                        <p className='text-[14px] font-bold text-defaultGreen'>{Math.random() * 10 > 4 ? "Closed . Open in 58 min": null }</p>
                    </div>
                </div>
                <div className='flex bg-defaultGreen rounded-xl justify-between items-center'>
                    <div className='w-6 relative rounded-full flex items-center justify-center font-bold'>
                        <span className='text-white text-md font-bold'>{ count }</span>
                    </div>
                </div>
            </div>
            <div className='mt-10 grid gap-2'>
            <button className='bg-gray-200 py-2 rounded-3xl font-bold w-full hover:bg-gray-100'>Checkout</button>
                <Link to={`store/${store?.storeId}`} onClick={() => onClose()}>
                    <button className='bg-gray-200 py-2 rounded-3xl font-bold w-full hover:bg-gray-100'>Add more items</button>
                </Link>
            </div>
        </li>
    )
}
