export const SIGN_UP_ERROR_CODE_TO_MESSAGE = {
    "auth/email-already-in-use": "Email already in use",
    "auth/invalid-email": "Email is invalid",
    "auth/operation-not-allowed": "",
    "auth/weak-password": "Password should be at least 8 characters",
}

export const LOG_IN_ERROR_CODE_TO_MESSAGE = {
    "auth/email-already-in-use": "Email already in use",
    "auth/user-disabled": "This email has been disabled",
    "auth/user-not-found": "Invalid email address",
    "auth/wrong-password": "Invalid password",
}

export const SIGN_UP_ERROR_CODE_PATH = {
    "auth/email-already-in-use": "email",
    "auth/invalid-email": "email",
    "auth/operation-not-allowed": "",
    "auth/weak-password": "password",
}

export const LOG_IN_ERROR_CODE_PATH = {
    "auth/email-already-in-use": "email",
    "auth/user-disabled": "email",
    "auth/user-not-found": "email",
    "auth/wrong-password": "password",
}
