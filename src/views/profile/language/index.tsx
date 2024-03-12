import React from "react"
import { VerifiedIcon } from "../../../components/icons/icon"

const LANGUAGE_MAP = {
    'fr': "Français",
    'en': "English",
}

type TLanguage = keyof typeof LANGUAGE_MAP;

export function ProfileLanguage() {
    const [ language, setLanguage ] = React.useState<TLanguage>('en')
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold">
                Personal infos
            </h1>
            <ul className="w-1/2 mt-8">
                {
                    Object.keys(LANGUAGE_MAP).map(key => (
                        <LanguageSelect key={key} name={key as TLanguage} selected={ key == language } onClick={() => setLanguage(key as TLanguage)}/>
                    ))
                }
            </ul>
        </div>
    )
}

function LanguageSelect({ name, selected, onClick } : { name: TLanguage, selected: boolean, onClick: () => void }) {
    return (
        <li className="flex justify-between items-center py-6 border-b-[1px] border-gray-150 w-full cursor-pointer" onClick={onClick}>
            <p className="font-bold">{ LANGUAGE_MAP[name] }</p>
            <div className="flex items-center gap-3 hover:opacity-50">
                { selected ? <VerifiedIcon fill="#099500"/> : null }
            </div>
        </li>
    )
}
