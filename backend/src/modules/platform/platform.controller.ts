import { Request, Response, NextFunction } from 'express';
import {
  CMSService,
  SettingsService,
  AnnouncementService,
  ResourceService,
} from './platform.services';
import { sendResponse } from '../../shared/responses/response';
import mongoose from 'mongoose';
import PlatformPermissionModel from '../../database/schemas/PlatformPermission';
import ContactMessageModel from '../../database/schemas/ContactMessage';

export class PlatformController {
  // CMS Endpoints
  public getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = await CMSService.getPageBySlug(req.params.slug);
      sendResponse({ res, message: 'CMS Page content retrieved', data: page });
    } catch (error) {
      next(error);
    }
  };

  public updatePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = await CMSService.updatePage(req.params.slug, req.body);
      sendResponse({ res, message: 'CMS Page updated successfully', data: page });
    } catch (error) {
      next(error);
    }
  };

  // Settings Endpoints
  public getSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const setting = await SettingsService.getSetting(req.params.key);
      sendResponse({ res, message: 'Branding config settings retrieved', data: setting });
    } catch (error) {
      next(error);
    }
  };

  public updateSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { value, category } = req.body;
      const setting = await SettingsService.updateSetting(
        req.params.key,
        value,
        category || 'BRANDING',
      );
      sendResponse({ res, message: 'Settings parameter updated successfully', data: setting });
    } catch (error) {
      next(error);
    }
  };

  // Announcements Endpoints
  public getAnnouncements = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const role = (req as any).user?.role;
      const list = await AnnouncementService.getAnnouncements(role);
      sendResponse({ res, message: 'Announcements bulletin retrieved', data: list });
    } catch (error) {
      next(error);
    }
  };

  public createAnnouncement = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const announcement = await AnnouncementService.createAnnouncement(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Announcement created successfully',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  };

  // Resources Endpoints
  public getResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await ResourceService.getResources();
      sendResponse({ res, message: 'Resource library files list retrieved', data: list });
    } catch (error) {
      next(error);
    }
  };

  public createResource = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const resource = await ResourceService.createResource(req.body);
      sendResponse({
        res,
        statusCode: 201,
        message: 'Resource item created successfully',
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  };

  // Platform Operations & Health
  public getPlatformHealth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const mongoStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'degraded';
      sendResponse({
        res,
        message: 'Platform infrastructure status check',
        data: {
          uptime: process.uptime(),
          status: 'operational',
          services: {
            database: mongoStatus,
            cache: 'healthy',
            workers: 'healthy',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getReadiness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isReady = mongoose.connection.readyState === 1;
      if (isReady) {
        sendResponse({ res, message: 'Platform readiness status: ready', data: { ready: true } });
      } else {
        res
          .status(503)
          .json({ success: false, message: 'Platform not ready', data: { ready: false } });
      }
    } catch (error) {
      next(error);
    }
  };

  public getLiveness = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendResponse({ res, message: 'Platform liveness status: alive', data: { alive: true } });
    } catch (error) {
      next(error);
    }
  };

  public getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await PlatformPermissionModel.find({});
      if (list.length === 0) {
        const defaults = [
          { key: 'submit_proposal', label: 'Upload Solution Proposals', allowedRoles: ['STUDENT', 'SUPER_ADMIN'] },
          { key: 'create_challenge', label: 'Create Corporate Challenge Statement', allowedRoles: ['INDUSTRY_SPOC', 'SUPER_ADMIN'] },
          { key: 'evaluate_solution', label: 'Evaluate & Score Solution Sheets', allowedRoles: ['INDUSTRY_SPOC', 'REVIEWER', 'SUPER_ADMIN'] },
          { key: 'verify_student', label: 'Verify Registrant Enrollment Accounts', allowedRoles: ['INSTITUTION_SPOC', 'SUPER_ADMIN'] },
          { key: 'view_audit_logs', label: 'View Immutable Audit Timeline Logs', allowedRoles: ['SUPER_ADMIN'] }
        ];
        const created = await PlatformPermissionModel.insertMany(defaults);
        sendResponse({ res, message: 'Platform permission definitions retrieved', data: created });
        return;
      }
      sendResponse({ res, message: 'Platform permission definitions retrieved', data: list });
    } catch (error) {
      next(error);
    }
  };

  public updatePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { key } = req.params;
      const { allowedRoles } = req.body;
      const perm = await PlatformPermissionModel.findOneAndUpdate(
        { key },
        { allowedRoles },
        { new: true, upsert: true }
      );
      sendResponse({ res, message: 'Platform permission updated successfully', data: perm });
    } catch (error) {
      next(error);
    }
  };

  public submitContactForm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, subject, message } = req.body;
      const msg = await ContactMessageModel.create({ name, email, subject, message });
      sendResponse({ res, message: 'Contact message submitted successfully', data: msg });
    } catch (error) {
      next(error);
    }
  };
}
