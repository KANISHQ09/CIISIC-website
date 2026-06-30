import { Request, Response, NextFunction } from 'express';
import { InstitutionService } from './institution.service';
import { sendResponse } from '../../shared/responses/response';
import InstitutionModel from '../../database/schemas/Institution';
import StudentProfileModel from '../../database/schemas/StudentProfile';
import UserModel from '../../database/schemas/User';
import { NotFoundError, AuthorizationError } from '../../shared/errors/AppError';

export class InstitutionController {
  private readonly institutionService: InstitutionService;

  constructor() {
    this.institutionService = new InstitutionService();
  }

  public getMyInstitution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const inst = await InstitutionModel.findOne({
        $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
        isDeleted: { $ne: true }
      });
      if (!inst) {
        throw new NotFoundError('No institution associated with this account');
      }
      sendResponse({
        res,
        message: 'My institution profile retrieved successfully',
        data: inst,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFaculty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const inst = await InstitutionModel.findOne({
        $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
        isDeleted: { $ne: true }
      });
      if (!inst) {
        throw new NotFoundError('No institution associated with this account');
      }

      const faculty = await UserModel.find({
        _id: { $in: inst.facultyMembers },
        isDeleted: { $ne: true }
      }).select('-passwordHash');

      sendResponse({
        res,
        message: 'Faculty members list retrieved successfully',
        data: faculty,
      });
    } catch (error) {
      next(error);
    }
  };

  public getStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const inst = await InstitutionModel.findOne({
        $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
        isDeleted: { $ne: true }
      });
      if (!inst) {
        throw new NotFoundError('No institution associated with this account');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [profiles, totalDocs] = await Promise.all([
        StudentProfileModel.find({ institutionId: inst._id, isDeleted: { $ne: true } })
          .populate('userId', '-passwordHash')
          .skip(skip)
          .limit(limit)
          .exec(),
        StudentProfileModel.countDocuments({ institutionId: inst._id, isDeleted: { $ne: true } })
      ]);

      const data = profiles.map((p: any) => ({
        id: p._id,
        userId: p.userId?._id,
        name: p.userId?.name || '',
        email: p.userId?.email || '',
        enrollmentNo: p.enrollmentNo,
        department: p.department,
        yearOfStudy: p.yearOfStudy,
        verificationStatus: p.userId?.isVerified ? 'VERIFIED' : 'PENDING'
      }));

      sendResponse({
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
    } catch (error) {
      next(error);
    }
  };

  public verifyStudent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentProfileId = req.params.id;
      const { status } = req.body;

      const profile = await StudentProfileModel.findOne({ _id: studentProfileId, isDeleted: { $ne: true } });
      if (!profile) {
        throw new NotFoundError('Student profile not found');
      }

      const user = (req as any).user;
      if (user.role === 'INSTITUTION_SPOC') {
        const inst = await InstitutionModel.findOne({
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }],
          isDeleted: { $ne: true }
        });
        if (!inst || profile.institutionId.toString() !== inst._id.toString()) {
          throw new AuthorizationError('Forbidden: You can only verify students from your own institution');
        }
      }

      const studentUser = await UserModel.findById(profile.userId);
      if (!studentUser) {
        throw new NotFoundError('Student user account not found');
      }

      studentUser.isVerified = status === 'VERIFIED';
      await studentUser.save();

      sendResponse({
        res,
        message: `Student account verification updated to ${status}`,
        data: {
          id: profile._id,
          name: studentUser.name,
          email: studentUser.email,
          verificationStatus: studentUser.isVerified ? 'VERIFIED' : 'PENDING'
        }
      });
    } catch (error) {
      next(error);
    }
  };

  public getInstitutions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const insts = await this.institutionService.getInstitutions();
      sendResponse({
        res,
        message: 'Institutions list retrieved successfully',
        data: insts,
      });
    } catch (error) {
      next(error);
    }
  };

  public getInstitutionById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const inst = await this.institutionService.getInstitutionById(req.params.id);
      sendResponse({
        res,
        message: 'Institution profile retrieved successfully',
        data: inst,
      });
    } catch (error) {
      next(error);
    }
  };

  public createInstitution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const inst = await this.institutionService.createInstitution(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Institution profile created successfully',
        data: inst,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateInstitution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const inst = await this.institutionService.updateInstitution(req.params.id, req.body);
      sendResponse({
        res,
        message: 'Institution profile updated successfully',
        data: inst,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyInstitution = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const status = req.body.status;
      const inst = await this.institutionService.verifyInstitution(req.params.id, status);
      sendResponse({
        res,
        message: `Institution profile marked as ${status} successfully`,
        data: inst,
      });
    } catch (error) {
      next(error);
    }
  };
}
