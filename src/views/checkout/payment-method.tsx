import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { PaymentForm } from "./payment-form";
import { Trigger } from "../../utils/trigger";
import { CheckoutSummaryListItem } from ".";
import { PaymentCard, PaymentMastercard, PaymentVisa } from "../../components/icons/icon";

export function CreatePaymentMethod() {
    const title = "Payment Methods";
    const subtitle = "Add a payment method"
    return (
        <div>
            <PaymentMethodModal>
                <CheckoutSummaryListItem
                    title={title}
                    subtitle={subtitle}
                    icon={<PaymentCard width={22} height={22}/>}
                />
            </PaymentMethodModal>
        </div>
    )
}

type PaymentMethodModalProps = {
    children: React.ReactNode,
}

function PaymentMethodModal({ children } : PaymentMethodModalProps) {
    const { onOpen, isOpen, onClose } = useDisclosure();
    return (
        <>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal
                size={'lg'}
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
                isCentered
            >
                <ModalOverlay/>
                <ModalContent style={{borderRadius: '16px', position: 'relative'}}>
                    <ModalCloseButton style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%', zIndex: '2'}}/>
                    <ModalBody padding={0} className="grid place-items-center mt-8">
                        <div className="p-6 w-full h-full">
                            <PaymentForm onClose={onClose}/>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export function PaymentMethodList({ data }) {
    return (
        <div className="">
            <h1 className="text-xl font-bold">Select payment method</h1>
            <ul className="w-full py-3">
                {
                    data.map((paymentData, idx) => (
                        <li className="flex items-center justify-start" key={idx}>
                            <DisplayPaymentIcon brand={paymentData.card.brand} />
                            <div className="flex justify-center items-center ml-2 text-[14px]">
                                <span className="capitalize font-semibold">{ paymentData.card.display_brand } </span>
                                <span className="capitalize font-normal"> &nbsp;•••{ paymentData.card.last4 }</span>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export function DisplayPaymentIcon({ brand } : { brand: string }) {
    if (brand === 'mastercard') return <PaymentMastercard className="w-8 h-8" />
    if (brand === 'visa') return <PaymentVisa className="w-8 h-8"/>
    return null;
}