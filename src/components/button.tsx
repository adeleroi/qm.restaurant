import clsx from 'clsx';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: 'primary' | 'secondary' | 'black',
  children?: React.ReactNode,
  size?: 'large' | 'medium' | 'small' | 'x-small',
}

export function Button({variant, size='medium', className, children, ...rest}: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex justify-center items-center group/button',
        className,
        { 
          ' bg-defaultGreen hover:bg-green-700 text-white': variant === 'primary',
          'border-2 border-black hover:text-white bg-white hover:bg-black': variant === 'secondary',
          'text-white hover:text-black bg-black hover:bg-white border-2 border-black': variant === 'black',
          'rounded-3xl w-[10rem] px-2 py-5 text-md': size === 'large',
          'rounded-3xl w-[8rem] px-2 py-5 text-md': size === 'medium',
          'rounded-3xl w-[6rem] px-2 py-5 text-md': size === 'small',
        }
      )}
      {...rest}>
      {children}
    </button>
  )
}

export function ArrowButton({text, ...rest}:{text?: string}&ButtonProps) {
    return (
        <Button {...rest}>
            {text}
            <span className="ml-1 material-symbols-outlined group-hover/button:animate-slide-right group-hover/button:opacity-100">
                arrow_forward
            </span>
        </Button>
    )
}

type Direction = 'bottom' | 'right';

const arrow = {
    bottom: <span className="ml-1 material-symbols-outlined animate-slide-bottom-infinite">arrow_downward</span>,
    right: <span className="ml-1 material-symbols-outlined animate-slide-right-infinite">arrow_forward</span>,
}
export function ArrowPulseButton({text, direction='right', ...rest}:{text?: string, direction: Direction}&ButtonProps) {
    return (
        <Button {...rest}>
            {text}
            {arrow[direction]}
        </Button>
    )
}

export function CirclePulseButton() {
  return (
    <div className='absolute top-1/2 -translate-y-1/2 right-2 group'>
      <button className='w-[40px] h-[40px] rounded-full border-2 border-defaultGreen flex items-center justify-center bg-defaultGreen group-hover:bg-[#EEEEEE] focus:ring-2 focus:ring-offset-2 focus:ring-defaultGreen'>
        <span className="ml-1 material-symbols-outlined animate-slide-right-infinite text-white group-hover:text-defaultGreen">arrow_forward</span>
      </button>
    </div>
  )
}

Button.displayName = 'Button';
