import {
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    forwardRef,
    useDisclosure
} from '@chakra-ui/react'
import { signout, useFirebaseAuth } from '../firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from './icons/icon';
import clsx from 'clsx';

export function ProfileMenu() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const navigate = useNavigate();

    return (
        <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            returnFocusOnClose={false}
            size={'xl'}
        >
            <PopoverTrigger>
                <ProfileMenuButton isOpen={isOpen}/>
            </PopoverTrigger>
            <PopoverContent style={{top: "3px", width: '280px'}}>
                <PopoverArrow/>
                <PopoverCloseButton style={{borderRadius: '50%'}}/>
                <PopoverBody style={{paddingTop: '20px'}}>
                    <ProfileMenuList onClose={onClose}/>
                </PopoverBody>
                <PopoverFooter>
                    <ProfileMenuItem title='Logout' _as='div' onClick={() => {
                        signout();
                        navigate('/');
                    }}/>
                </PopoverFooter>
            </PopoverContent>
        </Popover>        
    )
}

export function ProfileMenuList({ onClose } : { onClose?: () => void}) {
    const navigate = useNavigate();
    
    function handleClick(segment: string) {
        navigate(`/profile/${segment}`);
        onClose?.();
    }

    return (
        <ul className='w-full'>
            <ProfileMenuMainButton onClick={() => handleClick("")}/>
            <ProfileMenuItem title='Language' onClick={() => handleClick('language')}/>
            <ProfileMenuItem title='Orders' onClick={() => handleClick('orders')}/>
        </ul>
    )
}

function getInitial(displayName: string) {
    const [first, last] = displayName.split(' ');
    if (first && last) {
        const result =  first.charAt(0) + last.charAt(0);
        return result;
    }
    return null;
}

function ProfileMenuMainButton({ onClick } : { onClick: () => void }) {
    const user = useFirebaseAuth();
    const displayName = user.data?.displayName;
    const initial = getInitial(displayName || '');
    return (
        <Link to={"/profile"} onClick={onClick}>
            <li className='flex justify-start gap-2 items-center font-medium text-[14px] py-2 hover:bg-gray-100 rounded-lg px-4 w-full cursor-pointer my-1'>
                    <CircleAccount initial={initial}/>
                    <div className='text-[14px]'>
                        <p className='font-bold'>{displayName}</p>
                        <p className='text-defaultGreen'>Manage your account</p>
                    </div>
            </li>
        </Link>
    )
}

export function ProfileMenuItem({ title, _as="li", onClick, ...rest } : { title: string, _as?: HTMLElement['tagName'], onClick?: () => void }) {
    const As = _as as keyof JSX.IntrinsicElements;
    return (
        <As {...rest} onClick={onClick} className='font-medium text-[14px] py-2 hover:bg-gray-100 rounded-lg px-4 w-full cursor-pointer my-1'>{ title }</As>
    )
}

type ProfileMenuButtonProps = {
    isOpen: boolean,
}

export const ProfileMenuButton = forwardRef(({ isOpen, ...rest } : ProfileMenuButtonProps, ref) => {
    const user = useFirebaseAuth();
    const displayName = user.data?.displayName;
    const initial = getInitial(displayName || '');
    return (
        <div ref={ref} {...rest} className="group h-12 py-5 px-1 pr-2 cursor-pointer rounded-3xl w-24 flex justify-between items-center bg-gray-100 border-2 border-white">
            <CircleAccount initial={initial}/>
            <div className={clsx({
                'rotate-180': isOpen
            })}>
                <ChevronDown/>
            </div>
        </div>
    )
})

export function CircleAccount({ initial } : { initial?: string | null }) {
    return (
        <div className="group-hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center border-2 border-gray-300 bg-white font-bold">
            { initial ?
                <p className="text-gray-600 uppercase">{ initial }</p>
                :
                <span className="material-symbols-outlined">
                    person
                </span>
            }
        </div>
    )
}
