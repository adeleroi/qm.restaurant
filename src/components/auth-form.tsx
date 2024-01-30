import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { Button } from '../utils/button'
import React from 'react';
import { useFetcher } from 'react-router-dom';
import { Field, Input } from './form-element';
import { useLoginAction } from '../context/hooks';
import { Trigger } from '../utils/trigger';


const actionHeaderMessage = {
  'login': "Log in",
  'signup': "Sign up",
  'reset': "Reset your password"
}

export function AuthTrigger({triggerElement}: {triggerElement?: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { action } = useLoginAction();
    const initialRef = React.useRef(null)

    return (
      <>
        <Trigger onOpen={onOpen}>
          { triggerElement }
        </Trigger>
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={'md'} initialFocusRef={initialRef}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {action && actionHeaderMessage[action] }
              { action === 'reset' ? (
                <p className='text-[16px] font-normal mt-2'>Enter the email address associated with your account to reset your password.</p>
              ): null
              }
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AuthForm ref={initialRef}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}




const actionMessage = {
  'login': "Log in",
  'signup': "Sign up",
  'reset': "Continue"
}

const AuthForm = React.forwardRef(function AuthForm(_, ref) {
  const fetcher = useFetcher()
  const { action, setAction } = useLoginAction();
  const login = action === 'login';
  const reset = action === 'reset';

  return (
    <fetcher.Form method='post'>
      <Field>
        <Input type='email' name='email' className='border border-black h-14 focus:border-2' placeholder='email' ref={ref}/>
      </Field>
      
      {
        reset ?
          null : (
          <Field>
            <Input type='password' name='password' className='border border-black h-14 focus:border-2' placeholder='Password'/>
          </Field>
        )
      }
      {
        login ? (
          <Field>
            <p className='text-sm my-2'>
              Forgot password? &nbsp;
              <span
                onClick={() => setAction('reset')}
                className='text-defaultGreen font-bold cursor-pointer hover:text-green-700'>Reset it</span>
            </p>
          </Field>
        ) : null
      }
      <Field>
        <Button
          type="submit"
          name="intent"
          value={action ? actionMessage[action]: ''}
          variant='primary'
          className='h-14 rounded-lg xl:w-96 outline-none border font-bold'>
            { action && actionMessage[action] }
        </Button>
      </Field>
      <br/>
      <AuthFormFooter/>
    </fetcher.Form>
  )
});

function AuthFormFooter() {
  const {action, setAction} = useLoginAction();
  const signup = action === 'signup';

  function switchAction() {
    if (action === 'login') {
      setAction('signup');
    }
    if (action === 'signup') {
      setAction('login');
    }
    if (action === 'reset') {
      setAction('signup');
    }
  }
  return (
    <>
      <div className='grid place-items-center border-t-[1px] py-4'>
        <p className='text-sm'>
          { signup ? "Already ": "Don't " }
          have an account?</p>
        <p
          onClick={switchAction}
          className='text-sm text-defaultGreen font-bold cursor-pointer hover:text-green-700'>
          { signup ? "Log in" : "Sign up" }
        </p>
      </div>
    </>
  )
}
