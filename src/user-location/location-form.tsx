
import { useFetcher, useLocation, useNavigate } from 'react-router-dom';
import { Field } from '../components/form-element';
import { SearchResult } from './new-google-place-autocomplete';
import { Spinner } from '@chakra-ui/react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import React from 'react';

type AddressFormProps = {
    searchResult: SearchResult,
    cancel: () => void,
    close: () => void,
    context: 'edit' | 'add',
};

function getFormIntent(context: AddressFormProps['context']) {
    const isAnonymousUser = !Cookies.get('qm_session_id');
    if (context === 'edit') {
        return 'update_delivery_address';
    }
    return isAnonymousUser ? 'set_anonymous_delivery_address' : 'set_delivery_address';
}

export function AddressForm({ searchResult, cancel, close, context } : AddressFormProps) {
    const fullAddress = `${searchResult.address} (${searchResult.postalCode})`;
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state !== 'idle';
    const navigate = useNavigate();
    const location = useLocation();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append('location', JSON.stringify(searchResult));
        formData.append('intent', getFormIntent(context));
        fetcher.submit(formData, { method: 'post', action: "/", encType: "multipart/form-data" });
        navigate(location.pathname); // hack to allow synchronization.
    }

    React.useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            close();
        }
    }, [fetcher, close])

    return (
        <div className="mt-3 px-2">
            <fetcher.Form onSubmit={handleSubmit}>
                <Field className="mb-3">
                    <label className='font-medium text-gray-500 text-xs mb-2'>Address</label>
                    <input
                        name="fullAddress"
                        disabled
                        defaultValue={fullAddress}
                        className="p-3 mt-[2px] rounded-lg border-[1px] focus:border-defaultGreen outline-none focus:border-2 w-full placeholder-gray-400 text-bold"/>
                </Field>
                <Field className="mb-3">
                    <label className='font-medium text-gray-500 text-xs mb-2'>Number (Appartment, suite, floor)</label>
                    <input
                        defaultValue={searchResult.appNumber}
                        autoComplete='off'
                        name="appNumber"
                        className="p-3 mt-[2px] rounded-lg border-[1px] bg-gray-50 focus:border-black outline-none focus:border-2 w-full placeholder-gray-400"/>
                </Field>
                <Field className="mb-3">
                    <label className='font-medium text-gray-500 text-xs mb-2'>Delivery instructions</label>
                    <textarea
                        defaultValue={searchResult.deliveryInstruction}
                        name="deliveryInstruction"
                        maxLength={50}
                        className="p-3 mt-[2px] rounded-lg min-h-36 border-[1px] bg-gray-50 focus:border-black outline-none focus:border-2 w-full placeholder-gray-400"/>
                </Field>
                <div className="w-full flex justify-end gap-2 mt-6 pb-4">
                    <button
                        type="button"
                        onClick={cancel}
                        disabled={isSubmitting}
                        className={clsx("w-32 rounded-lg p-2 font-bold", {
                            "hover:bg-green-200 bg-green-100 text-defaultGreen": !isSubmitting,
                            "bg-gray-200 cursor-not-allowed": isSubmitting
                        })}>
                            Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx("w-32 rounded-lg p-2 text-white font-bold", {
                            'bg-green-800 cursor-not-allowed': isSubmitting,
                            ' bg-defaultGreen hover:bg-green-800': !isSubmitting
                        })}>
                        <span className='mr-4'>{ isSubmitting ? <Spinner color='white' size="sm" /> : null }</span>
                        Save
                    </button>
                </div>
            </fetcher.Form>
        </div>
    )
}
