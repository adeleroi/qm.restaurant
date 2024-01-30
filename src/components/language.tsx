import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';

type Language = 'fr' | 'en';

export function LanguageSelect({triggerElement}: {triggerElement: React.ReactNode}) {
    const language = getCurrentLanguage();
    return (
        <Popover isLazy placement='top'>
            <PopoverTrigger>
                {triggerElement}
            </PopoverTrigger>
            <PopoverContent w={48} style={{outline: 'none'}}>
                <PopoverArrow />
                <PopoverBody>
                    <ul className='h-16 py-1 text-sm flex flex-col justify-between outline-none'>
                        <li className='cursor-pointer flex justify-between items-center'>
                            <Link to='/' reloadDocument>
                                <span>English</span>
                            </Link>
                            { language === 'en' ? <CheckIcon/> : null }
                        </li>
                        <li className='cursor-pointer flex justify-between items-center'>
                            <Link to='/' reloadDocument>
                                <span>Français</span>
                            </Link>
                            { language === 'fr' ? <CheckIcon/> : null }
                        </li>
                    </ul>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

function CheckIcon() {
    return (
        <span className="material-symbols-outlined text-[1.3rem]">done</span>
    )
}

function getCurrentLanguage(): Language {
    return 'en';
}
