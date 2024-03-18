import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/login-action-context'
import { FirebaseAuthProvider } from './firebase/provider'

 
const customTheme = extendTheme({
  ...theme,
  shadows: { outline: '0 !important'}
})

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
