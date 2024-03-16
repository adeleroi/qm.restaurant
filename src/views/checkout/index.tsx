import { InfoIcon } from "../../components/icons/icon";
import { MapBoxMap } from "../../components/store-info/map-mapbox";
import { priceFormat } from "../../utils/currency";

export function CheckoutView() {
    return (
        <div className="w-full">
            <div className="w-full h-80 relative">
                <MapBoxMap/>
                <div className="absolute inset-0 bg-map-overlay"></div>
            </div>
            <div className="bg-gray-100 h-screen w-full items-center gap-16 p-16 relative">
                <div className="flex justify-center h-full gap-6 max-w-8xl w-full">
                    <section className="bg-white h-full rounded-xl w-1/2"></section>
                    <section className="h-full w-[500px] rounded-xl">
                        <div className="bg-white rounded-xl shadow-xl w-full h-[70vh] sticky top-40 px-4">
                            <div className="w-full flex justify-between">
                                <div className="cursor-pointer group mt-6 flex items-center relative h-20">
                                    <div className="overflow-hidden w-20 h-20 border-[1px] shadow-custom bg-white rounded-full flex justify-center items-center mr-2 mb-4 px-2">
                                        <img className="object-contain w-20 h-20" src="https://static.wixstatic.com/media/f0ea0e_8a3f9c414c8a4cbd90c27f1483235841~mv2.png" alt="lcbo-logo"/>
                                    </div>
                                    <p className="hidden group-hover:animate-slide-right duration-300 group-hover:flex text-gray-500 font-semibold">African BBQ</p>
                                </div>
                                <div className="pt-6">
                                    <div className="overflow-hidden w-20 h-20 border-[1px] shadow-custom bg-white rounded-full flex flex-col justify-center items-center mr-2 mb-4 px-2 font-bold">
                                        <p className="text-xl text-black font-bold">30</p>
                                        <p className="text-xs text-gray-500 font-normal">MIN</p>
                                    </div>
                                </div>
                            </div>
                            {/* <h1 className="text-2xl font-bold pl-1 mt-2">Total </h1> */}
                            <ul className=" border-b-[2px] border-gray-200 p-3">
                                <li className="flex w-full justify-between  py-2">
                                    <p>Subtotal</p>
                                    <p>19.44</p>
                                </li>
                                <li className="flex w-full justify-between py-2">
                                    <p className="flex items-center gap-2">
                                        <span>Delivery fee</span>
                                        <InfoIcon fill="#099500"/>
                                    </p>
                                    <p>19.44</p>
                                </li>
                                <li className="flex w-full justify-between py-2">
                                    <p className="flex items-center gap-2">
                                        <span>Fees & Taxes</span>
                                        <InfoIcon fill="#099500"/>
                                    </p>
                                    <p>19.44</p>
                                </li>
                            </ul>
                            <div className="p-3 border-b-[2px] border-gray-200 ">
                                <h1 className="text-lg font-bold pt-3">Tip</h1>
                                <ul className="py-3 flex gap-3">
                                    <li className="w-16 py-2 text-center rounded-3xl bg-gray-200 font-semibold text-[14px]">{priceFormat(2)}</li>
                                    <li className="w-16 py-2 text-center rounded-3xl bg-defaultGreen text-white font-semibold text-[14px]">{priceFormat(4)}</li>
                                    <li className="w-16 py-2 text-center rounded-3xl bg-gray-200 font-semibold text-[14px]">{priceFormat(6)}</li>
                                    <li className="w-16 py-2 text-center rounded-3xl bg-gray-200 font-semibold text-[14px]">Others</li>
                                </ul>
                                <p className="text-gray-500 text-[13px]">100% of the tip goes to your courier.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
