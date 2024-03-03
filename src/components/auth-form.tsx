import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
  } from '@chakra-ui/react'
import { Button } from './button'
import React from 'react';
import { useFetcher } from 'react-router-dom';
import { Field, Input } from './form-element';
import { useLoginFormAction } from '../context/hooks';
import { Trigger } from '../utils/trigger';
import { conform, useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { LoginFormSchema } from '../schema/login-form';

const actionHeaderMessage = {
  'login': "Log in",
  'signup': "Sign up",
  'reset': "Reset your password"
}

export function AuthFormTrigger({triggerElement}: {triggerElement?: React.ReactNode}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { action } = useLoginFormAction();
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
  const fetcher = useFetcher();
  const [form, fields] = useForm({
    lastSubmission: fetcher.data?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: LoginFormSchema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  })


  const { action, setAction } = useLoginFormAction();
  const login = action === 'login';
  const reset = action === 'reset';

  return (
    <fetcher.Form method='post' {...form.props}>
      <Field error={fields.email.error}>
        <Input error={fields.email.error} type='email' className='border border-black h-14 focus:border-2' placeholder='email' ref={ref} {...conform.input(fields.email)}/>
      </Field>
      {
        reset ?
          null : (
          <Field error={fields.password.error}>
            <Input error={fields.password.error} className='border border-black h-14 focus:border-2' placeholder='Password' {...conform.input(fields.password, {type: 'password'})}/>
          </Field>
        )
      }
      {
        login ? (
          <Field>
            <p className='text-sm my-2'>
              Forgot password? &nbsp;
              <span
                onClick={() => {
                  setAction('reset');
                  (ref as React.MutableRefObject<HTMLInputElement>)?.current?.focus()
                }}
                className='text-defaultGreen font-bold cursor-pointer hover:text-green-700'>Reset it</span>
            </p>
          </Field>
        ) : null
      }
      <Field>
        <Button
          type="submit"
          name="intent"
          value={action ?? ''}
          variant='primary'
          className='h-14 rounded-lg xl:w-96 outline-none border font-bold'>
            { action && actionMessage[action] }
        </Button>
      </Field>
      <br/>
      <AuthFormFooter ref={ref}/>
    </fetcher.Form>
  )
});

const AuthFormFooter = React.forwardRef(function AuthFormFooter(_, ref) {
  const {action, setAction} = useLoginFormAction();
  const signup = action === 'signup';

  function getNextAction(e: React.SyntheticEvent<HTMLElement>) {
    // reset the form when we use different mode.
    (e.target as HTMLElement)?.closest('form')?.reset();
    switch(action) {
      case 'login':
        setAction('signup');
        break;
      case 'signup':
        setAction('login');
        break;
      case 'reset':
        setAction('signup');
        break
    }
    (ref as React.MutableRefObject<HTMLInputElement>)?.current?.focus();
  }
  return (
    <>
      <div className='grid place-items-center border-t-[1px] py-4'>
        <p className='text-sm'>
          { signup ? "Already ": "Don't " }
          have an account?</p>
        <p
          onClick={(e) => getNextAction(e)}
          className='text-sm text-defaultGreen font-bold cursor-pointer hover:text-green-700'>
          { signup ? "Log in" : "Sign up" }
        </p>
      </div>
    </>
  )
})
