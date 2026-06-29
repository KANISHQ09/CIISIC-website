"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellController = void 0;
const cell_service_1 = require("./cell.service");
const response_1 = require("../../shared/responses/response");
class CellController {
    cellService;
    constructor() {
        this.cellService = new cell_service_1.CellService();
    }
    getCells = async (req, res, next) => {
        try {
            const cells = await this.cellService.getAllCells();
            (0, response_1.sendResponse)({
                res,
                message: 'Excellence cells retrieved successfully',
                data: cells,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCellById = async (req, res, next) => {
        try {
            const cell = await this.cellService.getCellById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Excellence cell retrieved successfully',
                data: cell,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createCell = async (req, res, next) => {
        try {
            const cell = await this.cellService.createCell(req.body);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Excellence cell created successfully',
                data: cell,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateCell = async (req, res, next) => {
        try {
            const cell = await this.cellService.updateCell(req.params.id, req.body);
            (0, response_1.sendResponse)({
                res,
                message: 'Excellence cell updated successfully',
                data: cell,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteCell = async (req, res, next) => {
        try {
            await this.cellService.deleteCell(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Excellence cell deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CellController = CellController;
