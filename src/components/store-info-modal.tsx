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

export function StoreInfoModal({ children, storeInfos } : { children: React.ReactNode, storeInfos: Store }) {
    const { onClose, onOpen, isOpen } = useDisclosure();

    return (
        <React.Fragment>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent style={{borderRadius: 0}}>
                    <ModalBody style={{padding: 0}}>
                        <div>
                            <h1 className="pl-3 text-3xl font-bold py-2">{storeInfos?.name}</h1>
                            <div className="w-full h-56 bg-gray-100"></div>
                            <ul className="">
                                <li>
                                    <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center">
                                        <span className="material-symbols-outlined font-black text-3xl">call</span>
                                        <span className="text-lg font-bold">{storeInfos?.phoneNumber}</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center">
                                        <PositionLogo className="text-2xl"/>
                                        <span className="text-lg font-bold">{storeInfos?.location?.address}</span>
                                    </div>
                                </li>
                                <li>
                                    <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center cursor-pointer">
                                        <span className="material-symbols-outlined font-black text-3xl">schedule</span>
                                        <div className="w-full flex justify-between">
                                            <span className="text-lg font-bold">Opening hours </span>
                                            <span className="material-symbols-outlined font-black text-2xl">expand_more</span>
                                        </div>
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
