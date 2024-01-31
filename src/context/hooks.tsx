import React from 'react';
import { LoginActionContext } from './login-action-context';

export function useLoginFormAction() {
    const context = React.useContext(LoginActionContext);
    if (!context) {
        throw new Error('useLoginFormAction should be used within SwitchBetweenLoginActionsProvider')
    }
    return context;
}
