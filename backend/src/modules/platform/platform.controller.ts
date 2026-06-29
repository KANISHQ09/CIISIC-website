import { Request, Response, NextFunction } from 'express';
import {
  CMSService,
  SettingsService,
  AnnouncementService,
  ResourceService,
} from './platform.services';
import { sendResponse } from '../../shared/responses/response';
import mongoose from 'mongoose';

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
}
