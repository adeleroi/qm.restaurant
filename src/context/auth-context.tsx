import React from 'react'

export type LoginAction = 'login' | 'signup'| 'reset';
export const LoginActionContext = React.createContext<{
    action: LoginAction|null,
    setAction: React.Dispatch<LoginAction|null>
}|null>(null)

export function LoginActionsProvider({children}: {children: React.ReactNode}) {
    const [action, setAction] = React.useState<LoginAction|null>(null)
    return (
        <LoginActionContext.Provider value={{action, setAction}}>
            { children }
        </LoginActionContext.Provider>
    )
}
