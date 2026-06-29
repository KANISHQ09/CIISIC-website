"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const institution_controller_1 = require("./institution.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new institution_controller_1.InstitutionController();
// Public Institution Directory
router.get('/', controller.getInstitutions);
router.get('/:id', controller.getInstitutionById);
// Protected Institution Management
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createInstitution);
router.patch('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INSTITUTION_SPOC']), controller.updateInstitution);
router.post('/:id/verify', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.verifyInstitution);
exports.default = router;
