"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const company_repository_1 = require("./company.repository");
const AppError_1 = require("../../shared/errors/AppError");
class CompanyService {
    companyRepository;
    constructor() {
        this.companyRepository = new company_repository_1.CompanyRepository();
    }
    async getCompanies(filter = {}) {
        const result = await this.companyRepository.paginate(filter, { limit: 100 });
        return result.docs;
    }
    async getCompanyById(id) {
        const comp = await this.companyRepository.findById(id);
        if (!comp) {
            throw new AppError_1.NotFoundError('Company profile not found');
        }
        return comp;
    }
    async createCompany(data) {
        return this.companyRepository.create(data);
    }
    async updateCompany(id, data) {
        const comp = await this.companyRepository.update(id, data);
        if (!comp) {
            throw new AppError_1.NotFoundError('Company profile not found');
        }
        return comp;
    }
    async verifyCompany(id, status) {
        const comp = await this.companyRepository.update(id, { verificationStatus: status });
        if (!comp) {
            throw new AppError_1.NotFoundError('Company profile not found');
        }
        return comp;
    }
}
exports.CompanyService = CompanyService;
