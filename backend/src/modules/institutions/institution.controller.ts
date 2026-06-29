import { Request, Response, NextFunction } from 'express';
import { InstitutionService } from './institution.service';
import { sendResponse } from '../../shared/responses/response';

export class InstitutionController {
  private readonly institutionService: InstitutionService;

  constructor() {
    this.institutionService = new InstitutionService();
  }

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
