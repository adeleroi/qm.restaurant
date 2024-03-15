import React from "react";
import { ChevronDown, PaymentMastercard, PaymentVisa } from "../../../components/icons/icon"
import { priceFormat } from "../../../utils/currency"
import clsx from "clsx";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Trigger } from "../../../utils/trigger";

export function OrderHistory() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold">
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
                    </div>
                    : null
            }
        </li>
    )
}

function OrderCard() {
    return (
        <div className="min-h-64 min-w-[550px] rounded-xl border-2 border-gray-200 flex px-5 items-startjustify-between gap-4">
            <div className="flex flex-col justify-between py-6">
                <div>
                    <h1 className="truncate w-64 text-xl font-bold">African BBQ House</h1>
                    <p className="text-[14px]">Mar-15-2024</p>
                    <p className="text-[14px]">Status: <span className="text-defaultGreen font-semibold">Complete</span></p>
                </div>
                <OrderSummary />
                <div className="mt-4 font-bold text-3xl w-72 flex gap-2">
                    <p>Total:</p>
                    <p>{priceFormat(73.44)}</p>
                </div>
                <ReceiptModal>
                    <button className="mt-8 hover:bg-green-800 w-72 h-14 font-bold text-white bg-defaultGreen rounded-lg py-3">View receipt</button>
                </ReceiptModal>
            </div>
            <div className="overflow-hidden w-64 h-48 rounded-xl mt-8">
                <img src="https://duyt4h9nfnj50.cloudfront.net/resized/d97fd6350b8779bd06e3f1ed4bdc6e86-w2880-81.jpg" className="object-cover"/>
            </div>
        </div>
    )
}

function OrderSummary() {
    return (
        <div className="mb-2 mt-3">
            <h2 className="font-bold">5 articles</h2>
            <OrderList orderList={["Egoussi soup", "Garba", "Poulet DG", "Mafé", "Foutou"]} showPrice={false} showExtra={false}/>
        </div>
    )
}

type OrderListItemProps = {
    showPrice?: boolean,
    name: string,
    quantity?: number,
    showExtra?: boolean,
}

function OrderListItem({ showPrice=true, showExtra=false, name, quantity=1 } : OrderListItemProps) {
    return (
        <li className="text-lg w-full my-3">
            <FoodInfo name={name} showPrice={showPrice} quantity={quantity}/>
            {
                showExtra ?
                    <div className="ml-8">
                        <h1 className="text-[16px]">Extra: </h1>
                        <ul className="">
                            <li>
                                <FoodInfo name="Plantain" quantity={quantity} showPrice={false} isExtra/>
                            </li>
                            <li>
                                <FoodInfo name="Pepper powder" quantity={quantity} showPrice={false} isExtra/>
                            </li>
                            <li>
                                <FoodInfo name="Sweet potatoes" quantity={quantity} showPrice={false} isExtra/>
                            </li>
                        </ul>
                    </div> :
                null
            }
        </li>
    )
}

type FoodInfoProps = {
    name: string,
    showPrice?: boolean,
    quantity?: number,
    isExtra?: boolean,
}

function FoodInfo({ name, showPrice=true, quantity=1, isExtra=false } : FoodInfoProps) {
    return (
        <div className={clsx("flex w-full justify-between", {
            "font-medium": !isExtra,
            "text-gray-500 text-[15px]": isExtra,
        })}>
            <div className="flex items-center">
                <div className={clsx("", {
                    "border-[1px] border-gray-400 my-1 mr-2 h-6 w-6 bg-gray-100 flex items-center justify-center text-black": !isExtra,
                    "mr-1": isExtra,
                })}>{quantity}</div>
                <span>{name}</span>
            </div>
            { showPrice ? <span>{priceFormat(19.99)}</span> : null }
        </div>
    )
}

