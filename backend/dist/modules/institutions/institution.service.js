"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionService = void 0;
const institution_repository_1 = require("./institution.repository");
const AppError_1 = require("../../shared/errors/AppError");
class InstitutionService {
    institutionRepository;
    constructor() {
        this.institutionRepository = new institution_repository_1.InstitutionRepository();
    }
    async getInstitutions(filter = {}) {
        const result = await this.institutionRepository.paginate(filter, { limit: 100 });
        return result.docs;
    }
    async getInstitutionById(id) {
        const inst = await this.institutionRepository.findById(id);
        if (!inst) {
            throw new AppError_1.NotFoundError('Institution profile not found');
        }
        return inst;
    }
    async createInstitution(data) {
        return this.institutionRepository.create(data);
    }
    async updateInstitution(id, data) {
        const inst = await this.institutionRepository.update(id, data);
        if (!inst) {
            throw new AppError_1.NotFoundError('Institution profile not found');
        }
        return inst;
    }
    async verifyInstitution(id, status) {
        const inst = await this.institutionRepository.update(id, { verificationStatus: status });
        if (!inst) {
            throw new AppError_1.NotFoundError('Institution profile not found');
        }
        return inst;
    }
}
exports.InstitutionService = InstitutionService;
