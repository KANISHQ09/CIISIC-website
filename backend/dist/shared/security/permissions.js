"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.ROLE_PERMISSIONS = void 0;
exports.ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        'users.read',
        'users.create',
        'users.update',
        'users.delete',
        'institutions.manage',
        'companies.manage',
        'challenges.create',
        'challenges.review',
        'proposals.submit',
        'reviews.evaluate',
        'notifications.send',
        'audit.read',
        'reports.export',
        'settings.manage',
    ],
    INDUSTRY_SPOC: [
        'challenges.create',
        'proposals.submit', // Can read/action proposals on their challenges
        'notifications.send',
        'reports.export',
    ],
    INSTITUTION_SPOC: [
        'users.read',
        'users.create', // Can add students
        'institutions.manage',
        'notifications.send',
        'reports.export',
    ],
    STUDENT: ['proposals.submit'],
    REVIEWER: ['challenges.review', 'reviews.evaluate'],
};
const hasPermission = (role, permission) => {
    const permissions = exports.ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
};
exports.hasPermission = hasPermission;
