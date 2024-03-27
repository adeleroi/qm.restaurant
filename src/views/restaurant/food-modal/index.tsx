import React, { Dispatch, LegacyRef, SetStateAction } from "react";
import {
    // Modal
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    // Radio
    Radio,
    RadioGroup,
    CheckboxGroup,
    Checkbox,
    Spinner,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Form, useFetcher, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import { priceFormat } from "../../../utils/currency";
import clsx from "clsx";
import { ButtonIncrement } from "../../store-front/index.tsx";
import { Article, Customization, CustomizationOption } from "../../article-model.ts";
import { CheckedIcon, ErrorIcon } from "../../../components/icons/icon.tsx";

interface IntersectionObserverOption {
    root: HTMLElement|null,
    rootMargin?: HTMLElement['style']['margin'],
    threshold: Array<number>, // number mjust be less than or equal to 1,
}

const SHOW_HEADER_STYLE = 'will-change-auto h-20 opacity-100 flex flex-col justify-center items-start animate-open-header shadow-xl absolute flex z-50 w-full top-0 left-0 px-4 bg-white';
const HIDE_HEADER_STYLE = 'will-change-auto h-0 opacity-0 flex flex-col justify-center items-start transition-opacity animate-close-header shadow-xl absolute z-50 w-full top-0 left-0 px-4 bg-white';


function useIntersectionObserverEffect(
    targetRef:  React.MutableRefObject<HTMLElement | null>,
    callBack: IntersectionObserverCallback,
    options: IntersectionObserverOption,
) {
    React.useEffect(() => {
        const target = targetRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(callBack, options)
        observer.observe(target);
        return () => { target && observer.unobserve(target) };
    });
}

export function FoodModal() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const { food, requiredOptionState } = useLoaderData() as { food: Article, requiredOptionState: Record<string, boolean> };
    const navigate = useNavigate();

    React.useEffect(() => {
        onOpen();
        return() => onClose();
    }, [onOpen, onClose]);

    const headerRef = React.useRef<HTMLElement|null>(null);
    const intersectionTargetRef = React.useRef<HTMLElement|null>(null);
    const rootTargetRef = React.useRef<HTMLElement | null>(null);

    const callback = React.useCallback((entries: Array<IntersectionObserverEntry>) => {
        if (headerRef.current) {
            const entry = entries[0];
            if (entry.isIntersecting) {
                if (entry.intersectionRatio < 0.9) {
                    headerRef.current.className = SHOW_HEADER_STYLE;
                } else {
                    headerRef.current.className = HIDE_HEADER_STYLE;
                }
            }
        }
    }, [])

    useIntersectionObserverEffect(
        intersectionTargetRef,
        callback,
        {root: rootTargetRef?.current, threshold: [0.9, 0.7, 0.3, 0]}
    )

    return (
        <React.Fragment>
            <Modal
                size={'lg'}
                scrollBehavior="inside"
                isCentered
                onClose={() => {
                    navigate(-1);
                    // onClose();
                }}
                isOpen={isOpen}
                >
                <ModalOverlay/>
                <ModalContent className="min-h-[60vh] px-2 pt-10 relative" style={{position: 'relative', borderRadius: '16px', overflow: 'hidden'}} ref={rootTargetRef}>
                    <ModalCloseButton
                        style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%', zIndex: 100}}
                    />
                    <ModalBody className="">
                        <div ref={headerRef as LegacyRef<HTMLDivElement> | undefined} className="hidden">
                            <h1 className="capitalize font-black text-xl">{ food.name }</h1>
                            <p className="font-black text-gray-500 mt-1">{ priceFormat(food.price) }</p>
                        </div>
                        <div className="w-full h-80 mb-3">
                            <img className="h-80 w-full" src={food.imgUrl} alt=""/>
                        </div>
                        <FoodCustomizationTitle price={food.price} name={food.name} ref={intersectionTargetRef}/>
                        <FoodCustomizationForm food={food} requiredOptionState={requiredOptionState}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </React.Fragment>
    )
}

