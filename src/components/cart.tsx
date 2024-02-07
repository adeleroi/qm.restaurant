import {
    // Drawer
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    // Menu
    Menu,
    MenuButton,
    MenuList,
} from '@chakra-ui/react'
import { Trigger } from '../utils/trigger';
import { Link, useFetcher, useLoaderData, useParams } from 'react-router-dom';
import React from 'react';
import { AddToCartButton, Product } from '../views/store-front';
import { getSubtotal, priceFormat } from '../utils/currency';
import clsx from 'clsx';

export function CarTriggerForCheckout({ triggerElement }: { triggerElement: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const loaderData = useLoaderData();
    const { storeId } = useParams();
    const storeCartInfos = loaderData?.storeCartInfos;
    const storeInfos = storeCartInfos[storeId];
    const cartItems = storeInfos.cart;
    const subtotal = getSubtotal(cartItems);
    const distinctItemCount = loaderData?.carts?.length;

    return (
        <>
        <Trigger onOpen={onOpen}>
            { triggerElement }
        </Trigger>
        <Drawer
            size={'sm'}
            isOpen={isOpen}
            placement='right'
            onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody className='pt-a grid ' style={{padding: 0, position: 'relative', height: '100vh'}}>
                    <div className=''>
                        <div className='flex justify-between'>
                            <div className='flex justify-end w-full px-6 mt-4 z-20 text-md right-5 font-bold'>
                                <DrawerCloseButton style={{zIndex: 2, fontSize: '16px', borderRadius: '50%', padding: '0px', left: '10px'}} />
                                <CartButtonWithPopOver storeCartInfos={storeCartInfos} as="div" withNavigation={false}>
                                    <span className='hover:underline cursor-pointer'>
                                        Cart list(3)
                                    </span>
                                </CartButtonWithPopOver>
                            </div> 
                        </div>
                        <div className='px-5'>
                            <div className='mt-12 mb-14'>
                                <h1 className='text-2xl text-center font-bold'>{ storeInfos.name }</h1>
                                <p className='text-center text-xs text-gray-500'>{ storeInfos.location.address }</p>
                            </div>
                            <div className='mb-3 flex justify-between w-full'>
                                <p className='font-semibold'>{distinctItemCount} {distinctItemCount > 1 ? "items" : "item"}</p>
                                <p className='text-md font-semibold'>{priceFormat(subtotal)}</p>
                            </div>
                            <ul className=''>
                                {
                                    cartItems?.map((prod:Product) => {
                                        return (
                                            <CartItem key={prod.id} product={prod}/>
                                        )          
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </DrawerBody>
                <CheckoutButton subtotal={subtotal}/>
            </DrawerContent>
        </Drawer>
        </>
    )
}

function CheckoutButton({subtotal}) {
    return (
        <div id="checkout-section" className='sticky top-full w-full h-28  shadow-custom border-2 px-2 grid place-items-center bg-white'>
            <button className='w-full font-bold text-lg hover:bg-green-800 bg-defaultGreen h-14 rounded-3xl text-white flex justify-between items-center px-4'>
                <span>Checkout</span>
                <span>{priceFormat(subtotal)}</span>
            </button>   
        </div>
    )
}

function CartItem({product}: {product: Product}) {
    return (
        <li className='relative w-full items-end py-3 pb-6 border-t-2 cursor-pointer hover:bg-smoke'>
            <div className='h-full flex justify-between items-start'>
                <div className='flex items-start'>
                    <div className='w-12 h-12 rounded-xl bg-gray-400 mb-2'></div>
                    <h1 className='pl-2 text-md font-semibold'>{product.name}</h1>
                </div>
                <div className='absolute top-3 right-0'>
                    <AddToCartButton action='store/:storeId' productId={product.id} cartCount={product.count}/>
                </div>
            </div>
            <div>
                <span className='font-semibold text-[14px]'>{priceFormat(product.price)}</span>&nbsp;
                { product.offer ? <span className='font-semibold text-white px-1 rounded text-[14px] bg-defaultGreen'>{product.offer}</span>: null }
            </div>
        </li>
    )
}

function getSubtotalAndCount(arr: Array<Product> = []) {
    return arr?.reduce((acc, curr) => ({...acc, count: acc?.count + curr?.count, price: acc?.price + curr?.price}), {count: 0, price: 0});
}

const fullCartIcon = <><span className="material-symbols-outlined text-defaultGreen">remove_shopping_cart</span><Ping/></>;

const emptyCartIcon = <span className="material-symbols-outlined text-defaultGreen">shopping_cart</span>

export function CartIcon() {
    const {  storeCartInfos } = useLoaderData();
    const { storeId } = useParams();
    const { count: totalCount } = getSubtotalAndCount(storeCartInfos[storeId]?.cart);
    const currStoreCount = Object.keys(storeCartInfos)?.length;

    return (
        <div className="flex justify-center">
            { currStoreCount > 0 ? fullCartIcon : emptyCartIcon }
            <span className="font-semibold text-defaultGreen">. { !storeId ? currStoreCount : totalCount} </span>
        </div>
    )
}

function Ping() {
    return (
        <div data-test-id="cart-ping" className="absolute top-0 right-0">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-defaultGreen opacity-65"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-defaultGreen"></span>
            </span>
        </div>
    )
}


export function CartButtonWithPopOver({ children, storeCartInfos, withNavigation=true, as="button" }) {
    const stores = Object.entries(storeCartInfos);

    return (
        <Menu direction='rtl'>
            {({onClose}) => (
                <>
                    <MenuButton as={as} className={clsx("", {'rounded-3xl h-8 shadow-custom w-[6rem] px-2 py-5 text-md cursor-pointer text relative flex justify-center items-center hover:bg-gray-100': as === 'button'})}>
                        { children }
                    </MenuButton>
                    <MenuList padding={0} className='rounded-3xl cursor-pointer' style={{borderRadius: '20px', overflow: 'hidden'}}>
                        {
                            stores?.map(store => {
                                return (
                                    <CartMenuItem withNavigation={withNavigation} onClose={onClose} storeId={store[0]} key={store[1]?.name}>
                                        <Cart store={store[1]}/>
                                    </CartMenuItem>
                                )
                            })
                        }
                    </MenuList>
                </>
            )}
        </Menu>
    )
}

function CartMenuItem({ withNavigation=true, storeId, children, onClose }) {
    // const fetcher = useFetcher();
    if (withNavigation) {
        return <Link onClick={onClose} to={`store/${storeId}`}>{children}</Link>
    }
    return (
        <div onClick={onClose}>
            {children}
        </div>
    )
}

function Cart({ store }) {
    const { count, price: subtotal } = getSubtotalAndCount(store?.cart);

    return (
        <li className='flex w-[25rem] justify-between border-t-[1px] p-4 hover:bg-smoke first:border-none'>
            <div className='flex justify-between items-center w-full'>
                <div className='flex justify-center items-center'>
                    <div className='h-12 w-12 bg-blue-600 rounded-full'></div>
                    <div className='ml-4'>
                        <p className='text-[14px] font-bold'>{ store?.name }</p>
                        <p className='text-[14px] font-semibold'>Subtotal: ${ subtotal }</p>
                        <p className='text-[14px] font-bold'>{  }</p>
                        <p className='text-[14px] font-bold text-defaultGreen'>{Math.random() * 10 > 4 ? "Closed . Open in 58 min": null }</p>
                    </div>
                </div>
                <div>
                    <div className='w-6 h-6 bg-defaultGreen relative rounded-full flex items-center justify-center font-bold'>
                        <span className='text-white text-xs'>{ count }</span>
                    </div>
                </div>
            </div>
        </li>
    )
}
