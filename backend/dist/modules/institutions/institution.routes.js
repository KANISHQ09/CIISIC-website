"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institution_controller_1 = require("./institution.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new institution_controller_1.InstitutionController();
// Protected Institution Management
router.get('/my', authMiddleware_1.authenticate, controller.getMyInstitution);
router.get('/faculty', authMiddleware_1.authenticate, controller.getFaculty);
router.get('/students', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['INSTITUTION_SPOC', 'SUPER_ADMIN']), controller.getStudents);
router.patch('/students/:id/verify', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['INSTITUTION_SPOC', 'SUPER_ADMIN']), controller.verifyStudent);
// Public Institution Directory
router.get('/', controller.getInstitutions);
router.get('/:id', controller.getInstitutionById);
// Protected Institution Management Actions
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createInstitution);
router.patch('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC']), controller.updateInstitution);
router.post('/:id/verify', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.verifyInstitution);
exports.default = router;