const FoodCustomizationTitle = React.forwardRef(function FoodCustomizationTitle({ name, price } : { name: string, price: number }, ref) {
    return (
        <div className="overflow-y-auto" ref={ref as LegacyRef<HTMLDivElement> | undefined}>
            <h1 className="capitalize font-bold text-2xl">{ name }</h1>
            <p className="font-bold text-gray-500 mt-1 text-xl">{ priceFormat(price) }</p>
        </div>        
    )
})

type FoodCustomizationFormProps = {
    food: Article,
    requiredOptionState: Record<string, boolean>
}

type RefinedCustomizationOption = {
    _id: string,
    name: string,
    price: number,
    quantity: number,
    // parentCustomization: { name: string, _id: string },
}

function getPrice(basePrice: number, selectedOptions: Array<Record<string, Array<RefinedCustomizationOption>>>) {
    const optionPrice = selectedOptions.reduce((acc, curr) => {
        const val = Object.keys(curr)[0]
        const currCustomPrice = curr[val].reduce((_acc, _curr) => _acc + (_curr.price * _curr.quantity), 0);
        return acc + currCustomPrice;
    }, 0);
    return basePrice + optionPrice;
}

function FoodCustomizationForm({ food, requiredOptionState } : FoodCustomizationFormProps) {
    const [ requiredOptionsValidity, setRequiredOptionsValidity ] = React.useState<Record<string, boolean>>(requiredOptionState);
    const [ selectedOptions, setSelectedOptions ] = React.useState<Array<Record<string, Array<RefinedCustomizationOption>>>>([]);
    console.log('selectedOptions', selectedOptions);
    const [ itemCount, setItemCount ] = React.useState(food?.quantity || 1);
    const [ isSubmit, setIsSubmit ] = React.useState(false);

    const fetcher = useFetcher();
    const disabled = fetcher.state !== 'idle';
    const computedPrice = getPrice(food.price, selectedOptions);


    function handleSubmit(e:  React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Need to check after
        setIsSubmit(true);
        const invalidFields = Object.keys(requiredOptionsValidity).filter(key  => !requiredOptionsValidity[key]);
        if (!invalidFields.length) {
            console.log('submitting');
            const { customizations,  ...rest } = food;
            const order = {...rest, customizations: selectedOptions, quantity: itemCount };
            fetcher.submit(order, {
                method: 'post', action: '.', encType: "application/json"
            })
            console.log('order', order);
        } else {
            document.getElementById(invalidFields[0])?.scrollIntoView({behavior: "smooth", block: 'center'});
        }
        console.log('invalidFields', requiredOptionsValidity);
    }

    return (
        <Form id="food-customization-form" className="" onSubmit={handleSubmit}>
            {
                food.customizations?.map((custom, idx) => {
                    return (
                        <FoodCustomization
                            key={idx}
                            isInvalid={
                                isOptionRequired(custom.minNumOptions) && isSubmit && !requiredOptionsValidity[custom.title]
                            }
                            isIdle={!isSubmit}
                            customization={custom}
                            setRequiredOptionsValidity={setRequiredOptionsValidity}
                            setSelectedOptions={setSelectedOptions}
                        />
                    )
                })
            }
            <div style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}
                className="w-full flex justify-end items-center gap-5 bg-white shadow-custom py-4 absolute bottom-0 left-0 px-3">
                <ButtonIncrement alwaysOnDisplay cartCount={itemCount} onLimitDisable limitInf={1} getCount={setItemCount}/>
                <AddToCartWithCountButton count={itemCount} price={computedPrice} disableButton={disabled}/>
            </div>
        </Form>
    )
}