function ReceiptModal({ children } : { children: React.ReactNode }) {
    const { onOpen, isOpen, onClose } = useDisclosure();
    return (
        <>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal
                size={"xl"}
                isCentered
                scrollBehavior="outside"
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay/>
                <ModalContent borderRadius={'16px'} minHeight={'95vh'}>
                    <ModalCloseButton style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}}/>
                    <ModalBody padding={'0px'} overflow={"scroll"}>
                        <div className="px-5 my-20">
                            <Receipt/>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

function Receipt() {
    return (
        <div>
            <section className="mt-4 font-bold text-3xl w-full flex gap-2 justify-between pb-3">
                <p>Total:</p>
                <p>{priceFormat(73.44)}</p>
            </section>
            <section className="py-3 border-t-[1px] border-gray-300">
                <OrderList orderList={["Egoussi soup", "Garba", "Poulet DG", "Mafé", "Foutou"]} seeAll showExtra showPrice/>
            </section>
            <section className="py-3 border-t-[1px] border-gray-300">
                <ReceiptSubTotal/>
            </section>
            <section className="py-3 border-t-[1px] border-gray-300">
                <ReceiptPaymentMethod/>
            </section>
        </div>
    )
}

type OrderListProps = {
    orderList: Array<string>,
    sliceLength?: number,
    seeAll?: boolean,
    showExtra?: boolean,
    showPrice?: boolean,
}

function OrderList({ orderList, sliceLength = 2, seeAll=false, showExtra=false, showPrice=false } : OrderListProps) {
    const [ seeMore, setSeeMore ] = React.useState(false);
    const slice = seeMore || seeAll ? orderList.length : sliceLength
    return (
        <ul className="my-1 w-full">
            {
                orderList.slice(0, slice).map((order, idx) => (
                    <OrderListItem key={idx} name={order} showPrice={showPrice} showExtra={showExtra}/>
                ))
            }
            {
                !seeAll ?
                    <p onClick={() => setSeeMore(!seeMore)} className="text-gray-800 underline underline-offset-4 cursor-pointer hover:text-gray-500 text-[14px]">
                        {!seeMore ? "See more" : "See less" }
                    </p>
                : null
            }
        </ul>
    )
}

function ReceiptSubTotal() {
    return (
        <ul>
            <SubTotalItem title="Service fee" value={4.20}/>
            <SubTotalItem title="Delivery fee" value={6.20}/>
            <SubTotalItem title="Taxes" value={5.76}/>
            <SubTotalItem title="Tips" value={3.20}/>
        </ul>
    )
}

function SubTotalItem({ title, value } : { title: string, value: number }) {
    return (
        <li className="w-full flex justify-between items-center mb-3 text-lg font-medium my-1">
            <div className="flex gap-3 items-center">
                <p className="">{ title }</p>
            </div>
            <p className="">{priceFormat(value)}</p>
        </li>
    )
}

function ReceiptPaymentMethod() {
    return (
        <ul className="my-1 w-full">
            <PaymentMethodItem
                cardIcon={<PaymentMastercard className="w-9 h-9"/>}
                cardType="Mastercard"
                date={'10/11/2022 21:04'}
                value={14.44}/>
            <PaymentMethodItem
                cardIcon={<PaymentVisa className="w-9 h-9"/>}
                cardType="Visa"
                date={'10/11/2022 21:04'}
                value={14.44}/>
        </ul>
    )
}

type PaymentMethodItemProps = {
    date: string,
    value: number,
    cardType: string,
    cardIcon: React.ReactNode,
}

function PaymentMethodItem({ date, value, cardType, cardIcon } : PaymentMethodItemProps) {
    return (
        <li className="w-full flex justify-between items-center mb-3 text-lg">
            <div className="flex gap-3 items-center">
                { cardIcon }
                <div>
                    <p className="font-semibold">{cardType} ••••531</p>
                    <p className=" text-gray-500  text-[15px]">{date}</p>
                </div>
            </div>
            <p className="font-semibold">{priceFormat(value)}</p>
        </li>
    )
}
