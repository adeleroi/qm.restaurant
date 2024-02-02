import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
} from '@chakra-ui/react'

import { Trigger } from '../utils/trigger';
import { useFetcher, useFetchers } from 'react-router-dom';

export function CartTrigger({ triggerElement }: { triggerElement: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    return (
        <>
        <Trigger onOpen={onOpen}>
            { triggerElement }
        </Trigger>
        <Drawer
            size={'sm'}
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent className=''>
            <DrawerCloseButton className='left-5' style={{top: '20px'}} />    
            <DrawerBody className='mt-16' style={{paddingLeft: 0, paddingRight: 0}}>
            </DrawerBody>
            </DrawerContent>
        </Drawer>
        </>
    )
}

export function CartIcon({count = 3}: {count?: number}) {
    const fetchers = useFetchers();
    console.log('fetchers', fetchers)
    const f = fetchers.map(fe => +fe.data).reduce((acc, curr) => acc + curr, count);

    const emptyCartIcon = (
        <span className="material-symbols-outlined text-defaultGreen">
            shopping_cart
        </span>
    );

    const cartIcon = (
        <>
            <span className="material-symbols-outlined text-defaultGreen">
                remove_shopping_cart
            </span>
            <Ping/>
        </>
    );
    return (
        <div className="flex justify-between">
            {count > 0 ? cartIcon : emptyCartIcon}
            <span className="font-semibold text-defaultGreen">. {f} </span>
        </div>
    )
}

function Ping() {
    return (
        <div className="absolute top-0 right-0">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-defaultGreen opacity-65"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-defaultGreen"></span>
            </span>
        </div>
    )
}
