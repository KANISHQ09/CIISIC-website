"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const Challenge_1 = __importDefault(require("../../database/schemas/Challenge"));
const Institution_1 = __importDefault(require("../../database/schemas/Institution"));
const Company_1 = __importDefault(require("../../database/schemas/Company"));
const response_1 = require("../../shared/responses/response");
class SearchController {
    search = async (req, res, next) => {
        try {
            const query = req.query.query;
            const type = req.query.type; // 'challenges' | 'institutions' | 'companies' | 'all'
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const regex = new RegExp(query, 'i');
            const results = {};
            if (!type || type === 'all' || type === 'challenges') {
                results.challenges = await Challenge_1.default.find({
                    isDeleted: { $ne: true },
                    $or: [{ title: regex }, { description: regex }, { tags: { $in: [regex] } }],
                })
                    .skip(skip)
                    .limit(limit)
                    .exec();
            }
            if (!type || type === 'all' || type === 'institutions') {
                results.institutions = await Institution_1.default.find({
                    isDeleted: { $ne: true },
                    $or: [{ name: regex }, { location: regex }, { code: regex }],
                })
                    .skip(skip)
                    .limit(limit)
                    .exec();
            }
            if (!type || type === 'all' || type === 'companies') {
                results.companies = await Company_1.default.find({
                    isDeleted: { $ne: true },
                    $or: [{ name: regex }, { industry: regex }],
                })
                    .skip(skip)
                    .limit(limit)
                    .exec();
            }
            (0, response_1.sendResponse)({
                res,
                message: 'Search query processed successfully',
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.SearchController = SearchController;
