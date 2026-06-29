import { Request, Response, NextFunction } from 'express';
import { CellService } from './cell.service';
import { sendResponse } from '../../shared/responses/response';

export class CellController {
  private readonly cellService: CellService;

  constructor() {
    this.cellService = new CellService();
  }

  public getCells = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cells = await this.cellService.getAllCells();
      sendResponse({
        res,
        message: 'Excellence cells retrieved successfully',
        data: cells,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCellById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cell = await this.cellService.getCellById(req.params.id);
      sendResponse({
        res,
        message: 'Excellence cell retrieved successfully',
        data: cell,
      });
    } catch (error) {
      next(error);
    }
  };

  public createCell = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cell = await this.cellService.createCell(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Excellence cell created successfully',
        data: cell,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCell = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cell = await this.cellService.updateCell(req.params.id, req.body);
      sendResponse({
        res,
        message: 'Excellence cell updated successfully',
        data: cell,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCell = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.cellService.deleteCell(req.params.id);
      sendResponse({
        res,
        message: 'Excellence cell deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
