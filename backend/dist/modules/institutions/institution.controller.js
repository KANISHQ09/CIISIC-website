"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionController = void 0;
const institution_service_1 = require("./institution.service");
const response_1 = require("../../shared/responses/response");
class InstitutionController {
    institutionService;
    constructor() {
        this.institutionService = new institution_service_1.InstitutionService();
    }
    getInstitutions = async (req, res, next) => {
        try {
            const insts = await this.institutionService.getInstitutions();
            (0, response_1.sendResponse)({
                res,
                message: 'Institutions list retrieved successfully',
                data: insts,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getInstitutionById = async (req, res, next) => {
        try {
            const inst = await this.institutionService.getInstitutionById(req.params.id);
            (0, response_1.sendResponse)({
                res,
                message: 'Institution profile retrieved successfully',
                data: inst,
            });
        }
        catch (error) {
            next(error);
        }
    };
    createInstitution = async (req, res, next) => {
        try {
            const inst = await this.institutionService.createInstitution(req.body);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Institution profile created successfully',
                data: inst,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateInstitution = async (req, res, next) => {
        try {
            const inst = await this.institutionService.updateInstitution(req.params.id, req.body);
            (0, response_1.sendResponse)({
                res,
                message: 'Institution profile updated successfully',
                data: inst,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyInstitution = async (req, res, next) => {
        try {
            const status = req.body.status;
            const inst = await this.institutionService.verifyInstitution(req.params.id, status);
            (0, response_1.sendResponse)({
                res,
                message: `Institution profile marked as ${status} successfully`,
                data: inst,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.InstitutionController = InstitutionController;
