import React from "react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { ChevronForward } from "../../../components/icons/icon"
import { Trigger } from "../../../utils/trigger";
import { useFetcher } from "react-router-dom";
import 'intl-tel-input/build/css/intlTelInput.css';
import intlTelInput from 'intl-tel-input';

export function PersonalInfo() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold">
                Personal infos
            </h1>
            <div className="w-full mt-8">
                <ul className="w-1/2">
                    <EditableInfo
                        trigger={
                            <InfoListItem title="Name" value="Adé Ange-Wilfried N'guessan"/>
                        }
                        infoType="name"
                    >
                    </EditableInfo>
                    <EditableInfo
                        trigger={
                            <InfoListItem title="Email" value="wilfriednguess@gmail.com"/>
                        }
                        infoType="email"
                    >
                    </EditableInfo>
                    <EditableInfo
                        trigger={
                            <InfoListItem title="Phone number" value="581-777-7338"/>
                        }
                        infoType="phoneNumber"
                    >
                    </EditableInfo>
                </ul>
            </div>
        </div>
    )
}

function InfoListItem({ title, value, onClick } : { title: string, value: string, onClick?: () => void }) {
    return (
        <li className="flex justify-between items-center py-6 border-b-[1px] border-gray-150 w-full">
            <p className="font-bold">{title}</p>
            <div className="flex items-center gap-3 hover:opacity-50"  onClick={onClick}>
                <p className="font-normal cursor-pointer">{value}</p>
                <div className="rotate-">
                    <ChevronForward height={16} width={16}/>
                </div>
            </div>
        </li>
    )
}

type EditableInfoProps = {
    infoType: 'email' | 'name' | 'phoneNumber',
    trigger: React.ReactNode
}

function EditableInfo({ infoType, trigger } : EditableInfoProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <div>
            <Trigger onOpen={onOpen}>
                { trigger }
            </Trigger>
            <Modal
                isCentered
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay/>
                <ModalContent borderRadius={"16px"}>
                    <ModalCloseButton style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}}/>
                    <ModalBody padding={"0px"}>
                        <div className="min-h-96 px-4 flex flex-col justify-end pb-4">
                            {
                                infoType == 'email' ?
                                <EditEmail onClose={onClose}/> : infoType === 'name' ?
                                <EditName onClose={onClose}/> :
                                <EditPhoneNumber onClose={onClose}/>
                            }
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

function EditName({ onClose } : { onClose: () => void }) {
    const fetcher = useFetcher();
    const firsName = 'Adé Ange-wilfried';
    const lastName = "N'guessan";
    return (
        <div className="w-full">
            <h1 className="font-bold text-3xl mb-4">Name</h1>
            <fetcher.Form className="w-full">
                <fieldset className="mb-2">
                    <input
                        defaultValue={firsName}
                        autoFocus
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        className="bg-white hover:border-black border-2 focus:border-black w-full rounded-lg py-3 px-2 outline-none"/>
                </fieldset>
                <fieldset className="mb-2">
                    <input
                        defaultValue={lastName}
                        type="text"
                        placeholder="Last name"
                        name="lastName"
                        className="bg-white hover:border-black border-2 focus:border-black w-full rounded-lg py-3 px-2 outline-none"/>
                </fieldset>
                <input type="hidden" value="edit-name"/>
                <div className="flex gap-2 justify-between">
                    <button
                        onClick={() => onClose()}
                        className="bg-green-100 w-1/2 hover:bg-green-200 text-defaultGreen h-14 rounded-lg font-bold mt-4"
                        type="button">
                            Cancel
                    </button>
                    <button className="bg-defaultGreen w-1/2 hover:bg-green-800 text-white h-14 rounded-lg font-bold mt-4" type="submit">Save</button>
                </div>
            </fetcher.Form>
        </div>
    )
}

