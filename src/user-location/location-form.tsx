import {
    Select
  } from '@chakra-ui/react';
import { Form } from 'react-router-dom';
import { Field } from '../components/form-element';

export function AddressForm({ address, postalCode, cancel } : { address: string, postalCode: string, cancel: () => void }) {
    const fullAddress = `${address} (${postalCode})`;
    return (
        <div className="mt-3 px-2">
            <Form>
                <Field className="mb-3">
                    <input
                        disabled
                        defaultValue={fullAddress}
                        className="p-3 mt-[2px] rounded-lg border-2 focus:border-defaultGreen outline-none focus:border-2 w-full placeholder-gray-700"/>
                </Field>
                <Field className="mb-3">
                    <input
                        placeholder='Appartment, suite, floor'
                        className="p-3 mt-[2px] rounded-lg border-2 bg-gray-50 focus:border-defaultGreen outline-none focus:border-2 w-full placeholder-gray-700"/>
                </Field>
                <Field className='mb-3'>
                    <Select placeholder='Delivery options' variant={'unstyled'} className='focus:border-defaultGreen rounded-lg focus:border-2 border-2'  style={{padding: '12px', marginTop: '2px', backgroundColor: 'rgb(249 250 251 / 1)'}}>
                        <option value='option1'>Leave it at door</option>
                        <option value='option2'>Meet at my door</option>
                        <option value='option3'>Meet outside</option>
                    </Select>
                </Field>
                <Field className="mb-3">
                    <textarea
                        placeholder='Delivery instructions'
                        className="p-3 mt-[2px] rounded-lg min-h-28 border-2 bg-gray-50 focus:border-defaultGreen outline-none focus:border-2 w-full placeholder-gray-700"/>
                </Field>
                <div className="w-full flex justify-end gap-4 mt-16 pb-4">
                    <button onClick={cancel} type="button" className="w-32 rounded-lg p-2 text-black hover:bg-gray-200 border-2 border-gray-100 bg-gray-100 font-bold">Cancel</button>
                    <button type="submit" className="w-32 rounded-lg p-2 text-white bg-defaultGreen hover:bg-green-800 font-bold">Save</button>
                </div>
            </Form>
        </div>
    )
}

