import React from 'react';
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react'

export function Menu() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    return (
        <>
        <span onClick={onOpen} className="material-symbols-outlined cursor-pointer">menu</span>
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent className=''>
            <DrawerCloseButton className='left-5' style={{top: '20px'}} />    
            <DrawerBody className='mt-16' style={{paddingLeft: 0, paddingRight: 0}}>
                <ul>
                    {
                        Object.keys(iconMap).map((item, idx) => (
                            <MenuIntem icon={iconMap[item]} key={idx}>{item}</MenuIntem>
                        ))
                    }
                </ul>
            </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    )
}

const iconMap = {
    "Home": <span className="material-symbols-outlined font-medium">home</span>,
    "Offers": <span className="material-symbols-outlined font-medium">shoppingmode</span>,
    "Groceries": <span className="material-symbols-outlined font-medium">local_mall</span>,
    "foods": <span className="material-symbols-outlined font-medium">takeout_dining</span>,
    "Blog": <span className="material-symbols-outlined font-medium">newsmode</span>,
    "Help": <span className="material-symbols-outlined font-medium">support</span>,
    "Sign up | Sign in":<span className="material-symbols-outlined font-medium">account_circle</span>,
    "English":<span className="material-symbols-outlined font-medium">translate</span>
}



function MenuIntem({ children, icon }: { children?: React.ReactNode, icon?: JSX.Element|null}) {
    return (
        <li className='hover:bg-gray-100 px-3 w-full cursor-pointer'>
            <div className='font-medium text-lg border-b-[1px] h-12 px-3 flex justify-start items-center'>
                { icon }
                <span className='ml-2'>{ children }</span>
            </div>
        </li>
    )
}
