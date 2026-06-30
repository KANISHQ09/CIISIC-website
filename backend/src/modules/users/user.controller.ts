import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../shared/responses/response';
import { RegisterUserSchema } from './user.dto';
import { ValidationError, AuthenticationError } from '../../shared/errors/AppError';
import StudentProfileModel from '../../database/schemas/StudentProfile';
import UserModel from '../../database/schemas/User';
import CompanyModel from '../../database/schemas/Company';
import InstitutionModel from '../../database/schemas/Institution';
import AuditLogModel from '../../database/schemas/AuditLog';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = RegisterUserSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const existing = await UserModel.findOne({ email: parsed.data.email });
      if (existing) {
        throw new ValidationError('Email is already registered');
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(parsed.data.password, salt);

      const user = await UserModel.create({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
        isVerified: true, // Pre-verified when created by Admin
      });

      if (user.role === 'STUDENT') {
        await StudentProfileModel.create({
          userId: user._id,
          enrollmentNo: parsed.data.profileData?.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
          institutionId: parsed.data.profileData?.institutionId || new mongoose.Types.ObjectId(),
          department: parsed.data.profileData?.department || 'Computer Science',
          yearOfStudy: parsed.data.profileData?.yearOfStudy || 1,
        });
      } else if (user.role === 'INDUSTRY_SPOC') {
        if (parsed.data.profileData?.companyId) {
          await CompanyModel.findByIdAndUpdate(parsed.data.profileData.companyId, {
            $addToSet: { industrySpocs: user._id }
          });
        }
      } else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
        if (parsed.data.profileData?.institutionId) {
          if (user.role === 'INSTITUTION_SPOC') {
            await InstitutionModel.findByIdAndUpdate(parsed.data.profileData.institutionId, {
              primarySpoc: user._id
            });
          } else {
            await InstitutionModel.findByIdAndUpdate(parsed.data.profileData.institutionId, {
              $addToSet: { facultyMembers: user._id }
            });
          }
        }
      }

      await AuditLogModel.create({
        userId: (req as any).user?.id,
        userName: (req as any).user?.name || 'Super Admin',
        action: 'USER_CREATED_BY_ADMIN',
        description: `Admin created user ${user.email} with role ${user.role}`,
        ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
        category: 'ACCESS',
      });

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role, search } = req.query;
      const filter: any = { isDeleted: { $ne: true } };
      
      if (role && role !== 'ALL') {
        filter.role = role;
      }
      if (search) {
        const regex = new RegExp(search as string, 'i');
        filter.$or = [{ name: regex }, { email: regex }];
      }

      const users = await UserModel.find(filter)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .exec();

      const mappedUsers = await Promise.all(users.map(async (u) => {
        const userObj = u.toObject() as any;
        if (u.role === 'INDUSTRY_SPOC') {
          const comp = await CompanyModel.findOne({ industrySpocs: u._id, isDeleted: { $ne: true } });
          if (comp) userObj.companyId = comp;
        } else if (u.role === 'INSTITUTION_SPOC' || u.role === 'REVIEWER') {
          const inst = await InstitutionModel.findOne({
            $or: [{ primarySpoc: u._id }, { facultyMembers: u._id }],
            isDeleted: { $ne: true }
          });
          if (inst) userObj.institutionId = inst;
        } else if (u.role === 'STUDENT') {
          const studentProfile = await StudentProfileModel.findOne({ userId: u._id, isDeleted: { $ne: true } }).populate('institutionId');
          if (studentProfile) userObj.institutionId = studentProfile.institutionId;
        }
        return userObj;
      }));

      sendResponse({
        res,
        message: 'Users list retrieved successfully',
        data: mappedUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await UserModel.findById(id);
      if (!user) {
        throw new ValidationError('User account not found');
      }

      user.isSuspended = status === 'SUSPENDED';
      await user.save();

      sendResponse({
        res,
        message: `User status set to ${status}`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        throw new ValidationError('User account not found');
      }

      user.isVerified = true;
      await user.save();

      sendResponse({
        res,
        message: 'User account marked as verified',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = RegisterUserSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError('Validation failed', parsed.error.format());
      }

      const user = await this.userService.register(parsed.data);

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }
      const user = await this.userService.getUserById(userId);
      let profileData: any = {};

      if (user.role === 'STUDENT') {
        const studentProfile = await StudentProfileModel.findOne({ userId: user._id })
          .populate('institutionId')
          .exec();
        if (studentProfile) {
          profileData = studentProfile.toObject();
        }
      }

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }
      const { name, profileData } = req.body;

      const user = await this.userService.getUserById(userId);
      if (name) {
        user.name = name;
        await user.save();
      }

      let updatedProfile: any = {};
      if (user.role === 'STUDENT' && profileData) {
        let studentProfile = await StudentProfileModel.findOne({ userId: user._id }).exec();
        if (!studentProfile) {
          studentProfile = new StudentProfileModel({
            userId: user._id,
            enrollmentNo: profileData.enrollmentNo || `CII/ST/${Date.now().toString().slice(-4)}`,
            institutionId: profileData.institutionId || new mongoose.Types.ObjectId(),
            department: profileData.department || 'Computer Science',
            yearOfStudy: profileData.yearOfStudy || 1,
          });
        }

        // Update fields
        if (profileData.skills) studentProfile.skills = profileData.skills;
        if (profileData.projects) studentProfile.projects = profileData.projects;
        if (profileData.education) studentProfile.education = profileData.education;
        if (profileData.resumeUrl) studentProfile.resumeUrl = profileData.resumeUrl;
        if (profileData.resumeName) studentProfile.resumeName = profileData.resumeName;
        if (profileData.portfolioUrl) studentProfile.portfolioUrl = profileData.portfolioUrl;
        if (profileData.socialLinks) studentProfile.socialLinks = profileData.socialLinks;
        if (profileData.points !== undefined) studentProfile.points = profileData.points;
        if (profileData.level !== undefined) studentProfile.level = profileData.level;
        if (profileData.rank !== undefined) studentProfile.rank = profileData.rank;
        if (profileData.completionPercentage !== undefined) {
          studentProfile.completionPercentage = profileData.completionPercentage;
        }

        await studentProfile.save();
        updatedProfile = studentProfile.toObject();
      }

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };
}
