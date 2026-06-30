"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const response_1 = require("../../shared/responses/response");
const user_dto_1 = require("./user.dto");
const AppError_1 = require("../../shared/errors/AppError");
const StudentProfile_1 = __importDefault(require("../../database/schemas/StudentProfile"));
const User_1 = __importDefault(require("../../database/schemas/User"));
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const AuditLog_1 = __importDefault(require("../../database/schemas/AuditLog"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    createUser = async (req, res, next) => {
        try {
            const parsed = user_dto_1.RegisterUserSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            const existing = await User_1.default.findOne({ email: parsed.data.email });
            if (existing) {
                throw new AppError_1.ValidationError('Email is already registered');
            }
            const salt = await bcryptjs_1.default.genSalt(12);
            const passwordHash = await bcryptjs_1.default.hash(parsed.data.password, salt);
            const user = await User_1.default.create({
                name: parsed.data.name,
                email: parsed.data.email,
                passwordHash,
                role: parsed.data.role,
                isVerified: true, // Pre-verified when created by Admin
            });
            if (user.role === 'STUDENT') {
                await StudentProfile_1.default.create({
                    userId: user._id,
                    enrollmentNo: parsed.data.profileData?.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
                    institutionId: parsed.data.profileData?.institutionId || new mongoose_1.default.Types.ObjectId(),
                    department: parsed.data.profileData?.department || 'Computer Science',
                    yearOfStudy: parsed.data.profileData?.yearOfStudy || 1,
                });
            }
            else if (user.role === 'INDUSTRY_SPOC') {
                if (parsed.data.profileData?.companyId) {
                    await Company_1.default.findByIdAndUpdate(parsed.data.profileData.companyId, {
                        $addToSet: { industrySpocs: user._id }
                    });
                }
            }
            else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
                if (parsed.data.profileData?.institutionId) {
                    if (user.role === 'INSTITUTION_SPOC') {
                        await Institution_1.default.findByIdAndUpdate(parsed.data.profileData.institutionId, {
                            primarySpoc: user._id
                        });
                    }
                    else {
                        await Institution_1.default.findByIdAndUpdate(parsed.data.profileData.institutionId, {
                            $addToSet: { facultyMembers: user._id }
                        });
                    }
                }
            }
            await AuditLog_1.default.create({
                userId: req.user?.id,
                userName: req.user?.name || 'Super Admin',
                action: 'USER_CREATED_BY_ADMIN',
                description: `Admin created user ${user.email} with role ${user.role}`,
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
                category: 'ACCESS',
            });
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'User created successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getUsers = async (req, res, next) => {
        try {
            const { role, search } = req.query;
            const filter = { isDeleted: { $ne: true } };
            if (role && role !== 'ALL') {
                filter.role = role;
            }
            if (search) {
                const regex = new RegExp(search, 'i');
                filter.$or = [{ name: regex }, { email: regex }];
            }
            const users = await User_1.default.find(filter)
                .select('-passwordHash')
                .sort({ createdAt: -1 })
                .exec();
            const mappedUsers = await Promise.all(users.map(async (u) => {
                const userObj = u.toObject();
                if (u.role === 'INDUSTRY_SPOC') {
                    const comp = await Company_1.default.findOne({ industrySpocs: u._id, isDeleted: { $ne: true } });
                    if (comp)
                        userObj.companyId = comp;
                }
                else if (u.role === 'INSTITUTION_SPOC' || u.role === 'REVIEWER') {
                    const inst = await Institution_1.default.findOne({
                        $or: [{ primarySpoc: u._id }, { facultyMembers: u._id }],
                        isDeleted: { $ne: true }
                    });
                    if (inst)
                        userObj.institutionId = inst;
                }
                else if (u.role === 'STUDENT') {
                    const studentProfile = await StudentProfile_1.default.findOne({ userId: u._id, isDeleted: { $ne: true } }).populate('institutionId');
                    if (studentProfile)
                        userObj.institutionId = studentProfile.institutionId;
                }
                return userObj;
            }));
            (0, response_1.sendResponse)({
                res,
                message: 'Users list retrieved successfully',
                data: mappedUsers,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateUserStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = await User_1.default.findById(id);
            if (!user) {
                throw new AppError_1.ValidationError('User account not found');
            }
            user.isSuspended = status === 'SUSPENDED';
            await user.save();
            (0, response_1.sendResponse)({
                res,
                message: `User status set to ${status}`,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    verifyUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await User_1.default.findById(id);
            if (!user) {
                throw new AppError_1.ValidationError('User account not found');
            }
            user.isVerified = true;
            await user.save();
            (0, response_1.sendResponse)({
                res,
                message: 'User account marked as verified',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    };
    register = async (req, res, next) => {
        try {
            const parsed = user_dto_1.RegisterUserSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new AppError_1.ValidationError('Validation failed', parsed.error.format());
            }
            const user = await this.userService.register(parsed.data);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'User account registered successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const user = await this.userService.getUserById(userId);
            let profileData = {};
            if (user.role === 'STUDENT') {
                const studentProfile = await StudentProfile_1.default.findOne({ userId: user._id })
                    .populate('institutionId')
                    .exec();
                if (studentProfile) {
                    profileData = studentProfile.toObject();
                }
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Profile details fetched successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileData,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError_1.AuthenticationError('Not authenticated');
            }
            const { name, profileData } = req.body;
            const user = await this.userService.getUserById(userId);
            if (name) {
                user.name = name;
                await user.save();
            }
            let updatedProfile = {};
            if (user.role === 'STUDENT' && profileData) {
                let studentProfile = await StudentProfile_1.default.findOne({ userId: user._id }).exec();
                if (!studentProfile) {
                    studentProfile = new StudentProfile_1.default({
                        userId: user._id,
                        enrollmentNo: profileData.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
                        institutionId: profileData.institutionId || new mongoose_1.default.Types.ObjectId(),
                        department: profileData.department || 'Computer Science',
                        yearOfStudy: profileData.yearOfStudy || 1,
                    });
                }
                // Update fields
                if (profileData.skills)
                    studentProfile.skills = profileData.skills;
                if (profileData.projects)
                    studentProfile.projects = profileData.projects;
                if (profileData.education)
                    studentProfile.education = profileData.education;
                if (profileData.resumeUrl)
                    studentProfile.resumeUrl = profileData.resumeUrl;
                if (profileData.resumeName)
                    studentProfile.resumeName = profileData.resumeName;
                if (profileData.portfolioUrl)
                    studentProfile.portfolioUrl = profileData.portfolioUrl;
                if (profileData.socialLinks)
                    studentProfile.socialLinks = profileData.socialLinks;
                if (profileData.points !== undefined)
                    studentProfile.points = profileData.points;
                if (profileData.level !== undefined)
                    studentProfile.level = profileData.level;
                if (profileData.rank !== undefined)
                    studentProfile.rank = profileData.rank;
                if (profileData.completionPercentage !== undefined) {
                    studentProfile.completionPercentage = profileData.completionPercentage;
                }
                await studentProfile.save();
                updatedProfile = studentProfile.toObject();
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Profile updated successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profileData: updatedProfile,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UserController = UserController;
