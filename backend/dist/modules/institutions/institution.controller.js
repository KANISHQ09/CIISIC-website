"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionController = void 0;
const institution_service_1 = require("./institution.service");
const response_1 = require("../../shared/responses/response");
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const StudentProfile_1 = __importDefault(require("../../database/schemas/StudentProfile"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const AppError_1 = require("../../shared/errors/AppError");
class InstitutionController {
    institutionService;
    constructor() {
        this.institutionService = new institution_service_1.InstitutionService();
    }
    getMyInstitution = async (req, res, next) => {
        try {
            const user = req.user;
            const inst = await Institution_1.default.findOne({
                $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
                isDeleted: { $ne: true }
            });
            if (!inst) {
                throw new AppError_1.NotFoundError('No institution associated with this account');
            }
            (0, response_1.sendResponse)({
                res,
                message: 'My institution profile retrieved successfully',
                data: inst,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getFaculty = async (req, res, next) => {
        try {
            const user = req.user;
            const inst = await Institution_1.default.findOne({
                $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
                isDeleted: { $ne: true }
            });
            if (!inst) {
                throw new AppError_1.NotFoundError('No institution associated with this account');
            }
            const faculty = await User_1.default.find({
                _id: { $in: inst.facultyMembers },
                isDeleted: { $ne: true }
            }).select('-passwordHash');
            (0, response_1.sendResponse)({
                res,
                message: 'Faculty members list retrieved successfully',
                data: faculty,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getStudents = async (req, res, next) => {
        try {
            const user = req.user;
            const inst = await Institution_1.default.findOne({
                $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
                isDeleted: { $ne: true }
            });
            if (!inst) {
                throw new AppError_1.NotFoundError('No institution associated with this account');
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [profiles, totalDocs] = await Promise.all([
                StudentProfile_1.default.find({ institutionId: inst._id, isDeleted: { $ne: true } })
                    .populate('userId', '-passwordHash')
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                StudentProfile_1.default.countDocuments({ institutionId: inst._id, isDeleted: { $ne: true } })
            ]);
            const data = profiles.map((p) => ({
                id: p._id,
                userId: p.userId?._id,
                name: p.userId?.name || '',
                email: p.userId?.email || '',
                enrollmentNo: p.enrollmentNo,
                department: p.department,
                yearOfStudy: p.yearOfStudy,
                verificationStatus: p.userId?.isVerified ? 'VERIFIED' : 'PENDING'
            }));
            (0, response_1.sendResponse)({
                res,
                message: 'Students list retrieved successfully',
                data,
                meta: {
                    totalDocs,
                    page,
                    limit,
                    totalPages: Math.ceil(totalDocs / limit)
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyStudent = async (req, res, next) => {
        try {
            const studentProfileId = req.params.id;
            const { status } = req.body;
            const profile = await StudentProfile_1.default.findOne({ _id: studentProfileId, isDeleted: { $ne: true } });
            if (!profile) {
                throw new AppError_1.NotFoundError('Student profile not found');
            }
            const user = req.user;
            if (user.role === 'INSTITUTION_SPOC') {
                const inst = await Institution_1.default.findOne({
                    $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
                    isDeleted: { $ne: true }
                });
                if (!inst || profile.institutionId.toString() !== inst._id.toString()) {
                    throw new AppError_1.AuthorizationError('Forbidden: You can only verify students from your own institution');
                }
            }
            const studentUser = await User_1.default.findById(profile.userId);
            if (!studentUser) {
                throw new AppError_1.NotFoundError('Student user account not found');
            }
            studentUser.isVerified = status === 'VERIFIED';
            await studentUser.save();
            (0, response_1.sendResponse)({
                res,
                message: `Student account verification updated to ${status}`,
                data: {
                    id: profile._id,
                    name: studentUser.name,
                    email: studentUser.email,
                    verificationStatus: studentUser.isVerified ? 'VERIFIED' : 'PENDING'
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
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
