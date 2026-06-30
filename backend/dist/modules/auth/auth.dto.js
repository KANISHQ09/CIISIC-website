"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.LoginSchema = exports.RegisterStudentSchema = void 0;
const zod_1 = require("zod");
exports.RegisterStudentSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    role: zod_1.z.enum([
        'STUDENT',
        'INDUSTRY_SPOC',
        'INSTITUTION_SPOC',
        'ADMIN',
        'SUPER_ADMIN',
        'REVIEWER',
    ]),
    profileData: zod_1.z
        .object({
        enrollmentNo: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        department: zod_1.z.string().optional(),
        yearOfStudy: zod_1.z.coerce.number().optional(),
        companyName: zod_1.z.string().optional(),
        industry: zod_1.z.string().optional(),
        isCIIMember: zod_1.z.boolean().optional(),
        designation: zod_1.z.string().optional(),
        adminRole: zod_1.z.string().optional(),
    })
        .optional(),
})
    .strict();
exports.LoginSchema = zod_1.z
    .object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
})
    .strict();
exports.ForgotPasswordSchema = zod_1.z
    .object({
    email: zod_1.z.string().email('Invalid email address'),
})
    .strict();
exports.ResetPasswordSchema = zod_1.z
    .object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
})
    .strict();
exports.ChangePasswordSchema = zod_1.z
    .object({
    oldPassword: zod_1.z.string().min(1, 'Old password is required'),
    newPassword: zod_1.z.string().min(8, 'New password must be at least 8 characters long'),
})
    .strict();
