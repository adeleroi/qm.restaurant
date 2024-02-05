import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import { Trigger } from '../utils/trigger';
import { useLoaderData } from 'react-router-dom';
import React from 'react';
import { AddToCartButton, Product } from '../views/store-front';

export function CartTrigger({ triggerElement }: { triggerElement: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const loaderData = useLoaderData();
    const cartItems = loaderData?.carts;
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
            <DrawerContent className=''>
                <DrawerCloseButton className='left-5' style={{top: '20px'}} />    
                <DrawerBody className='mt-16' style={{paddingLeft: 0, paddingRight: 0}}>
                    <div className='relative h-full'>
                        <div className='px-5'>
                            <h1 className='text-4xl font-bold mb-8'>LCBO</h1>
                            <div className='mb-3 flex justify-between w-full'>
                                <p className='font-semibold'>{distinctItemCount} {distinctItemCount > 1 ? "items" : "item"}</p>
                                <p className='text-xl font-semibold'>75.48$</p>
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
                        <div className='mt-8 w-full shadow-custom border-2 p-2 fixed bottom-0'>
                            <button className='w-full font-bold text-xl hover:bg-gray-800 bg-black h-16 rounded-xl text-white'>Go to Checkout</button>
                        </div>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
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
                <span className='font-semibold text-[14px]'>{product.price}$</span>&nbsp;
                <span className='font-semibold text-white px-1 rounded text-[14px] bg-defaultGreen'>{product.offer}</span>
            </div>
        </li>
    )
}

function getTotalItemCount(arr: Array<Product> = []) {
    return arr?.reduce((acc, curr) => ({...acc, count: acc?.count + curr?.count}), {count: 0});
}

const cartIcon = (
    <>
        <span className="material-symbols-outlined text-defaultGreen">remove_shopping_cart</span>
        <Ping/>
    </>
);

const emptyCartIcon = <span className="material-symbols-outlined text-defaultGreen">shopping_cart</span>

export function CartIcon() {
    const loaderData = useLoaderData();
    const currCartCount = getTotalItemCount(loaderData.carts).count;

    return (
        <div className="flex justify-between">
            {currCartCount > 0 ? cartIcon : emptyCartIcon}
            <span className="font-semibold text-defaultGreen">. { currCartCount || 0} </span>
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
