import React from "react";
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
import { Form, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { priceFormat } from "../../../utils/currency";
import { Food, FoodOption, FoodOptionList } from "./model.ts";

function getRequiredOptions(food: Food) {
    return food.customization.filter((foodOptionList) => (foodOptionList.minNumOptions > 0));
}

type RequiredOptionsMap = Record<string, {minNumOptions: number, maxNumOptions: number}>;

function buildSchema(food: Food) {
    const requiredOptions = getRequiredOptions(food);
    const requiredOptionsMap = {} as RequiredOptionsMap;
    requiredOptions.forEach(opList => {
        requiredOptionsMap[opList.id] = { minNumOptions: opList.minNumOptions, maxNumOptions: opList.maxNumOptions } 
    });
    return requiredOptionsMap;
}

type FormDataMap = Record<string, Array<string>>;
type ErrorMap = Record<string, boolean>;

function validateSubmission(formMap: FormDataMap = {}, schema: RequiredOptionsMap) {
    const errorMap = {} as ErrorMap;
    for (const key of Object.keys(schema)) {
        const { minNumOptions, maxNumOptions } = schema[key];
        const selectedOptionSize = formMap[key].length || 0;

        if (minNumOptions > selectedOptionSize || maxNumOptions < selectedOptionSize) {
            errorMap[key] = true;
        }
    }
    return errorMap
}

export function FoodModal() {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const { food } = useLoaderData() as { food: Food };
    const navigate = useNavigate();

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
                    onClose();
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
                                    <Form id="food-customization-form" className="" onSubmit={e => {
                                        console.log(e.target.closest('form').elements)
                                    }}>
                                        {
                                            food.customization.map((custom, idx) => {
                                                return (
                                                    <FoodCustomization customization={custom} key={idx}/>
                                                )
                                            })
                                        }
                                        <div className="w-full flex justify-end">
                                            <button type="submit" className="bg-black text-white font-bold text-xl py-2 rounded-lg w-44 mt-8 mb-4">Save</button>
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

function RequiredPill({ isRequired, quantity } : { isRequired: boolean, quantity: number }) {
    const el = isRequired ? (
            <div className="flex gap-1 items-center mt-1">
                <div className="w-[4.7rem] p-[1px] text-[13px] font-semibold flex justify-center items-center rounded-3xl bg-gray-200">Required</div>
                <div className="text-gray-500 font-semibold text-[14px]">
                    • Select 1
                </div>
            </div>
        ) : <span className="text-gray-500 font-semibold text-[14px]">(Optional) • Select up to {quantity}</span>
    return el;
}

export function FoodCustomization({ customization } : { customization: FoodOptionList}) {
    const isCustomizationRequired = isOptionRequired(customization.minNumOptions);
    return (
        <section>
            <div className="mt-8 py-2">
                    <div className="mb-4">
                        <h1 className="font-black text-lg capitalize">{ customization.title }</h1>
                        <RequiredPill isRequired={isCustomizationRequired} quantity={customization.options.length}/>
                    </div>
                    <div className="w-full">
                        {
                            isCustomizationRequired ?
                                <CustomizationRadioGroup options={customization.options} title={customization.title} />
                                : <CustomizationCheckBoxGroup options={customization.options} title={customization.title} />
                        }
                    </div>
            </div>
        </section>
    )
}

function CustomizationCheckBoxGroup({ options, title } : { options: Array<FoodOption>, title: string }) {
    return (
        <CheckboxGroup colorScheme="green">
            {
                options?.map(({ name, price }: FoodOption, idx) => (
                    <div className="py-3 pl-3 border-b-[1px] cursor-pointer" key={idx}>
                        <Checkbox form="food-customization-form" name={title} size={'lg'} value={name}>
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

function CustomizationRadioGroup({ options, title } : { options: Array<FoodOption>, title: string }) {
    return (
        <RadioGroup className="grid" defaultValue="1" name={ title }>
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
