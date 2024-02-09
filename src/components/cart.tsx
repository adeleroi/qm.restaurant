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
} from '@chakra-ui/react';
import { Trigger } from '../utils/trigger';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import React from 'react';
import { AddToCartButton, Product } from '../views/store-front';
import { getSubtotal, priceFormat } from '../utils/currency';
import clsx from 'clsx';

export function CarTriggerForCheckout({ triggerElement }: { triggerElement: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const loaderData = useLoaderData();
    const { storeId } = useParams();
    const [ selectedStoreId, setSelectedStoreId ] = React.useState(storeId);
    const storeCartInfos = loaderData?.storeCartInfos;
    const storeInfos = storeCartInfos[selectedStoreId];
    const cartItems = storeInfos?.cart;
    const subtotal = getSubtotal(cartItems || []);
    const distinctItemCount = loaderData?.cartCount;

    return (
        <>
        <Trigger onOpen={onOpen}>
            { triggerElement }
        </Trigger>
        <Drawer
            size={'sm'}
            isOpen={isOpen}
            placement='right'
            onClose={() => {
                setSelectedStoreId(storeId);
                onClose();
                }}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody className='pt-a grid ' style={{padding: 0, position: 'relative', height: '100vh'}}>
                    <div className=''>
                        <div className='flex justify-between'>
                            <div className='flex justify-end w-full px-6 mt-4 z-20 text-md right-5 font-bold'>
                                <DrawerCloseButton style={{zIndex: 2, fontSize: '16px', borderRadius: '50%', padding: '0px', left: '10px'}} />
                                {
                                    distinctItemCount ? (<CartButtonWithPopOver onClick={setSelectedStoreId} className="hover:underline cursor-pointer" storeCartInfos={storeCartInfos} as="div" withNavigation={false}>
                                        My carts({ distinctItemCount })
                                    </CartButtonWithPopOver>) : null
                                }
                            </div> 
                        </div>
                        {
                            cartItems?.length ? (
                                <div className='px-5'>
                                    <div className='mt-12 mb-14'>
                                        <h1 className='text-2xl text-center font-bold'>{ storeInfos?.name }</h1>
                                        <p className='text-center text-xs text-gray-500'>{ storeInfos?.location.address }</p>
                                    </div>
                                    <div className='mb-3 flex justify-between w-full'>
                                        <p className='font-semibold'>{cartItems?.length} {cartItems?.length > 1 ? "items" : "item"}</p>
                                        <p className='text-md font-semibold'>{priceFormat(subtotal)}</p>
                                    </div>
                                    <ul className=''>
                                        {
                                            cartItems?.map((prod:Product) => {
                                                return <CartItem product={prod} storeId={storeId} key={prod.id}/>
                                            })
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div className='h-screen grid place-items-center font-bold'>
                                    <h1>You have no cart yet</h1>
                                </div>
                            )
                        }
                    </div>
                </DrawerBody>
                { cartItems?.length ?

                    <div className='sticky top-full w-full py-2  shadow-custom border-2 px-2 grid place-items-center bg-white'>
                        <ButtonActionAndValue subtotal={subtotal}>Chekout</ButtonActionAndValue>
                    </div> :
                    null }
            </DrawerContent>
        </Drawer>
        </>
    )
}

export function ButtonActionAndValue({subtotal, children}: { subtotal: number, children: React.ReactNode }) {
    return (
        <button className='w-full font-bold text-lg hover:bg-green-800 bg-defaultGreen h-14 rounded-xl text-white flex justify-between items-center px-4'>
            <span>{ children }</span>
            <span>{priceFormat(subtotal)}</span>
        </button>   
    )
}

function CartItem({ product, storeId }: { product: Product, storeId?: string}) {
    return (
        <li className='relative'>
            <Link key={product.id} to={`store/${storeId}/product/${product.id}`}>
                <div className='w-full items-end py-3 pb-6 border-t-2 cursor-pointer hover:bg-smoke'>
                    <div className='h-full flex justify-between items-start'>
                        <div className='flex items-start'>
                            <div className='w-12 h-12 bg-gray-400 mb-2'></div>
                            <h1 className='pl-2 text-md font-semibold'>{product.name}</h1>
                        </div>
                    </div>
                    <div>
                        <span className='font-semibold text-[14px]'>{priceFormat(product.price)}</span>&nbsp;
                        { product.offer ? <span className='font-semibold text-white px-1 rounded text-[14px] bg-defaultGreen'>{product.offer}</span>: null }
                    </div>
                </div>
            </Link>
            <div className='absolute top-4 right-0 z-0'>
                <AddToCartButton action='store/:storeId' productId={product.id} cartCount={product.count}/>
            </div>
        </li>
    )
}

function getSubtotalAndCount(arr: Array<Product> = []) {
    return arr?.reduce((acc, curr) => ({...acc, count: acc?.count + curr?.count, price: acc?.price + curr?.price}), {count: 0, price: 0});
}

const fullCartIcon = <><span className="material-symbols-outlined text-white font-bold text-2xl">remove_shopping_cart</span></>;

const emptyCartIcon = <span className="material-symbols-outlined text-white font-bold">shopping_cart</span>

export function CartIcon() {
    const {  storeCartInfos, carts } = useLoaderData();
    const { storeId } = useParams();
    const totalNumberOfCartItem = getSubtotalAndCount(carts).count;
    const { count: numberOfCartItemByStore } = getSubtotalAndCount(storeCartInfos[storeId]?.cart);
    // const numberOfCart = Object.keys(storeCartInfos)?.length;

    return (
        <div className="flex justify-center items-center text-white text-xl">
            { storeId && numberOfCartItemByStore == 0 || !storeId && totalNumberOfCartItem == 0 ? emptyCartIcon : fullCartIcon }
            <span className="px-2 font-bold"> { storeId ? numberOfCartItemByStore : totalNumberOfCartItem }</span>
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


export function CartButtonWithPopOver({ onClick, className, children, storeCartInfos, withNavigation=true, as="button" }) {
    const stores = storeCartInfos && Object.entries(storeCartInfos);

    return (
        <Menu direction='rtl'>
            {({onClose}) => (
                <>
                    <MenuButton as={as} className={clsx(className, {'rounded-3xl h-8 shadow-custom w-[6rem] px-2 py-5 text-md cursor-pointer text relative flex justify-center items-center hover:bg-gray-100': as === 'button'})}>
                        { children }
                    </MenuButton>
                    <MenuList padding={0} className='rounded-3xl cursor-pointer' style={{borderRadius: '20px', overflow: 'hidden'}}>
                        {
                            stores?.map(store => {
                                return (
                                    <CartMenuItem withNavigation={withNavigation} onClick={onClick} onClose={onClose} storeId={store[0]} key={store[1]?.name}>
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

function CartMenuItem({ onClick, withNavigation=true, storeId, children, onClose }) {
    // const fetcher = useFetcher();
    if (withNavigation) {
        return <Link onClick={onClose} to={`store/${storeId}`}>{children}</Link>
    }
    return (
        <div onClick={() => {
            onClose();
            onClick(storeId)
        }}>
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
