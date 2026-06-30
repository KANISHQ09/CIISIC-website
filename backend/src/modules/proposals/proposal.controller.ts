import { Request, Response, NextFunction } from 'express';
import { ProposalService } from './proposal.service';
import { sendResponse } from '../../shared/responses/response';
import { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } from '../../shared/errors/AppError';
import ActivityLogModel from '../../database/schemas/ActivityLog';
import ProposalModel from '../../database/schemas/Proposal';
import UserModel from '../../database/schemas/User';
import CompanyModel from '../../database/schemas/Company';
import InstitutionModel from '../../database/schemas/Institution';
import mongoose from 'mongoose';

export class ProposalController {
  private readonly proposalService: ProposalService;

  constructor() {
    this.proposalService = new ProposalService();
  }

  public getProposals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const filter: any = { isDeleted: { $ne: true } };
      if (user.role === 'STUDENT') {
        filter.solverId = user.id;
      } else if (user.role === 'INDUSTRY_SPOC') {
        const company = await CompanyModel.findOne({ industrySpocs: user.id });
        if (company) {
          filter.companyId = company._id;
        } else {
          filter.companyId = new mongoose.Types.ObjectId(); // force empty if no company
        }
      } else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
        const inst = await InstitutionModel.findOne({
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (inst) {
          filter.institutionId = inst._id;
        } else if (user.role === 'REVIEWER') {
          filter.reviewerId = user.id;
        } else {
          filter.institutionId = new mongoose.Types.ObjectId();
        }
      }

      const proposals = await this.proposalService.getProposals(filter);
      
      // Anonymize if user is reviewer
      const sanitized = proposals.map((p: any) => {
        const pObj = p.toObject() as any;
        if (user.role === 'REVIEWER') {
          pObj.solverId = undefined;
          if (pObj.studentName) pObj.studentName = 'Anonymized Solver';
        }
        return pObj;
      });

      sendResponse({
        res,
        message: 'Proposals list retrieved successfully',
        data: sanitized,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProposalById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await this.proposalService.getProposalById(req.params.id);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      // Enforce data isolation / RBAC logic
      let hasAccess = false;
      if (user.role === 'SUPER_ADMIN') {
        hasAccess = true;
      } else if (user.role === 'STUDENT' && proposal.solverId._id.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'REVIEWER' && proposal.reviewerId?._id.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'INDUSTRY_SPOC') {
        const company = await CompanyModel.findOne({ _id: proposal.companyId._id, industrySpocs: user.id });
        if (company) hasAccess = true;
      } else if (user.role === 'INSTITUTION_SPOC') {
        const inst = await InstitutionModel.findOne({
          _id: proposal.institutionId._id,
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (inst) hasAccess = true;
      }

      if (!hasAccess) {
        throw new AuthorizationError('Forbidden: Access is denied to this proposal');
      }

      const proposalObj = proposal.toObject() as any;
      if (user.role === 'REVIEWER') {
        proposalObj.solverId = undefined;
        proposalObj.studentName = 'Anonymized Solver';
      }

      sendResponse({
        res,
        message: 'Proposal details retrieved successfully',
        data: proposalObj,
      });
    } catch (error) {
      next(error);
    }
  };

  public createDraft = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Student Solver';
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await this.proposalService.createDraft(req.body, userId, userName);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Proposal draft created successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public submitProposal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Student Solver';
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await ProposalModel.findById(req.params.id);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      if (proposal.solverId.toString() !== userId) {
        throw new AuthorizationError('Forbidden: You can only submit your own proposals');
      }

      const updated = await this.proposalService.submitProposal(req.params.id, userId, userName);
      sendResponse({
        res,
        message: 'Proposal submitted successfully for institutional verification',
        data: updated,
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
      const { isApproved, comments } = req.body;
      if (isApproved === undefined) {
        throw new ValidationError('isApproved flag is required');
      }

      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await ProposalModel.findById(req.params.id);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      if (user.role !== 'SUPER_ADMIN') {
        const inst = await InstitutionModel.findOne({
          _id: proposal.institutionId,
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (!inst) {
          throw new AuthorizationError('Forbidden: You are not authorized to verify this proposal');
        }
      }

      const updated = await this.proposalService.verifyInstitution(
        req.params.id,
        isApproved,
        comments || '',
        user.id,
        user.name,
      );
      sendResponse({
        res,
        message: `Proposal marked as institutionally verified: ${isApproved}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  public assignReviewer = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { reviewerId } = req.body;
      if (!reviewerId) {
        throw new ValidationError('reviewerId is required');
      }

      const userId = (req as any).user?.id;
      const userName = (req as any).user?.name || 'Admin';

      const proposal = await this.proposalService.assignReviewer(
        req.params.id,
        reviewerId,
        userId,
        userName,
      );
      sendResponse({
        res,
        message: 'Reviewer allocated to evaluate proposal successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };

  public companyDecision = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { decision, comments } = req.body;
      if (!decision) {
        throw new ValidationError('decision is required');
      }

      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await ProposalModel.findById(req.params.id);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      if (user.role !== 'SUPER_ADMIN') {
        const company = await CompanyModel.findOne({ _id: proposal.companyId, industrySpocs: user.id });
        if (!company) {
          throw new AuthorizationError('Forbidden: You are not authorized to make decisions on this proposal');
        }
      }

      const updated = await this.proposalService.companyDecision(
        req.params.id,
        decision,
        comments || '',
        user.id,
        user.name,
      );
      sendResponse({
        res,
        message: `Company decision updated to ${decision} successfully`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await ProposalModel.findById(req.params.id || req.params.proposalId);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      let hasAccess = false;
      if (user.role === 'SUPER_ADMIN') {
        hasAccess = true;
      } else if (user.role === 'STUDENT' && proposal.solverId.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'REVIEWER' && proposal.reviewerId?.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'INDUSTRY_SPOC') {
        const company = await CompanyModel.findOne({ _id: proposal.companyId, industrySpocs: user.id });
        if (company) hasAccess = true;
      } else if (user.role === 'INSTITUTION_SPOC') {
        const inst = await InstitutionModel.findOne({
          _id: proposal.institutionId,
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (inst) hasAccess = true;
      }

      if (!hasAccess) {
        throw new AuthorizationError('Forbidden: Access is denied to this timeline');
      }

      const logs = await ActivityLogModel.find({ 'metadata.proposalId': req.params.proposalId || req.params.id })
        .sort({ createdAt: 1 })
        .exec();
      sendResponse({
        res,
        message: 'Proposal activity timeline log history retrieved',
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const filter: any = { isDeleted: { $ne: true } };
      if (user.role === 'STUDENT') {
        filter.solverId = user.id;
      } else if (user.role === 'INDUSTRY_SPOC') {
        const company = await CompanyModel.findOne({ industrySpocs: user.id });
        if (company) filter.companyId = company._id;
      } else if (user.role === 'INSTITUTION_SPOC' || user.role === 'REVIEWER') {
        const inst = await InstitutionModel.findOne({
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (inst) {
          filter.institutionId = inst._id;
        } else if (user.role === 'REVIEWER') {
          filter.reviewerId = user.id;
        }
      }

      const total = await ProposalModel.countDocuments(filter).exec();
      const accepted = await ProposalModel.countDocuments({ ...filter, status: 'ACCEPTED' }).exec();
      const rejected = await ProposalModel.countDocuments({ ...filter, status: 'REJECTED' }).exec();
      const pending = await ProposalModel.countDocuments({ ...filter, status: 'SUBMITTED' }).exec();

      sendResponse({
        res,
        message: 'Proposal analytics aggregated successfully',
        data: {
          totalProposalsCount: total,
          acceptedProposalsCount: accepted,
          rejectedProposalsCount: rejected,
          pendingProposalsCount: pending,
          acceptanceRatePercentage: total > 0 ? Math.round((accepted / total) * 100) : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { content } = req.body;
      if (!content) {
        throw new ValidationError('content is required');
      }

      const user = (req as any).user;
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }

      const proposal = await ProposalModel.findById(req.params.id);
      if (!proposal) {
        throw new NotFoundError('Proposal not found');
      }

      let hasAccess = false;
      if (user.role === 'SUPER_ADMIN') {
        hasAccess = true;
      } else if (user.role === 'STUDENT' && proposal.solverId.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'REVIEWER' && proposal.reviewerId?.toString() === user.id) {
        hasAccess = true;
      } else if (user.role === 'INDUSTRY_SPOC') {
        const company = await CompanyModel.findOne({ _id: proposal.companyId, industrySpocs: user.id });
        if (company) hasAccess = true;
      } else if (user.role === 'INSTITUTION_SPOC') {
        const inst = await InstitutionModel.findOne({
          _id: proposal.institutionId,
          $or: [{ primarySpoc: user.id }, { facultyMembers: user.id }]
        });
        if (inst) hasAccess = true;
      }

      if (!hasAccess) {
        throw new AuthorizationError('Forbidden: Access is denied to comment on this proposal');
      }

      proposal.comments.push({
        authorName: user.name,
        authorRole: user.role === 'STUDENT' ? 'Student' : user.role,
        content,
        createdAt: new Date(),
      });

      await proposal.save();

      sendResponse({
        res,
        message: 'Comment posted successfully',
        data: proposal,
      });
    } catch (error) {
      next(error);
    }
  };
}
