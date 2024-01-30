import clsx from 'clsx';

const fontSize = {
  h1: 'leading-tight text-4xl md:text-5xl',
  h2: 'leading-tight text-3xl md:text-4xl',
  h3: 'text-2xl md:text-3xl',
  h4: 'text-xl md:text-2xl',
  h5: 'text-lg md:text-xl',
  h6: 'text-lg',
}

const titleColors = {
  white: 'text-white',
  secondary: 'text-secondary',
  black: 'text-black'
}

type TitleProps = {
  variant?: keyof typeof titleColors,
  size: keyof typeof fontSize,
  children?: React.ReactNode,
  className?: string,
  id?: string,
}

function Title({variant = 'white', size, className, ...rest}: TitleProps) {
  const HtmlTag = size;
  return (
    <HtmlTag className={clsx(fontSize[size], titleColors[variant], className)} {...rest} />
  )
}

export function H1(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h1" />
}

export function H2(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h2" />
}

export function H3(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h3" />
}

export function H4(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h4" />
}

export function H5(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h5" />
}

export function H6(props: Omit<TitleProps, 'size'>) {
  return <Title {...props} size="h6" />
}
