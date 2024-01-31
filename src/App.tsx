import { ActionFunctionArgs, Outlet, json, redirect, useNavigate } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/auth-context'
import { loginEmailPassword, signupEmailPassword, useFirebaseAuth } from './firebase/auth'
import React from 'react'


function validateCredentials() {
  return true;
}

export async function loader({request}) {
  // return redirect('restaurant');
  return json({});
}


export async function action({request}: ActionFunctionArgs) {
  console.log('after will');
  const formData = await request.formData()
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const intent = formData.get('intent') as string;
  console.log(intent);

  if (validateCredentials()) {
    if (intent === 'signup') {
      await signupEmailPassword(email, password);
    } else if (intent === 'login') {
      await loginEmailPassword(email, password);
    }
  } else {
    console.log('no validate')
    return json({status: 'error', email, password});
  }
  return redirect('/');
}

function App() {
  const { loading, complete, data }: ReturnType<typeof useFirebaseAuth> = useFirebaseAuth()
  const navigate = useNavigate();

    React.useEffect(() => {
      if (complete && data) {
        navigate('restaurant');
      } 
      
    }, [complete, data, navigate])

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
        <LoginActionsProvider>
        <App/>
        </LoginActionsProvider>
    </ChakraProvider>
  )
}
export default AppWithProvider
