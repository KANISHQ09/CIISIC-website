"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new company_controller_1.CompanyController();
// Public Company Directory
router.get('/', controller.getCompanies);
router.get('/:id', controller.getCompanyById);
// Protected Company Management
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createCompany);
router.patch('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN', 'INDUSTRY_SPOC']), controller.updateCompany);
router.post('/:id/verify', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.verifyCompany);
exports.default = router;
