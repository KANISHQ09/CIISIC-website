import { Types } from 'mongoose';
import CMSPageModel, { ICMSPage } from '../../database/schemas/CMSPage';
import SettingsModel, { ISettings } from '../../database/schemas/Settings';
import AnnouncementModel, { IAnnouncement } from '../../database/schemas/Announcement';
import ResourceModel, { IResource } from '../../database/schemas/Resource';
import { NotFoundError } from '../../shared/errors/AppError';

// 1. CMSService
export class CMSService {
  public static async getPageBySlug(slug: string): Promise<ICMSPage> {
    const page = await CMSPageModel.findOne({ slug, isPublished: true });
    if (!page) {
      throw new NotFoundError(`CMS Page with slug ${slug} not found`);
    }
    return page;
  }

  public static async updatePage(slug: string, data: Partial<ICMSPage>): Promise<ICMSPage> {
    let page = await CMSPageModel.findOne({ slug });
    if (!page) {
      page = new CMSPageModel({ slug, ...data });
    } else {
      Object.assign(page, data);
    }
    await page.save();
    return page;
  }
}

// 2. SettingsService
export class SettingsService {
  public static async getSetting(key: string): Promise<ISettings> {
    const setting = await SettingsModel.findOne({ key });
    if (!setting) {
      throw new NotFoundError(`Setting key ${key} not found`);
    }
    return setting;
  }

  public static async updateSetting(key: string, value: any, category: string): Promise<ISettings> {
    let setting = await SettingsModel.findOne({ key });
    if (!setting) {
      setting = new SettingsModel({ key, value, category });
    } else {
      setting.value = value;
    }
    await setting.save();
    return setting;
  }
}

// 3. AnnouncementService
export class AnnouncementService {
  public static async getAnnouncements(role?: string): Promise<IAnnouncement[]> {
    const filter: any = { isPublished: true };
    if (role) {
      filter.targetRoles = { $in: [role, 'ALL'] };
    }
    return AnnouncementModel.find(filter).sort({ isPinned: -1, createdAt: -1 }).exec();
  }

  public static async createAnnouncement(data: any): Promise<IAnnouncement> {
    return AnnouncementModel.create(data);
  }
}

// 4. ResourceService
export class ResourceService {
  public static async getResources(): Promise<IResource[]> {
    return ResourceModel.find({ isDeleted: { $ne: true } })
      .populate('fileId')
      .exec();
  }

  public static async createResource(data: any): Promise<IResource> {
    return ResourceModel.create(data);
  }
}
