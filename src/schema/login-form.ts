import { z } from 'zod';

export const LoginFormSchema = z.object({
    email: z.string({required_error: 'Email is required'}).email('Email is invalid'),
    password: z.string({required_error: 'Password is required'}).min(8, 'Password should be at least 8 characters.'),
})
