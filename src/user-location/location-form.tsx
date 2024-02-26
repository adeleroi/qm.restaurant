import React from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    Select
  } from '@chakra-ui/react';
import { MapBoxMap } from '../components/store-info/map-mapbox';
import { Form } from 'react-router-dom';
import { Field } from '../components/form-element';
import { GooglePlace, SearchResult } from './new-google-place-autocomplete';

export function AddressPopover() {
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);
    const [ searchResult, setSearchResult ] = React.useState<SearchResult | null>();
    const { onClose, isOpen, onOpen } = useDisclosure();

    function handleClose() {
        onClose();
    }

    return (
        <Popover
            onOpen={onOpen}
            onClose={onClose}
            isOpen={isOpen}
            initialFocusRef={searchInputRef}>
            <PopoverTrigger>
                <button className="mr-4 cursor-pointer text-lg font-bold text-black px-1 h-12 rounded-3xl flex gap-2 items-center justify-center">
                    <span className="material-symbols-outlined font-black text-2xl text-defaultGreen">location_on</span>
                    <p className="text-[17px] truncate text-black">Address</p>
                </button>
            </PopoverTrigger>
            <PopoverContent minW={'30rem'} minH={'70vh'} border={''} boxShadow={"1px 7px 25px 8px rgb(0 0 0 / 0.25)"}>
                <PopoverArrow/>
                <PopoverCloseButton
                    onClick={() => handleClose()}
                    style={{top: '0.5rem', fontWeight: 'bold', fontSize: '16px', width: '2.4rem', height: '2.4rem', borderRadius: '50%'}} />
                <PopoverHeader border={'none'}>
                    <h1 className="pt-2 font-semibold max-w-[90%]">
                        {
                            searchResult ?
                            (
                                <div>
                                    <p className='text-md'>{ searchResult.address }</p>
                                    <p className='text-md'>({ searchResult.postalCode })</p>
                                </div>
                            )
                             : "Enter your address"
                        }
                    </h1>
                </PopoverHeader>
                <PopoverBody>
                     {
                        searchResult ?
                            <div>
                                <div className="h-44 border-[2px]">
                                    <MapBoxMap key={searchResult?.lat} latitude={searchResult?.lat} longitude={searchResult?.lng}/>
                                </div>
                                <AddressForm cancel={onClose}/>
                            </div>
                            : <GooglePlace setSelected={setSearchResult} />
                        }
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

function AddressForm({ cancel } : { cancel: () => void }) {
    return (
        <div className="mt-3">
            <Form>
                <Field className="mb-3">
                    <input
                        placeholder='Appartment, suite, floor'
                        className="p-3 mt-[2px] bg-gray-100 focus:border-black outline-none focus:border-2 w-full placeholder-gray-700"/>
                </Field>
                <Field className='mb-3'>
                    <Select placeholder='Delivery options' variant={'unstyled'} className='focus:border-black focus:border-2'  style={{backgroundColor: 'rgb(243 244 246 / 1)', padding: '12px', marginTop: '2px', borderRadius: 0}}>
                        <option value='option1'>Leave it at door</option>
                        <option value='option2'>Meet at my door</option>
                        <option value='option3'>Meet outside</option>
                    </Select>
                </Field>
                <Field className="mb-3">
                    <textarea
                        placeholder='Delivery instructions'
                        className="p-3 mt-[2px] min-h-28 bg-gray-100 focus:border-black outline-none focus:border-2 w-full placeholder-gray-700"/>
                </Field>
                <div className="w-full flex justify-end gap-4 mt-16 pb-4">
                    <button onClick={cancel} type="button" className="w-32 rounded-lg p-2 text-black hover:bg-gray-200 border-2 border-gray-100 bg-gray-100 font-bold">Cancel</button>
                    <button type="submit" className="w-32 rounded-lg p-2 text-white bg-defaultGreen hover:bg-green-800 font-bold">Save</button>
                </div>
            </Form>
        </div>
    )
}

