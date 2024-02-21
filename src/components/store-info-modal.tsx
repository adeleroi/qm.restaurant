import React from "react";
import {
    // Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
  } from '@chakra-ui/react'
import { Trigger } from "../utils/trigger";
import { Store } from "../views/feed";
import { PositionLogo } from "./search";
import clsx from "clsx";

export function StoreInfoModal({ children, storeInfos } : { children: React.ReactNode, storeInfos: Store }) {
    const { onClose, onOpen, isOpen } = useDisclosure();

    return (
        <React.Fragment>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal isOpen={isOpen} onClose={onClose}  scrollBehavior="inside" isCentered>
                <ModalOverlay/>
                <ModalContent style={{borderRadius: 0}}>
                    <ModalBody style={{padding: 0}}>
                        <div>
                            <h1 className="p-3 py-4 text-2xl font-bold">{storeInfos?.name}</h1>
                            <div className="w-full h-56 bg-gray-100"></div>
                            <ul className="">
                                <li>
                                    <a href={`tel:+1${storeInfos?.phoneNumber}`} className="outline-none ring-0">
                                        <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center cursor-pointer">
                                            <span className="material-symbols-outlined font-black text-3xl">call</span>
                                            <span className="text-lg font-bold">{storeInfos?.phoneNumber}</span>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <Schedule/>
                                </li>
                                <li>
                                    <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center">
                                        <PositionLogo className="text-2xl"/>
                                        <span className="text-lg font-bold">{storeInfos?.location?.address}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </React.Fragment>
    )
}

function Schedule() {
    const [ isOpen, setIsOpen ] = React.useState(false);
    return (
        <div>
            <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <span className="material-symbols-outlined font-black text-3xl">schedule</span>
                <div className="w-full flex justify-between">
                    <div className="grid">
                        <span className="text-lg font-bold">Opening hours </span>
                        <span className="text-[16px] font-semibold text-defaultGreen">Accepts orders until 10:30 PM</span>
                    </div>
                    { isOpen ? (
                            <span className="material-symbols-outlined font-black text-2xl">expand_less</span>
                        ) : (
                            <span className="material-symbols-outlined font-black text-2xl">expand_more</span>
                        )
                    }
                </div>
            </div>

            {
                isOpen ? (
                    <ul className="px-5 mb-3">
                        {
                            Array.from({length: 7}, (_, idx) => {
                                const today = new Date().getDay();
                                const dayIdx = (today + idx) % 7;
                                console.log(idx);
                                return (
                                    <li className={clsx("flex justify-between py-1", {
                                        "font-bold": dayIdx === today,
                                    })}>
                                        <span>{ DAY_MAP[dayIdx] }</span>
                                        <span>{ OPENING_MAP[dayIdx] }</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                ): null
            }
        </div>
    )
}

const DAY_MAP = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
const OPENING_MAP = [ "closed", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30" ]
