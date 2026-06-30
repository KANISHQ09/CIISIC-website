"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_service_1 = require("./company.service");
const response_1 = require("../../shared/responses/response");
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const AppError_1 = require("../../shared/errors/AppError");
class CompanyController {
    companyService;
    constructor() {
        this.companyService = new company_service_1.CompanyService();
    }
    getMyCompany = async (req, res, next) => {
        try {
            const user = req.user;
            const company = await Company_1.default.findOne({ industrySpocs: user.id, isDeleted: { $ne: true } });
            if (!company) {
                throw new AppError_1.NotFoundError('No company associated with this account');
            }
            (0, response_1.sendResponse)({
                res,
                message: 'My company profile retrieved successfully',
                data: company,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCompanies = async (req, res, next) => {
        try {
            const comps = await this.companyService.getCompanies();
            (0, response_1.sendResponse)({
                res,
                message: 'Companies list retrieved successfully',
                data: comps,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCompanyById = async (req, res, next) => {
        try {
            const comp = await this.companyService.getCompanyById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Company profile retrieved successfully',
                data: comp,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createCompany = async (req, res, next) => {
        try {
            const comp = await this.companyService.createCompany(req.body);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Company profile created successfully',
                data: comp,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateCompany = async (req, res, next) => {
        try {
            const comp = await this.companyService.updateCompany(req.params.id, req.body);
            (0, response_1.sendResponse)({
                res,
                message: 'Company profile updated successfully',
                data: comp,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyCompany = async (req, res, next) => {
        try {
            const status = req.body.status;
            const comp = await this.companyService.verifyCompany(req.params.id, status);
            (0, response_1.sendResponse)({
                res,
                message: `Company profile marked as ${status} successfully`,
                data: comp,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CompanyController = CompanyController;
