import { Request, Response, NextFunction } from 'express';
import { CompanyService } from './company.service';
import { sendResponse } from '../../shared/responses/response';
import CompanyModel from '../../database/schemas/Company';
import { NotFoundError } from '../../shared/errors/AppError';

export class CompanyController {
  private readonly companyService: CompanyService;

  constructor() {
    this.companyService = new CompanyService();
  }

  public getMyCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const company = await CompanyModel.findOne({ industrySpocs: user.id, isDeleted: { $ne: true } });
      if (!company) {
        throw new NotFoundError('No company associated with this account');
      }
      sendResponse({
        res,
        message: 'My company profile retrieved successfully',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comps = await this.companyService.getCompanies();
      sendResponse({
        res,
        message: 'Companies list retrieved successfully',
        data: comps,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCompanyById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const comp = await this.companyService.getCompanyById(req.params.id);
      sendResponse({
        res,
        message: 'Company profile retrieved successfully',
        data: comp,
      });
    } catch (error) {
      next(error);
    }
  };

  public createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comp = await this.companyService.createCompany(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Company profile created successfully',
        data: comp,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comp = await this.companyService.updateCompany(req.params.id, req.body);
      sendResponse({
        res,
        message: 'Company profile updated successfully',
        data: comp,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.body.status;
      const comp = await this.companyService.verifyCompany(req.params.id, status);
      sendResponse({
        res,
        message: `Company profile marked as ${status} successfully`,
        data: comp,
      });
    } catch (error) {
      next(error);
    }
  };
}
