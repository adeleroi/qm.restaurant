import React from 'react'

export function Trigger({children, onOpen}:{children: React.ReactNode, onOpen: () => void}) {
    return (
      <>
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    // @ts-expect-error added onClick event
                    onClick: () => {
                      child?.props?.onClick?.();
                      onOpen()
                    },
                })
            }
        })}
      </>
    )
}