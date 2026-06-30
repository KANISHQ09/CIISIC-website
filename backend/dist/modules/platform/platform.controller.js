"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformController = void 0;
const platform_services_1 = require("./platform.services");
const response_1 = require("../../shared/responses/response");
const mongoose_1 = __importDefault(require("mongoose"));
const PlatformPermission_1 = __importDefault(require("../../database/schemas/PlatformPermission"));
const ContactMessage_1 = __importDefault(require("../../database/schemas/ContactMessage"));
class PlatformController {
    // CMS Endpoints
    getPage = async (req, res, next) => {
        try {
            const page = await platform_services_1.CMSService.getPageBySlug(req.params.slug);
            (0, response_1.sendResponse)({ res, message: 'CMS Page content retrieved', data: page });
        }
        catch (error) {
            next(error);
        }
    };
    updatePage = async (req, res, next) => {
        try {
            const page = await platform_services_1.CMSService.updatePage(req.params.slug, req.body);
            (0, response_1.sendResponse)({ res, message: 'CMS Page updated successfully', data: page });
        }
        catch (error) {
            next(error);
        }
    };
    // Settings Endpoints
    getSetting = async (req, res, next) => {
        try {
            const setting = await platform_services_1.SettingsService.getSetting(req.params.key);
            (0, response_1.sendResponse)({ res, message: 'Branding config settings retrieved', data: setting });
        }
        catch (error) {
            next(error);
        }
    };
    updateSetting = async (req, res, next) => {
        try {
            const { value, category } = req.body;
            const setting = await platform_services_1.SettingsService.updateSetting(req.params.key, value, category || 'BRANDING');
            (0, response_1.sendResponse)({ res, message: 'Settings parameter updated successfully', data: setting });
        }
        catch (error) {
            next(error);
        }
    };
    // Announcements Endpoints
    getAnnouncements = async (req, res, next) => {
        try {
            const role = req.user?.role;
            const list = await platform_services_1.AnnouncementService.getAnnouncements(role);
            (0, response_1.sendResponse)({ res, message: 'Announcements bulletin retrieved', data: list });
        }
        catch (error) {
            next(error);
        }
    };
    createAnnouncement = async (req, res, next) => {
        try {
            const announcement = await platform_services_1.AnnouncementService.createAnnouncement(req.body);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Announcement created successfully',
                data: announcement,
            });
        }
        catch (error) {
            next(error);
        }
    };
    // Resources Endpoints
    getResources = async (req, res, next) => {
        try {
            const list = await platform_services_1.ResourceService.getResources();
            (0, response_1.sendResponse)({ res, message: 'Resource library files list retrieved', data: list });
        }
        catch (error) {
            next(error);
        }
    };
    createResource = async (req, res, next) => {
        try {
            const resource = await platform_services_1.ResourceService.createResource(req.body);
            (0, response_1.sendResponse)({
                res,
                statusCode: 201,
                message: 'Resource item created successfully',
                data: resource,
            });
        }
        catch (error) {
            next(error);
        }
    };
    // Platform Operations & Health
    getPlatformHealth = async (req, res, next) => {
        try {
            const mongoStatus = mongoose_1.default.connection.readyState === 1 ? 'healthy' : 'degraded';
            (0, response_1.sendResponse)({
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
        }
        catch (error) {
            next(error);
        }
    };
    getReadiness = async (req, res, next) => {
        try {
            const isReady = mongoose_1.default.connection.readyState === 1;
            if (isReady) {
                (0, response_1.sendResponse)({ res, message: 'Platform readiness status: ready', data: { ready: true } });
            }
            else {
                res
                    .status(503)
                    .json({ success: false, message: 'Platform not ready', data: { ready: false } });
            }
        }
        catch (error) {
            next(error);
        }
    };
    getLiveness = async (req, res, next) => {
        try {
            (0, response_1.sendResponse)({ res, message: 'Platform liveness status: alive', data: { alive: true } });
        }
        catch (error) {
            next(error);
        }
    };
    getPermissions = async (req, res, next) => {
        try {
            const list = await PlatformPermission_1.default.find({});
            if (list.length === 0) {
                const defaults = [
                    { key: 'submit_proposal', label: 'Upload Solution Proposals', allowedRoles: ['STUDENT', 'SUPER_ADMIN'] },
                    { key: 'create_challenge', label: 'Create Corporate Challenge Statement', allowedRoles: ['INDUSTRY_SPOC', 'SUPER_ADMIN'] },
                    { key: 'evaluate_solution', label: 'Evaluate & Score Solution Sheets', allowedRoles: ['INDUSTRY_SPOC', 'REVIEWER', 'SUPER_ADMIN'] },
                    { key: 'verify_student', label: 'Verify Registrant Enrollment Accounts', allowedRoles: ['INSTITUTION_SPOC', 'SUPER_ADMIN'] },
                    { key: 'view_audit_logs', label: 'View Immutable Audit Timeline Logs', allowedRoles: ['SUPER_ADMIN'] }
                ];
                const created = await PlatformPermission_1.default.insertMany(defaults);
                (0, response_1.sendResponse)({ res, message: 'Platform permission definitions retrieved', data: created });
                return;
            }
            (0, response_1.sendResponse)({ res, message: 'Platform permission definitions retrieved', data: list });
        }
        catch (error) {
            next(error);
        }
    };
    updatePermission = async (req, res, next) => {
        try {
            const { key } = req.params;
            const { allowedRoles } = req.body;
            const perm = await PlatformPermission_1.default.findOneAndUpdate({ key }, { allowedRoles }, { new: true, upsert: true });
            (0, response_1.sendResponse)({ res, message: 'Platform permission updated successfully', data: perm });
        }
        catch (error) {
            next(error);
        }
    };
    submitContactForm = async (req, res, next) => {
        try {
            const { name, email, subject, message } = req.body;
            const msg = await ContactMessage_1.default.create({ name, email, subject, message });
            (0, response_1.sendResponse)({ res, message: 'Contact message submitted successfully', data: msg });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.PlatformController = PlatformController;
