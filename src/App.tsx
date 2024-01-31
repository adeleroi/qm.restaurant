import { ActionFunctionArgs, Outlet, json, redirect } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/auth-context'
import { loginEmailPassword, signupEmailPassword } from './firebase/auth'


function validateCredentials() {
  return false;
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
