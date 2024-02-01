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
        console.log('code', e);
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

  // console.log('submission', submission);

  if (!submission?.value?.uid) {
    return json({ submission }, {status: 400});
  }

  return json({submission});
}

function App() {
  const { loading, loggedIn } = useFirebaseAuth()
  const location = useLocation()
  const navigate = useNavigate();

    React.useEffect(() => {
      if (loggedIn && location.pathname === '/') {
        navigate('restaurant');
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
