"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const ExcellenceCell_1 = require("../../database/schemas/ExcellenceCell");
class CellRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(ExcellenceCell_1.ExcellenceCellModel);
    }
}
exports.CellRepository = CellRepository;