function EditEmail({ onClose } : { onClose: () => void }) {
    const fetcher = useFetcher();
    const email = "wilfriednguess@gmail.com"
    return (
        <div className="w-full">
            <h1 className="font-bold text-3xl mb-4">Email</h1>
            <fetcher.Form className="w-full">
                <fieldset className="mb-2">
                    <input
                        defaultValue={email}
                        autoFocus
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="bg-white hover:border-black border-2 focus:border-black w-full rounded-lg py-3 px-2 outline-none"/>
                </fieldset>
                <input type="hidden" value="edit-email"/>
                <div className="flex gap-2 justify-between">
                    <button
                        onClick={() => onClose()}
                        className="bg-green-100 w-1/2 hover:bg-green-200 text-defaultGreen h-14 rounded-lg font-bold mt-4"
                        type="button">
                            Cancel
                    </button>
                    <button className="bg-defaultGreen w-1/2 hover:bg-green-800 text-white h-14 rounded-lg font-bold mt-4" type="submit">Save</button>
                </div>
            </fetcher.Form>
        </div>
    )
}

const errorMap = [
    "Invalid number",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
  ];

function EditPhoneNumber({ onClose } : { onClose: () => void }) {
    const fetcher = useFetcher();
    const phoneNumber = "5817774338";
    const [hasSubmitted, setHasSubmitted] = React.useState(false);

    function handleSubmit() {
        setHasSubmitted(true);
    }
    return (
        <div className="w-full">
            <h1 className="font-bold text-3xl mb-4">Phone Number</h1>
            <fetcher.Form className="w-full">
                <fieldset className="mb-2">
                    <IntlTelInput hasSubmitted={hasSubmitted} inputName="phoneNumber" phoneNumber={phoneNumber}/>
                </fieldset>
                <input type="hidden" value="edit-phoneNumber"/>
                <div className="flex gap-2 justify-between">
                    <button
                        onClick={() => onClose()}
                        className="bg-green-100 w-1/2 hover:bg-green-200 text-defaultGreen h-14 rounded-lg font-bold mt-4"
                        type="button">
                            Cancel
                    </button>
                    <button className="bg-defaultGreen w-1/2 hover:bg-green-800 text-white h-14 rounded-lg font-bold mt-4" onClick={handleSubmit}>Save</button>
                </div>
            </fetcher.Form>
        </div>
    )
}

type intlTelInputProps = {
    phoneNumber?: string,
    hasSubmitted?: boolean,
    inputName?: string,
}

function IntlTelInput({ phoneNumber, hasSubmitted, inputName } : intlTelInputProps) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const itiRef = React.useRef<intlTelInput.Plugin| null>(null);
    const [ errorMessage, setErrorMessage ] = React.useState<string>("");

    function handleUpdate() {
        const iti = itiRef.current;
        if (iti) {
            if (!iti.isValidNumber()) {
                const errorCode = iti.getValidationError();
                setErrorMessage(errorMap[errorCode]);
            } else {
                console.log(iti.getValidationError())
                setErrorMessage("");
            }
        }   
    }
    
    React.useEffect(() => {
        const inputRefCurrent = inputRef.current;
        itiRef.current = intlTelInput(inputRefCurrent as HTMLInputElement, {
            initialCountry: "ca",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js", // use cdn or download and import the script from github
        });
        inputRefCurrent?.addEventListener?.("countrychange", handleUpdate);
        inputRefCurrent?.focus();
        return () => {
            inputRefCurrent?.removeEventListener("countrychange", handleUpdate);
            itiRef?.current?.destroy();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div>
            <input
                autoFocus
                type="tel"
                name={inputName}
                ref={inputRef}
                onInput={handleUpdate}
                defaultValue={phoneNumber}
                className="bg-white hover:border-black border-2 focus:border-black w-full rounded-lg py-3 px-2 outline-none"
            />
            { hasSubmitted && errorMessage ? <span className="text-[14px] text-red-500 font-bold">{ errorMessage }</span> : null }
        </div>
    );
}
