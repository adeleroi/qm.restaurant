import React from "react";
import {
    // Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { Trigger } from "../../utils/trigger";
// import clsx from "clsx";
// import { GoogleMap } from "./map-google";
import { MapBoxMap } from "./map-mapbox";
import { Store, StoreSchedule } from "../../views/store-model";
import { ClockIcon, CustomMarker, PhoneIcon } from "../icons/icon";

export function StoreInfoModal({ children, storeInfos } : { children: React.ReactNode, storeInfos: Store }) {
    const { onClose, onOpen, isOpen } = useDisclosure();
    return (
        <React.Fragment>
            <Trigger onOpen={onOpen}>
                { children }
            </Trigger>
            <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
                <ModalOverlay opacity={0.2}/>
                <ModalContent style={{borderRadius: '16px', overflow: 'hidden'}} minH={'50vh'}>
                    <ModalCloseButton
                        style={{backgroundColor: '#d1d5db96', top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%', zIndex: 100}}
                    />
                    <ModalBody style={{padding: 0}}>
                        <div>
                            {/* <h1 className="p-3 py-4 text-2xl font-bold">{storeInfos?.name}</h1> */}
                            <div className="relative w-full h-64 bg-gray-100">
                                {/* <GoogleMap/> */}
                                <MapBoxMap
                                    latitude={storeInfos.location.geolocation?.latitude}
                                    longitude={storeInfos.location.geolocation?.longitude}/>
                            </div>
                            <ul>
                                <li>
                                    <a href={`tel:+1${storeInfos?.phone}`} className="outline-none ring-0">
                                        <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center cursor-pointer">
                                            <PhoneIcon width={20} height={20}/>
                                            <span className="text-lg font-semibold">{storeInfos?.phone}</span>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <Schedule hours={storeInfos.hours}/>
                                </li>
                                <li>
                                    <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center">
                                        <CustomMarker fill="black" width={20} height={20}/>
                                        <span className="text-lg font-semibold">{storeInfos?.location?.address}</span>
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

function paddingWithZero(value: number) {
    const toString = value.toString();
    return toString.length == 1 ? `0${value}` : toString;
}
function getHourFromNumber(value: number) {
    const hour = Math.floor(value / 60);
    let min = (value / 60) - hour;
    min = Math.floor(min * 60);

    return `${paddingWithZero(hour)}h${paddingWithZero(min)}`;
}

function ShowFormattedHour({ startTime, endTime } : { startTime: number, endTime: number }) {
    const start = getHourFromNumber(startTime);
    const end = getHourFromNumber(endTime);
    return (
        <div className="text-[14px] text-gray-500">
            <span>{ start }</span>
            <span> - </span>
            <span>{ end }</span>
        </div>
    )
}

type ShowStoreScheduleProps = {
    hours: Array<StoreSchedule>,
}

function ShowStoreSchedule({ hours } : ShowStoreScheduleProps ) {
    return (
        <ul className="w-full px-20">
            {
                hours?.map(schedule => (
                    <li key={schedule.dayRange} className="py-1 last:mb-4">
                        <p className="font-semibold">{schedule.dayRange}</p>
                        {
                            schedule.sectionHours?.map((hour, idx) => (
                                <ShowFormattedHour key={idx} startTime={hour.startTime} endTime={hour.endTime}/>
                            ))
                        }
                    </li>
                ))
            }
        </ul>
    )
}

type SectionHour = {
    startTime: number,
    endTime: number,
}

type TimeRange = {
    dayRange: string,
    sectionHours: Array<SectionHour>
}

type ScheduleProps = {
    hours: Array<TimeRange>
}

function Schedule({ hours } : ScheduleProps ) {
    const [ isOpen, setIsOpen ] = React.useState(true);
    return (
        <div>
            <div className="px-4 flex gap-8 border-t-[1px] py-4 items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <ClockIcon width={28} height={28}/>
                <div className="w-full flex justify-between">
                    <div className="grid">
                        <span className="text-lg font-semibold">Opening hours </span>
                        {/* <span className="text-[14px] font-semibold text-defaultGreen">Accepts orders until 10:30 PM</span> */}
                    </div>
                    { isOpen ? (
                            <span className="material-symbols-outlined font-black text-2xl">expand_less</span>
                        ) : (
                            <span className="material-symbols-outlined font-black text-2xl">expand_more</span>
                        )
                    }
                </div>
            </div>
            { isOpen ? <ShowStoreSchedule hours={hours}/> : null }
        </div>
    )
}

// function DetailDate() {
//     return (
//         <ul className="px-5 mb-3">
//             {
//                 Array.from({length: 7}, (_, idx) => {
//                     const today = new Date().getDay();
//                     const dayIdx = (today + idx) % 7;
//                     return (
//                         <li key={idx} className={clsx("flex justify-between py-1", {
//                             "font-bold": dayIdx === today,
//                         })}>
//                             <span>{ DAY_MAP[dayIdx] }</span>
//                             <span>{ OPENING_MAP[dayIdx] }</span>
//                         </li>
//                     )
//                 })
//             }
//         </ul>
//     )
// }

// const DAY_MAP = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
// const OPENING_MAP = [ "closed", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30", "11h30 - 23h30" ]
