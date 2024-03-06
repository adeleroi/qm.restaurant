import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/login-action-context'
import { FirebaseAuthProvider } from './firebase/provider'

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
      <FirebaseAuthProvider>
        <LoginActionsProvider>
        <App/>
        </LoginActionsProvider>
      </FirebaseAuthProvider>
    </ChakraProvider>
  )
}

export default AppWithProvider
