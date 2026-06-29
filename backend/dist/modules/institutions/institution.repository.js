"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Institution_1 = require("../../database/schemas/Institution");
class InstitutionRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Institution_1.InstitutionModel);
    }
}
exports.InstitutionRepository = InstitutionRepository;
