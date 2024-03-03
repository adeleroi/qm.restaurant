import React, { Dispatch, SetStateAction } from "react";
import {
    // Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    // Radio
    Radio,
    RadioGroup,
    CheckboxGroup,
    Checkbox,
} from '@chakra-ui/react'
import { Form, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import { priceFormat } from "../../../utils/currency";
import { Food, FoodOption, FoodOptionList } from "./model.ts";
import clsx from "clsx";

export function FoodModal() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const { food, requiredOptionState } = useLoaderData() as { food: Food, requiredOptionState: Record<string, boolean> };
    const [ requiredOptionsValidity, setRequiredOptionsValidity ] = React.useState<Record<string, boolean>>(requiredOptionState);
    const [ isSubmit, setIsSubmit ] = React.useState(false);
    const submit = useSubmit();

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setIsSubmit(true);
        const invalidFields = Object.keys(requiredOptionsValidity).filter(key  => !requiredOptionsValidity[key]);
        console.log('invalidFields', invalidFields)
        if (!invalidFields.length) {
            submit(e.currentTarget);
        } else {
            document.getElementById(invalidFields[0])?.scrollIntoView({behavior: "smooth", block: 'center'});
        }
    }

    React.useEffect(() => {
        onOpen();
        return() => onClose();
    }, [onOpen, onClose]);

    return (
        <React.Fragment>
            <Modal
                size={'xl'}
                scrollBehavior="inside"
                isCentered
                onClose={() => {
                    navigate(-1);
                    // onClose();
                }}
                isOpen={isOpen}
                >
                <ModalOverlay/>
                <ModalContent className="min-h-[90vh] px-2 pt-10 relative" style={{position: 'relative', borderRadius: 0}}>
                    <ModalBody className="">
                            <div className="overflow-y-auto ">
                                <h1 className="text-black capitalize font-black text-2xl">{ food.name }</h1>
                                <p className="font-black text-gray-500 mt-1 text-xl">{ priceFormat(food.price) }</p>
                                <div>
                                    <Form id="food-customization-form" className="" onSubmit={handleSubmit}>
                                        {
                                            food.customization.map((custom, idx) => {
                                                return (
                                                    <FoodCustomization
                                                        key={idx}
                                                        isInvalid={
                                                            isOptionRequired(custom.minNumOptions) && isSubmit && !requiredOptionsValidity[custom.title]
                                                        }
                                                        isIdle={!isSubmit}
                                                        customization={custom}
                                                        setRequiredOptionsValidity={setRequiredOptionsValidity}
                                                    />
                                                )
                                            })
                                        }
                                        <div className="w-full flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-black text-white font-bold text-xl py-2 rounded-lg w-44 mt-8 mb-4">
                                                    Save
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </React.Fragment>
    )
}

function isOptionRequired(min: number) {
    return min === 0 ? false : true;
}

type RequiredPillProps = {
    children: React.ReactNode,
    isInvalid: boolean,
    isIdle: boolean
}

function RequiredPill({ children, isInvalid, isIdle } : RequiredPillProps) {
    return (
        <React.Fragment>
            <div className="flex gap-1 items-center">
                <div className={clsx(" p-[0.6px] text-[13px] font-semibold gap-1 flex justify-center items-center rounded-3xl", {
                    "bg-gray-200 w-[4.7rem]": !isInvalid && isIdle,
                    "w-[5.8rem] bg-green-100 text-defaultGreen": !isInvalid && !isIdle,
                    "w-[5.8rem] bg-red-100 text-red-600": isInvalid,
                })}>
                    { children }
                    Required
                </div>
            </div>
        </React.Fragment>
    )
}

function RequiredPillIcon({ isInvalid, isIdle } : { isInvalid: boolean, isIdle: boolean }) {
    if (isInvalid) {
        return <span className="material-symbols-outlined font-black text-red-600 text-[16px]">error</span>;
    }
    if (!isInvalid && !isIdle) {
        return <span className="material-symbols-outlined font-black text-[16px]">check_circle</span>;
    }
    return null;
}

function RequiredPillMessage({ min, max } : { min: number, max: number }) {
    if (min === 1) {
        return <span className="text-gray-500 font-semibold text-[14px]">• Select { min }</span>
    }
    if (min > 1) {
        return <span className="text-gray-500 font-semibold text-[14px]">• Select between { min } and { max }</span>
    }   
}

type RequiredInstructionProps = {
    min: number,
    max: number,
    // quantity: number,
    isInvalid: boolean,
    isIdle: boolean,
}

function RequiredInstruction({ min, max, isInvalid, isIdle } : RequiredInstructionProps) {
    return (
        <div className="flex gap-1 items-center mt-1">
            <RequiredPill isIdle={isIdle} isInvalid={isInvalid}>
                <RequiredPillIcon isIdle={isIdle} isInvalid={isInvalid}/>
            </RequiredPill>
            <RequiredPillMessage min={min} max={max}/>
        </div>
    )
}

function OptionalInstruction({ quantity } : { quantity: number }) {
    return (
        <span className="text-gray-500 font-semibold text-[14px]">
            (Optional) • Select up to {quantity}
        </span>
    )
}

type FoodCustomizationProps = {
    customization: FoodOptionList,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    isInvalid: boolean,
    isIdle: boolean,
};

