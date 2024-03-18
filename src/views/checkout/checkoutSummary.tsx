import React from "react";
import { InfoIcon } from "../../components/icons/icon";
import { priceFormat } from "../../utils/currency";
import clsx from "clsx";

export function CheckoutSummary() {
    const defaultTip = 4;
    const [ selectedTip, setSelectedTip ] = React.useState<number>(defaultTip || 3);
    return (
        <section className="h-full w-[450px] rounded-3xl">
            <div className="bg-white rounded-3xl shadow-xl w-full min-h-[70vh] sticky top-40 px-4">
                <div className="w-full flex justify-between items-center pt-6 mb-4">
                    <div className="cursor-pointer group flex items-center relative h-20">
                        <StoreLogoCircle
                            alt="african-bbq-house-logo"
                            src="https://static.wixstatic.com/media/f0ea0e_8a3f9c414c8a4cbd90c27f1483235841~mv2.png"
                        />
                        <p className="hidden group-hover:animate-slide-right duration-300 group-hover:flex text-gray-500 font-semibold">African BBQ</p>
                    </div>
                    <EstimatedDeliveryTimeCircle from={25} to={40}/>
                </div>
                <SubtotalAndFees/>
                <TipSelect tip={selectedTip} onSelect={setSelectedTip} tipList={[3, 4, 6]}/>
                <div className="text-xl flex justify-between items-center p-3">
                    <h1 className="font-bold pl-1">Total </h1>
                    <p className="font-bold">{priceFormat(74.45)}</p>
                </div>
            </div>
        </section>
    )
}

type TipSelectProps = {
    tip: number,
    tipList: Array<number>,
    onSelect: React.Dispatch<React.SetStateAction<number>>,
}

function TipSelect({ tip, onSelect, tipList } : TipSelectProps) {
    const [ showTipInput, setShowTipInput ] = React.useState(false);
    const isOtherTip = !tipList.includes(tip);

    function handleTipSelect(value: number) {
        if (showTipInput) {
            setShowTipInput(false);
        }
        onSelect(value);
    }

    return (
        <div className="p-3 border-b-[2px] border-gray-200">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Add a tip</h1>
                <p>{priceFormat(tip)}</p>
            </div>
            <ul className="py-3 flex gap-3">
                {
                    tipList?.map((value, idx) => (
                        <Tip key={idx} value={value} onSelect={handleTipSelect} isSelected={!showTipInput && tip === value}/>
                        ))
                    }
                    <Tip onSelect={() => setShowTipInput(!showTipInput)} isSelected={showTipInput || isOtherTip}/>
            </ul>
            { showTipInput ? <OtherTip defaultValue={tip} onSelect={handleTipSelect}/> : null }
            <p className="text-gray-500 text-[13px]">100% of the tip goes to your courier.</p>
        </div>
    )
}

const decimalOnly = /^\d*\.?\d*$/;
function OtherTip({ defaultValue, onSelect } : { defaultValue: number, onSelect: (t:number) => void }) {
    const [ value, setValue ] = React.useState<string|number>(defaultValue);
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (decimalOnly.test(e.target.value) || e.target.value === "") {
            setValue(e.target.value);
        }
    }

    return (
        <div className="rounded-3xl border-2 w-72 flex justify-between items-center border-defaultGreen">
            <div className="pl-3 font-semibold text-lg">$</div>
            <input
                autoFocus
                type="text"
                pattern="\d*"
                inputMode="decimal"
                placeholder="0"
                value={value}
                onChange={handleChange}
                className="py-2 px-1 outline-none hover:border-black focus:border-black rounded-l-3xl"/>
            <button
                onClick={() => onSelect(+value)}
                disabled={!value}
                className={clsx("px-2 text-[14px] h-10 w-20 font-bold  rounded-r-3xl", {
                    "cursor-not-allowed bg-gray-300 text-gray-500": !value,
                    "bg-defaultGreen text-white hover:bg-green-800": value,
                })}
            >
                Select
            </button>
        </div>
    )
}

type TipProps = {
    value?: number,
    onSelect: (t:number) => void,
    isSelected: boolean,
}

function Tip({ value, onSelect, isSelected } : TipProps) {
    return (
        <li
            onClick={() => {
                if (value) {
                    onSelect(value)
                } else {
                    onSelect(-999) // to please TS;
                }
            }}
            className={clsx("w-16 py-2 text-center rounded-3xl font-semibold text-[14px] cursor-pointer", {
                "bg-defaultGreen text-white hover:bg-green-800": isSelected,
                "bg-gray-200 text-black hover:bg-gray-100": !isSelected,
            })}>
                { value ? priceFormat(value) : 'Others' }
        </li>
    )
}

function StoreLogoCircle({ src, alt } : { src: string, alt: string }) {
    return (
        <div className="overflow-hidden w-20 h-20 border-[1px] shadow-custom bg-white rounded-full flex justify-center items-center mr-2 px-2">
            { src ? <img className="object-contain w-20 h-20" src={src} alt={alt}/> : null }
        </div>
    )
}

function EstimatedDeliveryTimeCircle({ from, to } : { from: number, to?: number }) {
    return (
        <div className="overflow-hidden w-20 h-20 border-[1px] shadow-custom bg-white rounded-full flex flex-col justify-center items-center px-2 font-bold">
            <div className="flex gap-1">
                <p className="text-md text-black font-bold">{ from }</p>
                {
                    to ? (
                        <>
                            -
                            <p className="text-md text-black font-bold">{ to }</p>
                        </>
                    ) : null
                }
            </div>
            <p className="text-xs font-bold text-gray-500">MIN</p>
        </div>
    )
}

function SubtotalAndFees() {
    return (
        <ul className=" border-b-[2px] border-gray-200 p-3">
            <SubtotalListItem title={"Subtotal"} value={34.54}/>
            <SubtotalListItem title={"Delivery fee"} value={4.29} hasInfo/>
            <SubtotalListItem title={"Fees & Taxes"} value={4.32} hasInfo/>
        </ul>
    )
}

type SubtotalListItemProps = {
    title: string,
    value: number,
    hasInfo?: boolean,
}

function SubtotalListItem({ title, hasInfo=false, value } : SubtotalListItemProps) {
    return (
        <li className="flex w-full justify-between py-2">
            <p className="flex items-center gap-2">
                <span>{ title }</span>
                { hasInfo ? <InfoIcon fill="#099500"/> : null }
            </p>
            <p>{priceFormat(value)}</p>
        </li>
    )
}
