import { loginAnonymously } from "../firebase/auth";
import { setAddress, updateAddress, deleteAddress, setMainAdress } from "../firebase/fireStore";
import { SearchResult } from "../user-location/new-google-place-autocomplete";
import Cookies from 'js-cookie';

export async function SetAnonymousDeliveryAddressAction(formData: FormData) {
    const location = formData.get('location');
    const parsedLocation = JSON.parse(location as string) as SearchResult;
    const userCredential = await loginAnonymously();
    return setAddress(parsedLocation, userCredential.user.uid);
}

export async function SetDeliveryAddressAction(formData: FormData) {
    const { address } = retrieveDataFromForm(formData);
    const userCredential = Cookies.get('qm_session_id') as string;
    return setAddress(address, userCredential);
}

export async function UpdateDeliveryAddressAction(formData: FormData) {
    const { address, addressId }  = retrieveDataFromForm(formData);
    const userCredential = Cookies.get('qm_session_id') as string;
    return updateAddress(address, userCredential, addressId);
}

export async function DeleteDeliveryAddressAction(formData: FormData) {
    const addressId = formData.get('addressId') as string;
    const userCredential = Cookies.get('qm_session_id') as string;
    return deleteAddress(userCredential, addressId);
}

export async function setAddressAsMainDeliveryAddress(formData: FormData) {
    const addressId = formData.get('addressId') as string;
    const userCredential = Cookies.get('qm_session_id') as string;
    return setMainAdress(userCredential, addressId);
}

function retrieveDataFromForm(formData: FormData) {
    const location = formData.get('location');
    const appNumber = formData.get('appNumber') as string;
    const deliveryInstruction = formData.get('deliveryInstruction') as string;
    const addressId = formData.get('addressId') as string;
    const parsedLocation = JSON.parse(location as string) as SearchResult;

    const address = { ...parsedLocation, appNumber, deliveryInstruction }
    return { address, addressId };
}
