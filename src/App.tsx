import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider, Spinner, extendTheme, theme } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/login-action-context'
import { FirebaseAuthProvider } from './firebase/provider'
import { useFirebaseAuth } from './firebase/auth'
import React from 'react'
 
const customTheme = extendTheme({
  ...theme,
  fonts: {body: `'poppins', sans-serif`, heading: `'roboto', sans-serif` },
  shadows: { outline: '0 !important'}
})

function App() {
  const { loggedIn, loading } = useFirebaseAuth();
  const location= useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';

  React.useEffect(() => {
    if (isLandingPage && loggedIn) {
      navigate('/feed');
    }
  }, [])

  return (
    <div>
      { loading ?
        <div className='h-screen w-screen grid place-items-center'>
          <Spinner/>
        </div>
          :
        <div>
          <Navbar/>
          <Outlet/>
          <Footer/>
        </div>
      }
    </div>
  )
}


function AppWithProvider() {
  return (
    <ChakraProvider theme={customTheme}>
      <FirebaseAuthProvider>
        <LoginActionsProvider>
            <App/>
        </LoginActionsProvider>
      </FirebaseAuthProvider>
    </ChakraProvider>
  )
}

export default AppWithProvider
