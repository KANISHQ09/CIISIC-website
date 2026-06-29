"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = exports.AnnouncementService = exports.SettingsService = exports.CMSService = void 0;
const CMSPage_1 = __importDefault(require("../../database/schemas/CMSPage"));
const Settings_1 = __importDefault(require("../../database/schemas/Settings"));
const Announcement_1 = __importDefault(require("../../database/schemas/Announcement"));
const Resource_1 = __importDefault(require("../../database/schemas/Resource"));
const AppError_1 = require("../../shared/errors/AppError");
// 1. CMSService
class CMSService {
    static async getPageBySlug(slug) {
        const page = await CMSPage_1.default.findOne({ slug, isPublished: true });
        if (!page) {
            throw new AppError_1.NotFoundError(`CMS Page with slug ${slug} not found`);
        }
        return page;
    }
    static async updatePage(slug, data) {
        let page = await CMSPage_1.default.findOne({ slug });
        if (!page) {
            page = new CMSPage_1.default({ slug, ...data });
        }
        else {
            Object.assign(page, data);
        }
        await page.save();
        return page;
    }
}
exports.CMSService = CMSService;
// 2. SettingsService
class SettingsService {
    static async getSetting(key) {
        const setting = await Settings_1.default.findOne({ key });
        if (!setting) {
            throw new AppError_1.NotFoundError(`Setting key ${key} not found`);
        }
        return setting;
    }
    static async updateSetting(key, value, category) {
        let setting = await Settings_1.default.findOne({ key });
        if (!setting) {
            setting = new Settings_1.default({ key, value, category });
        }
        else {
            setting.value = value;
        }
        await setting.save();
        return setting;
    }
}
exports.SettingsService = SettingsService;
// 3. AnnouncementService
class AnnouncementService {
    static async getAnnouncements(role) {
        const filter = { isPublished: true };
        if (role) {
            filter.targetRoles = { $in: [role, 'ALL'] };
        }
        return Announcement_1.default.find(filter).sort({ isPinned: -1, createdAt: -1 }).exec();
    }
    static async createAnnouncement(data) {
        return Announcement_1.default.create(data);
    }
}
exports.AnnouncementService = AnnouncementService;
// 4. ResourceService
class ResourceService {
    static async getResources() {
        return Resource_1.default.find({ isDeleted: { $ne: true } })
            .populate('fileId')
            .exec();
    }
    static async createResource(data) {
        return Resource_1.default.create(data);
    }
}
exports.ResourceService = ResourceService;
