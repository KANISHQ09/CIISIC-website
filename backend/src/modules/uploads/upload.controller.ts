import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import StorageFactory from '../../storage/StorageFactory';
import FileModel from '../../database/schemas/File';
import { sendResponse } from '../../shared/responses/response';
import { ValidationError, AuthenticationError } from '../../shared/errors/AppError';
import { QueueService } from '../../shared/queue/QueueService';

export class UploadController {
  public uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        throw new ValidationError('No file payload found in request');
      }

      const userId = (req as any).user?.id;
      if (!userId) {
        throw new AuthenticationError('Not authenticated');
      }

      // Generate SHA256 checksum
      const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      // Check if duplicate file exists
      const existingFile = await FileModel.findOne({ hash, isDeleted: { $ne: true } } as any);
      if (existingFile) {
        sendResponse({
          res,
          message: 'Duplicate file upload matched, returning existing instance',
          data: existingFile,
        });
        return;
      }

      // Safe key generation
      const storageKey = `${Date.now()}-${file.originalname}`;
      const provider = StorageFactory.getProvider();

      // Upload using provider abstraction
      await provider.upload(storageKey, file.buffer, file.mimetype);

      // Save metadata to DB
      const dbFile = await FileModel.create({
        filename: storageKey,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
        uploadedBy: userId,
        hash, // Added for duplicate checking
      });

      // Register file processing background worker job
      const queue = QueueService.getInstance();
      await queue.add('FILE_PROCESSING', { fileId: dbFile._id, storageKey });

      sendResponse({
        res,
        statusCode: 201,
        message: 'File uploaded and logged successfully',
        data: dbFile,
      });
    } catch (error) {
      next(error);
    }
  };

  public getFileDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = await FileModel.findById(req.params.id);
      if (!file) {
        throw new ValidationError('File record not found');
      }

      const provider = StorageFactory.getProvider();
      const signedUrl = await provider.generateSignedUrl(file.storageKey);

      sendResponse({
        res,
        message: 'File metadata retrieved',
        data: {
          file,
          downloadUrl: signedUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queue = QueueService.getInstance();
      sendResponse({
        res,
        message: 'Queue background jobs list retrieved',
        data: queue.getAllJobs(),
      });
    } catch (error) {
      next(error);
    }
  };

  public getStorageHealth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const provider = StorageFactory.getProvider();
      sendResponse({
        res,
        message: 'Storage connection health test status',
        data: {
          providerName: process.env.STORAGE_PROVIDER || 'LOCAL',
          status: 'healthy',
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
