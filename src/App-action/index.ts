import { ActionFunctionArgs, json, redirect } from 'react-router-dom'
import { AuthAction } from './auth-action';
import { createUser } from '../firebase/fireStore';
import {
  SetAnonymousDeliveryAddressAction,
  SetDeliveryAddressAction,
  UpdateDeliveryAddressAction,
  DeleteDeliveryAddressAction,
  setAddressAsMainDeliveryAddress
} from './address-action';

export async function AppAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'login' || intent === 'signup') {
    const {submission } = await AuthAction(formData);
    if (!submission?.value?.uid) {
      return json({ submission }, {status: 400});
    }
    if (intent === 'signup') {
      await createUser(submission.value.uid, submission.value.email);
    }
    return redirect(window.location.pathname);
  }

  if (intent === 'set_anonymous_delivery_address') {
    console.log('set_anonymous')
    await SetAnonymousDeliveryAddressAction(formData);
    return redirect('/feed');
  }

  if (intent === 'set_delivery_address') {
    await SetDeliveryAddressAction(formData);
    console.log('in set delivery address action');
  }

  if (intent === 'update_delivery_address') {
    await UpdateDeliveryAddressAction(formData);
  }

  if (intent === 'delete_delivery_address') {
    await DeleteDeliveryAddressAction(formData);
  }

  if (intent === 'set_main_delivery_address') {
    await setAddressAsMainDeliveryAddress(formData);
    console.log('in set main delivery address')
  }

  return json({});
}
