import { z } from 'zod';

export const RegisterUserSchema = z
  .object({
    name: z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z
      .string({ message: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    role: z.enum(['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'REVIEWER', 'SUPER_ADMIN']),
    profileData: z.any().optional(),
  })
  .strict();

export const LoginUserSchema = z
  .object({
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z.string({ message: 'Password is required' }),
  })
  .strict();

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
