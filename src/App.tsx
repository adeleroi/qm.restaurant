import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'
import { ChakraProvider } from '@chakra-ui/react'
import { LoginActionsProvider } from './context/auth-context'

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
