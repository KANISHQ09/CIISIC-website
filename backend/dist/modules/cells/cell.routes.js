"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cell_controller_1 = require("./cell.controller");
const authMiddleware_1 = require("../../shared/middleware/authMiddleware");
const router = (0, express_1.Router)();
const controller = new cell_controller_1.CellController();
// Public Cells Directory
router.get('/', controller.getCells);
router.get('/:id', controller.getCellById);
// Protected Cells Management
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.createCell);
router.patch('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.updateCell);
router.delete('/:id', authMiddleware_1.authenticate, (0, authMiddleware_1.requireRole)(['SUPER_ADMIN']), controller.deleteCell);
exports.default = router;
