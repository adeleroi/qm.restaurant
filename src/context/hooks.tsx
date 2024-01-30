import React from 'react';
import { LoginActionContext } from './auth-context';

export function useLoginAction() {
    const context = React.useContext(LoginActionContext);
    if (!context) {
        throw new Error('useLoginAction should be used within SwitchBetweenLoginActionsProvider')
    }
    return context;
}