function AddToCartWithCountButton({ count=1, price=1299, disableButton=false, isSubmitting=false }) {
    return (
        <button
            className={clsx('relative group h-12 w-full font-bold text-lg py-2 rounded-lg text-white px-4', {
                'bg-green-800 cursor-not-allowed': disableButton,
                'bg-defaultGreen hover:bg-green-800': !disableButton
            })}
            disabled={disableButton}
            type="submit"
        >
            <span className='mr-4'>{ isSubmitting ? <Spinner color='white' size="sm" /> : null }</span>
            <span className={clsx('capitalize', {'text-gray-100': disableButton})}>Add to order</span>
            <span className={clsx('absolute right-2 top-1/2 -translate-y-1/2 px-2 rounded-lg text-[15px]', {
                'group-hover:bg-defaultGreen  bg-green-900': !disableButton,
                'text-gray-100 bg-green-800': disableButton
            })}>{priceFormat(count > 0 ? price * count: price)}</span>
        </button>
    )
}

function isOptionRequired(min: number) {
    return min === 0 ? false : true;
}

type PillProps = {
    children?: React.ReactNode,
    isInvalid: boolean,
    isIdle: boolean,
    text: string,
}

function Pill({ children, isInvalid, isIdle, text } : PillProps) {
    return (
        <React.Fragment>
            <div className="flex gap-1 items-center">
                <div className={clsx(" p-[0.6px] text-[13px] font-semibold gap-1 flex justify-center items-center rounded-3xl", {
                    "bg-gray-200 w-[4.7rem]": !isInvalid && isIdle,
                    "w-[5.8rem] bg-green-100 text-defaultGreen": !isInvalid && !isIdle,
                    "w-[5.8rem] bg-red-100 text-red-600": isInvalid,
                })}>
                    { children }
                    { text }
                </div>
            </div>
        </React.Fragment>
    )
}

function PillIcon({ isInvalid, isIdle } : { isInvalid: boolean, isIdle: boolean }) {
    if (isInvalid) {
        return <ErrorIcon fill="#dc2626" width={14} height={14}/>
    }
    if (!isInvalid && !isIdle) {
        return <CheckedIcon width={14} height={14}/>
    }
    return null;
}

function PillMessage({ min, max } : { min: number, max: number }) {
    if (min === 1 || min === max) {
        return <span className="text-gray-500 font-semibold text-[14px]">• Select { min }</span>;
    }
    if (min > 1) {
        return <span className="text-gray-500 font-semibold text-[14px]">• Select between { min } and { max }</span>;
    }
    if (min == 0) {
        return   <span className="text-gray-500 font-semibold text-[14px]">• Select up to {max}</span>
    } 
}

type RequiredInstructionProps = {
    min: number,
    max: number,
    isInvalid: boolean,
    isIdle: boolean,
}

function RequiredInstruction({ min, max, isInvalid, isIdle } : RequiredInstructionProps) {
    return (
        <div className="flex gap-1 items-center mt-1">
            <Pill isIdle={isIdle} isInvalid={isInvalid} text={'Required'}>
                <PillIcon isIdle={isIdle} isInvalid={isInvalid}/>
            </Pill>
            <PillMessage min={min} max={max}/>
        </div>
    )
}

function OptionalInstruction({ quantity, isIdle } : { quantity: number, isIdle: boolean }) {
    return (
        <div className="flex gap-1 items-center mt-1">
            <Pill text="Optional" isIdle={isIdle} isInvalid={false}>
                <PillIcon isIdle={isIdle} isInvalid={false}/>
            </Pill>
            <PillMessage min={0} max={quantity}/>
        </div>
    )
}

type FoodCustomizationProps = {
    customization: Customization,
    isInvalid: boolean,
    isIdle: boolean,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    setSelectedOptions: Dispatch<SetStateAction<Array<Record<string, Array<RefinedCustomizationOption>>>>>,
};

