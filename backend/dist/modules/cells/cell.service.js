"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellService = void 0;
const cell_repository_1 = require("./cell.repository");
const AppError_1 = require("../../shared/errors/AppError");
class CellService {
    cellRepository;
    constructor() {
        this.cellRepository = new cell_repository_1.CellRepository();
    }
    async getAllCells() {
        const result = await this.cellRepository.paginate({ status: 'ACTIVE' }, { limit: 100 });
        return result.docs;
    }
    async getCellById(id) {
        const cell = await this.cellRepository.findById(id);
        if (!cell) {
            throw new AppError_1.NotFoundError('Excellence Cell not found');
        }
        return cell;
    }
    async createCell(data) {
        return this.cellRepository.create(data);
    }
    async updateCell(id, data) {
        const cell = await this.cellRepository.update(id, data);
        if (!cell) {
            throw new AppError_1.NotFoundError('Excellence Cell not found');
        }
        return cell;
    }
    async deleteCell(id) {
        return this.cellRepository.softDelete(id);
    }
}
exports.CellService = CellService;
