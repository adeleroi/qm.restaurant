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
import { Field } from './form-element';
import { useLoginFormAction } from '../context/hooks';
import { Trigger } from '../utils/trigger';
import { conform, useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { LoginFormSchema } from '../schema/login-form';
import clsx from 'clsx';
import { AppleIcon, FacebookIcon, GoogleIcon } from './icons/icon';

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
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered initialFocusRef={initialRef}>
          <ModalOverlay />
          <ModalContent style={{borderRadius: '16px'}}>
            <ModalHeader>
              <ModalCloseButton className='outline-2' style={{zIndex: 2, fontSize: '16px', borderRadius: '50%', padding: '0px'}}/>
            </ModalHeader>
            <ModalBody>
              <h1 className='font-semibold mb-8 text-2xl'>{action && actionHeaderMessage[action] }</h1>
                { action === 'reset' ? (
                  <p className='text-[16px] font-normal mb-2'>
                    Enter the email address associated with your account to reset your password.
                  </p>
                ): (
                  <React.Fragment>
                    <SoCialMediaAuthProvider/>
                    <AuthTypeSeparator/>
                  </React.Fragment>
                )
                }
              <AuthForm ref={initialRef}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
}

function AuthTypeSeparator() {
  return (
    <div className='flex w-full items-center justify-between my-4'>
      <hr className='w-1/2 border-[rgba(32, 33, 37, 0.12)]'/>
      <span className='text-gray-900 text-[14px] w-72 mx-3 font-medium'>or continue with email</span>
      <hr className='border-[rgba(32, 33, 37, 0.12)] w-1/2'/>
    </div>
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
  console.log('auth form', fetcher.data);

  const { action, setAction } = useLoginFormAction();
  const login = action === 'login';
  const reset = action === 'reset';

  return (
    <fetcher.Form method='post' {...form.props}>
      <Field error={fields.email.error}>
        <input type='email' className={clsx('h-14 border-2 w-full pl-3 rounded-lg outline-none', {
          'border-red-500': fields.email.error,
          'focus:border-black hover:border-black': !fields.email.error,
        })} placeholder='email' ref={ref as React.LegacyRef<HTMLInputElement>} {...conform.input(fields.email)}/>
      </Field>
      {
        reset ?
          null : (
          <Field error={fields.password.error}>
            <input
              className={clsx('h-14 border-2 w-full pl-3 rounded-lg outline-none', {
                'border-red-500': fields.password.error,
                'focus:border-black hover:border-black': !fields.password.error,
              })}
              placeholder='Password' {...conform.input(fields.password, {type: 'password'})}/>
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
          className='h-14 rounded-lg w-full outline-none border font-semibold'>
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
      <div className='grid place-items-center border-t-[1px] py-4 mb-4'>
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

function SoCialMediaAuthProvider() {
  const fetcher = useFetcher();

  function handleGoogleAuth() {
    const formData = new FormData();
    formData.append('intent', 'login_with_google_social_provider')
    fetcher.submit(formData, { method: 'post', action: "/", encType: "multipart/form-data" });
  }

  return (
    <div className='flex flex-col gap-2'>
      <SocialMediaAuthButton name='Google' onClick={handleGoogleAuth}/>
      <SocialMediaAuthButton name='Apple' onClick={handleGoogleAuth}/>
      <SocialMediaAuthButton name='Facebook' onClick={handleGoogleAuth}/>
    </div>
  )
}
type SocialAuthType = 'Apple' | 'Google' | 'Facebook';

function SocialMediaAuthButton({ name, onClick } : { name: SocialAuthType, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx('w-full rounded-lg relative h-14 px-3 text-[16px]', {
      'bg-white text-black border-[1px] hover:bg-gray-100': name === 'Google',
      'bg-[#1877f2] text-white hover:bg-[#1877f2d9]': name === 'Facebook',
      'bg-black text-white hover:bg-gray-800': name === 'Apple',
    })}>
      <div className='absolute top-1/2 -translate-y-1/2'>
        <SocialMediaLogo name={name} />
      </div>
      <span className='font-semibold'> Continue with { name }</span>
    </button>
  )
}

function SocialMediaLogo({ name }: { name: SocialAuthType }) {
  if (name === 'Apple') {
    return <AppleIcon />;
  }
  if (name === 'Facebook') {
    return <FacebookIcon/>;
  }
  if (name === 'Google') {
    return <GoogleIcon/>;
  }
}