export function FoodCustomization({ customization, setRequiredOptionsValidity, setSelectedOptions, isInvalid, isIdle } : FoodCustomizationProps) {
    const isCustomizationRequired = isOptionRequired(customization.minNumOptions);
    return (
        <section className="last-of-type:pb-24">
            <div className="mt-8 py-2">
                    <div className="mb-4">
                        <h1 className="font-bold text-lg capitalize">{ customization.title }</h1>
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
                                    options={customization.options}
                                    title={customization.title}
                                    min={customization.minNumOptions}
                                    max={customization.maxNumOptions}
                                    setRequiredOptionsValidity={setRequiredOptionsValidity}
                                    setSelectedOptions={setSelectedOptions}
                                    />
                                    : 
                                    <OptionalFoodCustomizationSelect
                                        options={customization.options}
                                        title={customization.title}
                                        min={customization.minNumOptions}
                                        max={customization.maxNumOptions}
                                        setRequiredOptionsValidity={setRequiredOptionsValidity}
                                        setSelectedOptions={setSelectedOptions}
                                />
                        }
                    </div>
            </div>
        </section>
    )
}

type FoodCustomizationSelectProps = {
    isRequired?: boolean,
    min: number,
    max: number,
    options: Array<CustomizationOption>,
    title: string,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    setSelectedOptions: Dispatch<SetStateAction<Array<Record<string, Array<RefinedCustomizationOption>>>>>,
}

function RequiredFoodCustomizationSelect({ min, options, title, max, setRequiredOptionsValidity, setSelectedOptions } : FoodCustomizationSelectProps) {
    if (min == 1) {
        return (
            <CustomizationRadioGroup
                options={options}
                title={title}
                setRequiredOptionsValidity={setRequiredOptionsValidity}
                setSelectedOptions={setSelectedOptions}
            />
        )
    }
    if (min > 1) {
        return (
            <CustomizationCheckBoxGroup
                isRequired
                options={options}
                title={title}
                min={min}
                max={max}
                setRequiredOptionsValidity={setRequiredOptionsValidity}
                setSelectedOptions={setSelectedOptions}
            />
        )
    }
}

function OptionalFoodCustomizationSelect({ options, title, min, max, setRequiredOptionsValidity, setSelectedOptions } : FoodCustomizationSelectProps) {
    return (
        <CustomizationCheckBoxGroup
            options={options}
            title={title}
            min={min}
            max={max}
            setRequiredOptionsValidity={setRequiredOptionsValidity}
            setSelectedOptions={setSelectedOptions}
        />
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
                    : <OptionalInstruction quantity={quantity} isIdle={isIdle}/>
            }
        </React.Fragment>
    )
}


function unCheckedOption(customizations: Array<Record<string, RefinedCustomizationOption[]>>, name: string, title: string) {
    const customizationFound = customizations.find(customization => customization[title]) as Record<string, RefinedCustomizationOption[]>;
    const otherCustomizations = customizations.filter(customization => !customization[title]);
    const filteredOptions = customizationFound[title].filter(option => option.name !== name);
    if (filteredOptions.length) {
        return [...otherCustomizations, { [title]: filteredOptions}]
    } else {
        return [...otherCustomizations];
    }
}

function checkedOption(customizations: Array<Record<string, RefinedCustomizationOption[]>>, value: RefinedCustomizationOption, title: string) {
    let result: Array<RefinedCustomizationOption>; 
    const customizationFound = customizations.find(customization => customization[title]);
    const otherCustomizations = customizations.filter(customization => !customization[title]);
    if (customizationFound) {
        const newValue = customizationFound[title];
        result = [...newValue, value];
        return [...otherCustomizations, {[title]: result}];
    } else {
        return [...otherCustomizations, {[title]: [value]}]
    }
}

type CustomizationCheckBoxGroupProps = {
    isRequired?: boolean,
    options: Array<CustomizationOption>,
    title: string,
    min: number,
    max: number,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    setSelectedOptions: Dispatch<SetStateAction<Array<Record<string, Array<RefinedCustomizationOption>>>>>,
}