export function FoodCustomization({ customization, setRequiredOptionsValidity, isInvalid, isIdle } : FoodCustomizationProps) {
    const isCustomizationRequired = isOptionRequired(customization.minNumOptions);
    return (
        <section>
            <div className="mt-8 py-2">
                    <div className="mb-4">
                        <h1 className="font-black text-lg capitalize">{ customization.title }</h1>
                        <FoodCustomizationInstruction
                            isIdle={isIdle}
                            isInvalid={isInvalid}
                            isRequired={isCustomizationRequired}
                            quantity={customization.options.length}
                            min={customization.minNumOptions}
                            max={customization.maxNumOptions}
                        />
                    </div>
                    <div className="w-full">
                        {
                            isCustomizationRequired ?
                                <RequiredFoodCustomizationSelect
                                    min={customization.minNumOptions}
                                    max={customization.maxNumOptions}
                                    options={customization.options}
                                    title={customization.title}
                                    setRequiredOptionsValidity={setRequiredOptionsValidity}
                                    />
                                    : <OptionalFoodCustomizationSelect
                                        options={customization.options}
                                        title={customization.title}
                                        min={customization.minNumOptions}
                                        max={customization.maxNumOptions}
                                        setRequiredOptionsValidity={setRequiredOptionsValidity}
                                />
                        }
                    </div>
            </div>
        </section>
    )
}

type FoodCustomizationSelectProps = {
    min: number,
    max: number,
    options: Array<FoodOption>,
    title: string,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
}

function RequiredFoodCustomizationSelect({ min, options, title, max, setRequiredOptionsValidity } : FoodCustomizationSelectProps) {
    if (min == 1) {
        return (
            <CustomizationRadioGroup
                options={options}
                title={title}
                setRequiredOptionsValidity={setRequiredOptionsValidity}
            />
        )
    }
    if (min > 1) {
        return (
            <CustomizationCheckBoxGroup
                options={options}
                title={title}
                min={min}
                max={max}
                setRequiredOptionsValidity={setRequiredOptionsValidity}/>
        )
    }
}

function OptionalFoodCustomizationSelect({ options, title, min, max, setRequiredOptionsValidity } : FoodCustomizationSelectProps) {
    return (
        <CustomizationCheckBoxGroup
            options={options}
            title={title}
            min={min}
            max={max}
            setRequiredOptionsValidity={setRequiredOptionsValidity} />
    )
}

type FoodCustomizationInstructionProps = {
    quantity: number,
    isRequired: boolean,
    min: number,
    max: number,
    isInvalid: boolean,
    isIdle: boolean,
}

function FoodCustomizationInstruction({ isRequired, min, max, isInvalid, isIdle, quantity } : FoodCustomizationInstructionProps) {
    return (
        <React.Fragment>
            {
                isRequired ?
                    <RequiredInstruction isInvalid={isInvalid} isIdle={isIdle} min={min} max={max}/>
                    : <OptionalInstruction quantity={quantity}/>
            }
        </React.Fragment>
    )
}

type CustomizationCheckBoxGroupProps = {
    options: Array<FoodOption>,
    title: string,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    min: number,
    max: number,
}

function CustomizationCheckBoxGroup({ options, title, setRequiredOptionsValidity, min, max } : CustomizationCheckBoxGroupProps) {
    const [ checkedCount, setCheckedCount ] = React.useState<number>(0);
    console.log(title, checkedCount);

    function handleChange(value: boolean) {
        let newCount = 0;
        if (value) {
            newCount = checkedCount + 1;
            setCheckedCount(newCount);
        } else {
            newCount = checkedCount - 1;
            setCheckedCount(newCount)
        }

        if (newCount >= min && newCount <= max) {
            setRequiredOptionsValidity(option => ({ ...option, [title]: true }));
        } else {
            setRequiredOptionsValidity(option => ({ ...option, [title]: false }));
        }
    }

    return (
        <CheckboxGroup colorScheme="green">
            {
                options?.map(({ name, price }: FoodOption, idx) => (
                    <div className="py-3 pl-3 border-b-[1px] cursor-pointer" key={idx}>
                        <Checkbox form="food-customization-form" name={title} size={'lg'} value={name}  onChange={(e) => handleChange(e.target.checked)}>
                            <div className="grid pl-2">
                                <span className="font-semibold text-[14px] capitalize">{ name }</span>
                                <span className="font-bold text-[14px] text-gray-500">{ price ? priceFormat(price) : null }</span>
                            </div>
                        </Checkbox>
                    </div>
                ))
            }
        </CheckboxGroup>
    )
}

type CustomizationRadioGroupProps = {
    options: Array<FoodOption>,
    title: string,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
}

function CustomizationRadioGroup({ options, title, setRequiredOptionsValidity } : CustomizationRadioGroupProps) {
    const [ value, setValue ] = React.useState<string | undefined>(undefined);

    function handleChange(value: string) {
        console.log('value', value);
        setValue(value);
        setRequiredOptionsValidity(option => ({ ...option, [title]: true }));
    }

    return (
        <RadioGroup className="grid" defaultValue="1" name={ title } onChange={handleChange} value={value} id={title}>
            {
                options?.map(({name, price}: FoodOption, idx) => (
                    <div className="py-3 pl-3 border-b-[1px]" key={idx}>
                        <Radio form="food-customization-form" name={title} size={'lg'} value={ name } colorScheme="green">
                            <div className="grid pl-2">
                                <span className="font-semibold text-[14px] capitalize">{ name }</span>
                                <span className="font-bold text-[14px] text-gray-500">{ price ? priceFormat(price) : null }</span>
                            </div>
                        </Radio>
                    </div>
                ))
            }
        </RadioGroup>
    )
}
