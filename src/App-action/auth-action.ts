// https://github.com/invertase/react-native-firebase-docs/blob/master/docs/auth/reference/auth.md
// Good reference for auth error with firebase
import { LoginAction } from '../context/login-action-context'
import { loginEmailPassword, signupEmailPassword } from '../firebase/auth'
import { UserCredential } from 'firebase/auth'
import { LoginFormSchema } from '../schema/login-form'
import { parse } from '@conform-to/zod'
import {
  SIGN_UP_ERROR_CODE_TO_MESSAGE,
  SIGN_UP_ERROR_CODE_PATH,
  LOG_IN_ERROR_CODE_PATH,
  LOG_IN_ERROR_CODE_TO_MESSAGE
} from '../firebase/error-code'
import { z } from 'zod'
import { FirebaseError } from 'firebase/app'

export async function AuthAction(formData: FormData) {
  const intent = formData.get('intent') as LoginAction;
  const action = intent === 'login' ? loginEmailPassword : signupEmailPassword;
  const path = intent === 'login' ? LOG_IN_ERROR_CODE_PATH : SIGN_UP_ERROR_CODE_PATH;
  const message = intent === 'login' ? LOG_IN_ERROR_CODE_TO_MESSAGE : SIGN_UP_ERROR_CODE_TO_MESSAGE;

  let credential: UserCredential;
  const submission = await parse(formData, {
    schema: LoginFormSchema.superRefine(async (data, ctx) => {
      try {
        credential = await action(data.email, data.password);
      } catch(e) {
        ctx.addIssue({
          path: [path[(e as FirebaseError).code as keyof typeof path]],
          code: z.ZodIssueCode.custom,
          message: message[(e as FirebaseError).code as keyof typeof message],
        });
        return;
      }
    }).transform(data => ({...data, uid: credential?.user?.uid})),
    async: true,
  })
  return { submission };
}
