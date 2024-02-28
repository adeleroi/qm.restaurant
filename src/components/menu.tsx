import React from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import { signout, useFirebaseAuth } from '../firebase/auth';
import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

export function Menu() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { loggedOut, loggedIn } = useFirebaseAuth();
    return (
        <>
        <span onClick={onOpen} className="material-symbols-outlined cursor-pointer">menu</span>
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent className=''>
            <DrawerCloseButton className='left-5' style={{top: '20px', fontSize: '16px', borderRadius: '50%', outline: "none", border: 'none', outlineOffset: '0px'}} />    
            <DrawerBody className='mt-16' style={{paddingLeft: 0, paddingRight: 0}}>
                <ul>
                    <MenuIntem to={loggedIn ? '/restaurant' : '/'} onClick={onClose}>
                        <span className="material-symbols-outlined font-medium outline-none">home</span>
                        <span className='ml-5'>Home</span>
                    </MenuIntem>
                    <MenuIntem to="" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">shoppingmode</span>
                        <span className='ml-5'>Offers</span>
                    </MenuIntem>
                    {/* <MenuIntem to="store" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">local_mall</span>
                        <span className='ml-5'>stores</span>
                    </MenuIntem>
                    <MenuIntem to="restaurant" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">takeout_dining</span>
                        <span className='ml-5'>Restaurants</span>
                    </MenuIntem> */}
                    <MenuIntem hide={loggedOut} to="" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">receipt_long</span>
                        <span className='ml-5'>Orders</span>
                    </MenuIntem>
                    <MenuIntem to="" hide={loggedOut} onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">person</span>
                        <span className='ml-5'>Profile</span>
                    </MenuIntem>
                    <MenuIntem to="" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">newsmode</span>
                        <span className='ml-5'>Blog</span>
                    </MenuIntem>
                    <MenuIntem to="" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">support</span>
                        <span className='ml-5'>Help</span>
                    </MenuIntem>
                    {
                        loggedIn ? (
                            <MenuIntem hide={loggedOut} to="/" reloadDocument onClick={() => {
                                onClose();
                                signout();
                            }}>
                                <span className="material-symbols-outlined font-medium">logout</span>
                                <span className='ml-5'>Log out</span>
                            </MenuIntem>
                        ) : (
                            <MenuIntem to="" hide={loggedIn}>
                                <span className="material-symbols-outlined font-medium">login</span>
                                <span className='ml-5'>Sign in | Sign up</span>
                            </MenuIntem>
                        )
                    }
                    <MenuIntem to="" onClick={onClose}>
                        <span className="material-symbols-outlined font-medium">translate</span>
                        <span className='ml-5'>English</span>
                    </MenuIntem>
                </ul>
                <div className='bg-gray-200 h-[2px] w-full'></div>
                <ul>
                    <MenuIntem to="" withIcon={false} onClick={onClose}>
                        Add your commerce
                    </MenuIntem>
                    <MenuIntem to="" withIcon={false} onClick={onClose}>
                       Become a delivery driver
                    </MenuIntem>
                </ul>
            </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    )
}

type TMenuItem = {
    className?: string,
    children?: React.ReactNode,
    withIcon?: boolean,
    onClick?: () => void,
    hide?: boolean,
    to: string,
    reloadDocument?: boolean,
}

function MenuIntem({ to, className, children, withIcon=true, onClick, hide, reloadDocument, ...rest }: TMenuItem) {
    return (
        <NavLink to={to} reloadDocument={reloadDocument}>
            <li onClick={onClick} className={clsx('hover:bg-gray-100 px-3 w-full cursor-pointer last:border-none', className, {
                'hidden': hide,
                'border-b-[1px]': withIcon
            })} {...rest}>
                <div className={clsx('font-medium text-lg h-12 px-3 flex justify-start items-center')}>
                    { children }
                </div>
            </li>
        </NavLink>
    )
}
