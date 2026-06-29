"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
exports.RegisterUserSchema = zod_1.z
    .object({
    name: zod_1.z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: zod_1.z
        .string({ message: 'Password is required' })
        .min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.enum(['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'REVIEWER', 'SUPER_ADMIN']),
    profileData: zod_1.z.any().optional(),
})
    .strict();
exports.LoginUserSchema = zod_1.z
    .object({
    email: zod_1.z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: zod_1.z.string({ message: 'Password is required' }),
})
    .strict();
