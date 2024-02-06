import React from 'react'
import { ActionFunctionArgs, Outlet, json, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider } from '@chakra-ui/react'
import { LoginAction, LoginActionsProvider } from './context/login-action-context'
import { loginEmailPassword, signupEmailPassword, useFirebaseAuth } from './firebase/auth'
import { FirebaseAuthProvider } from './firebase/provider'
import { UserCredential } from 'firebase/auth'
import { LoginFormSchema } from './schema/login-form'
import { parse } from '@conform-to/zod'
import {
  SIGN_UP_ERROR_CODE_TO_MESSAGE,
  SIGN_UP_ERROR_CODE_PATH,
  LOG_IN_ERROR_CODE_PATH,
  LOG_IN_ERROR_CODE_TO_MESSAGE
} from './firebase/error-code'
import { z } from 'zod'
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase/fireStore'
import { Product } from './views/store-front'
import Cookies from 'js-cookie'

export async function loader() {
  const userId = Cookies.get('qm_session_id') as string;
  if (!userId) return json({});

  // const carts: Array<Product> = []
  // let cartSnapshot = [] as unknown as Awaited<Promise<QuerySnapshot<DocumentData, DocumentData>>>;
  // try {
  //   cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));
  // } catch(e) {
  //   console.error('Error trying to get the cart');
  // }
  // cartSnapshot.forEach(cartItem => {
  //     carts.push({id: cartItem.id, ...cartItem.data()} as Product);
  // })
  const carts: Array<Product> = [];

  const cartSnapshot = await getDocs(collection(db, "users", userId, "cart"));

  cartSnapshot.forEach(cartItem => {
      carts.push({id: cartItem.id, ...cartItem.data()} as Product);
  })

  const uniqueStoreList = [...new Set(carts.map(item => item.storeId))];

  let storeInfos = await Promise.all(
      uniqueStoreList.map(storeId => getDoc(doc(db, "store", storeId))),
  )
  storeInfos = storeInfos.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.data()}), {});
  
  const cartMap: Record<string, Array<Product>> = {};
  carts.forEach(item => {
      if (!cartMap[item.storeId]) {
          cartMap[item.storeId] = [];
      }
      cartMap[item.storeId].push(item);
  })

  for (const [key, value] of Object.entries(storeInfos)) {
      storeInfos[key]['cart']  = cartMap[key]
  }

  return json({carts, storeCartInfos: storeInfos})
}

// https://github.com/invertase/react-native-firebase-docs/blob/master/docs/auth/reference/auth.md
// Good reference for auth error with firebase
export async function action({request}: ActionFunctionArgs) {

  const formData = await request.formData()
  const intent = formData.get('intent') as LoginAction;
  const action = intent === 'login' ? loginEmailPassword : signupEmailPassword;
  const path = intent === 'login' ? LOG_IN_ERROR_CODE_PATH : SIGN_UP_ERROR_CODE_PATH;
  const message = intent === 'login' ? LOG_IN_ERROR_CODE_TO_MESSAGE : SIGN_UP_ERROR_CODE_TO_MESSAGE;

  let credential: UserCredential;
  const submission = await parse(formData, {
    schema: LoginFormSchema.superRefine(async (data, ctx) => {
      try {
        credential = await action(data.email, data.password);
      } catch(e) {
        ctx.addIssue({
          path: [path[e.code]],
          code: z.ZodIssueCode.custom,
          message: message[e.code],
        });
        return;
      }
    }).transform(data => ({...data, uid: credential?.user?.uid})),
    async: true,
  })


  if (!submission?.value?.uid) {
    return json({ submission }, {status: 400});
  }
  
  if (intent === 'signup') {
    // Added new users to the users collection
    await setDoc(doc(db, 'users', submission.value.uid), {
      email: submission.value.email,
      name: "N'guessan",
      country: 'Canada',
      PhoneNumber: '5817774338',
      timestamp: serverTimestamp(),
    })
  }

  return json({submission});
}

function App() {
  const { loading, loggedIn } = useFirebaseAuth()
  const location = useLocation()
  const navigate = useNavigate();

    React.useEffect(() => {
      if (loggedIn && location.pathname === '/') {
        navigate('store');
      } 

    }, [loggedIn, navigate, location])

  if (loading) null;

  return (
    <>
      <Navbar/>
      <div>
        <Outlet/>
      </div>
      <Footer/>
    </>
  )
}

function AppWithProvider() {
  return (
    <ChakraProvider>
      <FirebaseAuthProvider>
        <LoginActionsProvider>
        <App/>
        </LoginActionsProvider>
      </FirebaseAuthProvider>
    </ChakraProvider>
  )
}
export default AppWithProvider
