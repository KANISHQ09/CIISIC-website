import { z } from 'zod';

export const RegisterStudentSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum([
      'STUDENT',
      'INDUSTRY_SPOC',
      'INSTITUTION_SPOC',
      'ADMIN',
      'SUPER_ADMIN',
      'REVIEWER',
    ]),
    profileData: z
      .object({
        enrollmentNo: z.string().optional(),
        skills: z.array(z.string()).optional(),
        department: z.string().optional(),
        yearOfStudy: z.coerce.number().optional(),
        companyName: z.string().optional(),
        industry: z.string().optional(),
        isCIIMember: z.boolean().optional(),
        designation: z.string().optional(),
        adminRole: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

export const ForgotPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address'),
  })
  .strict();

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
  })
  .strict();

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  })
  .strict();
