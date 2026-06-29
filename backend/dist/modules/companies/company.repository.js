"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const BaseRepository_1 = require("../../shared/repositories/BaseRepository");
const Company_1 = require("../../database/schemas/Company");
class CompanyRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Company_1.CompanyModel);
    }
}
exports.CompanyRepository = CompanyRepository;
