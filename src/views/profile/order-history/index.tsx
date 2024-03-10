import React from "react";
import { ChevronDown } from "../../../components/icons/icon"
import { priceFormat } from "../../../utils/currency"
import clsx from "clsx";

export function OrderHistory() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-semibold">
                Order history
            </h1>
            <div className="w-full mt-8 mb-20">
                <ul className="w-full">
                    <OrderHistoryItem storeName="African BBQ House"/>
                    <OrderHistoryItem storeName="Yko"/>
                    <OrderHistoryItem storeName="Boustan"/>
                </ul>
            </div>
        </div>
    )
}

function OrderHistoryItem({ storeName } : { storeName: string }) {
    const [ isOpen, setIsOpen ] = React.useState(false);
    return (
        <li className="w-5/6 flex flex-col py-4 border-b-[1px] border-gray-400 border-dashed last:border-none">
            <div className="flex justify-between w-full pr-6 items-center cursor-pointer p-2 hover:bg-gray-50" onClick={() => setIsOpen(!isOpen)}>
                <div className="w-1/3">
                    <h1 className="font-bold mb-2">Store</h1>
                    <p>{ storeName }</p>
                </div>
                <div className="w-1/3">
                    <h1 className="font-bold mb-2">Date</h1>
                    <p className="">2024-03-15</p>
                </div>
                <div>
                    <h1 className="font-bold mb-2">Price</h1>
                    <p className="">{priceFormat(36.44)}</p>
                </div>
                <div className={clsx({
                    'rotate-180': isOpen,
                })}>
                    <ChevronDown/>
                </div>
            </div>
            {
                isOpen ?
                    <div className="my-10 flex justify-between items-center">
                        <OrderCard/>
                        <button className="hover:bg-green-800 w-72 h-14 font-bold text-white bg-defaultGreen rounded-lg py-3">View receipt</button>
                    </div>
                    : null
            }
        </li>
    )
}

function OrderCard() {
    return (
        <div className="h-56 min-w-[550px] rounded-xl border-2 border-gray-200 flex px-5 items-center justify-between gap-4">
            <div className="flex flex-col justify-between py-3">
                <div>
                    <p className="text-[14px]">3 articles</p>
                    <h1 className="truncate w-64 text-xl font-bold">African BBQ House</h1>
                    <p>Mar 15</p>
                    <p>Status: <span className="text-defaultGreen font-semibold">Complete</span></p>
                </div>
                <div className="mt-4 font-bold text-3xl">
                    {priceFormat(33.44)}
                </div>
            </div>
            <div className="overflow-hidden w-64 h-44 rounded-xl">
                <img src="https://duyt4h9nfnj50.cloudfront.net/resized/d97fd6350b8779bd06e3f1ed4bdc6e86-w2880-81.jpg" className="object-cover"/>
            </div>
        </div>
    )
}
