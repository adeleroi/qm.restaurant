
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
                        className="p-3 mt-[2px] rounded-lg border-[1px] focus:border-defaultGreen outline-none focus:border-2 w-full placeholder-gray-400 text-bold"/>
                </Field>
                <Field className="mb-3">
                    <label className='font-semibold text-xs mb-2'>Appartment, suite, floor</label>
                    <input
                        className="p-3 mt-[2px] rounded-lg border-[1px] bg-gray-50 focus:border-black outline-none focus:border-2 w-full placeholder-gray-400"/>
                </Field>
                <Field className='mb-3'>
                    <label className='font-semibold text-xs mb-2'>Delivery options</label>
                    <select className='focus:border-black rounded-lg focus:border-2 border-[1px] placeholder-gray-400 w-full p-3 outline-none'
                        style={{backgroundColor: 'rgb(249 250 251 / 1)', paddingLeft: '12px'}}>
                        <option value='option1'>Leave it at door</option>
                        <option value='option2'>Meet at my door</option>
                        <option value='option3'>Meet outside</option>
                    </select>
                </Field>
                <Field className="mb-3">
                    <label className='font-semibold text-xs mb-2'>Delivery instructions</label>
                    <textarea
                        className="p-3 mt-[2px] rounded-lg min-h-36 border-[1px] bg-gray-50 focus:border-black outline-none focus:border-2 w-full placeholder-gray-400"/>
                </Field>
                <div className="w-full flex justify-end gap-2 mt-16 pb-4">
                    <button onClick={cancel} type="button" className="w-32 rounded-lg p-2 text-black hover:bg-gray-200 border-gray-100 bg-gray-100 font-bold">Cancel</button>
                    <button type="submit" className="w-32 rounded-lg p-2 text-white bg-defaultGreen hover:bg-green-800 font-bold">Save</button>
                </div>
            </Form>
        </div>
    )
}

