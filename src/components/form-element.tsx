import * as React from 'react';
import clsx from 'clsx';

type InputProps = {
  className?: string,
  error?: string,
  children?: React.ReactNode
}

export function Field({ children, className, error } : InputProps) {
  return (
    <div className={clsx('m-1', className)}>
      {children}
      { error ? <InputError>{error}</InputError> : null }
    </div>
  )
}

type InputInnerProps = (JSX.IntrinsicElements['input'] | JSX.IntrinsicElements['textarea'] & { type: 'textarea' }) & { error?: string };

export const Input = React.forwardRef(function Input(props: InputInnerProps, ref) {
  if (props.type === 'textarea') {
    // @ts-expect-error set the correct type after
    return <textarea ref={ref} {...props as JSX.IntrinsicElements['textarea']} className={clsx('p-2 rounded-lg w-96 h-44 outline-none ', props.className, {
        'border-2 border-red-500': props.error
    })} />
}
// @ts-expect-error set the correct type after
  return <input ref={ref} {...props as JSX.IntrinsicElements['input']} className={clsx('p-2 rounded-lg w-96 h-14 outline-none', props.className, {
    'border-2 border-red-500': props.error
  })} />
})

function InputError({children}: { children: React.ReactNode }) {
  if (!children) {
    return null;
  }
  return (
    <p className='pb-1 mt-[1px] text-left text-red-500 text-xs'>{children}</p>
  )
}