function CustomizationCheckBoxGroup({ options, title, isRequired, min, max, setRequiredOptionsValidity, setSelectedOptions } : CustomizationCheckBoxGroupProps) {
    const [ checkedCount, setCheckedCount ] = React.useState<number>(0);
    const [ checkedList, setCheckedList] = React.useState<Array<string>>([]);
    const checkboxContainerRef = React.useRef<HTMLElement | null>(null);
    const disableUnchecked = checkedCount === max && isRequired

    function handleChange(checked: boolean, checkboxName: string) {
        let newCount = 0;
        if (checked) {
            newCount = checkedCount + 1;
            setCheckedCount(newCount);
            setCheckedList(list => [...list, checkboxName]);
        } else {
            newCount = checkedCount - 1;
            setCheckedCount(newCount)
            setCheckedList(checkedList.filter(name => name !== checkboxName));
        }

        if (newCount >= min && newCount <= max) {
            setRequiredOptionsValidity(option => ({ ...option, [title]: true }));
        } else {
            setRequiredOptionsValidity(option => ({ ...option, [title]: false }));
        }
    }



    function handleSelectedOption(checked: boolean, name: string, price: number, _id: string) {
        if (checked) {
            const value = { name, price, _id, quantity: 1 };
            setSelectedOptions((customizations) => checkedOption(customizations, value, title))
        } else {
            setSelectedOptions((customizations) => unCheckedOption(customizations, name, title))
        }
    }

    return (
        <div ref={checkboxContainerRef as LegacyRef<HTMLDivElement> | undefined}>
            <CheckboxGroup colorScheme="green">
                {
                    options?.map(({ name, price, _id }: CustomizationOption, idx) => (
                        <div className="py-3 pl-3 border-b-[1px] flex items-center " key={idx} id={title}>
                            <Checkbox
                                disabled={disableUnchecked && !checkedList?.includes(name)}
                                _disabled={{backgroundColor: 'gray.200', cursor: 'not-allowed'}}
                                form="food-customization-form"
                                name={title} size={'lg'}
                                value={name} 
                                onChange={(e) => {
                                    handleChange(e.target.checked, name);
                                    handleSelectedOption(e.target.checked, name, price, _id);
                                }}>
                            </Checkbox>
                            <div className="grid pl-2">
                                <span className="font-semibold text-[14px] capitalize">{ name }</span>
                                <span className="font-bold text-[14px] text-gray-500">{ price ? priceFormat(price) : null }</span>
                            </div>
                        </div>
                    ))
                }
            </CheckboxGroup>
        </div>
    )
}

type CustomizationRadioGroupProps = {
    options: Array<CustomizationOption>,
    title: string,
    setRequiredOptionsValidity: Dispatch<SetStateAction<Record<string, boolean>>>,
    setSelectedOptions: Dispatch<SetStateAction<Array<Record<string, Array<RefinedCustomizationOption>>>>>,
}

function CustomizationRadioGroup({ options, title, setRequiredOptionsValidity, setSelectedOptions } : CustomizationRadioGroupProps) {
    const [ value, setValue ] = React.useState<string | undefined>(undefined);

    function handleChange(value: string) {
        setValue(value);
        setRequiredOptionsValidity(option => ({ ...option, [title]: true }));
    }

    function handleSelectedOption(name: string, price: number, _id: string) {
        const value = { [title]: [{ name, price, _id, quantity: 1 }] };
        setSelectedOptions(options => {
            const customizations = options.filter(option => !option[title]);
            return [...customizations, value]
        })
    }

    return (
        <RadioGroup className="grid" defaultValue="1" name={ title } onChange={handleChange} value={value} id={title}>
            {
                options?.map(({name, price, _id}: CustomizationOption, idx) => (
                    <div className="py-3 pl-3 border-b-[1px]" key={idx}>
                        <Radio form="food-customization-form"
                            name={title} size={'lg'}
                            value={ name }
                            colorScheme="green"
                            onChange={() => handleSelectedOption(name, price, _id)}
                        >
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
