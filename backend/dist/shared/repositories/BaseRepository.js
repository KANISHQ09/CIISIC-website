"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const AppError_1 = require("../errors/AppError");
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data, session) {
        try {
            const doc = new this.model(data);
            if (session) {
                await doc.save({ session });
            }
            else {
                await doc.save();
            }
            return doc;
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to create record: ${error.message}`);
        }
    }
    async findById(id) {
        try {
            return await this.model.findOne({ _id: id, isDeleted: { $ne: true } });
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to fetch record by ID: ${error.message}`);
        }
    }
    async findOne(filter) {
        try {
            return await this.model.findOne({ ...filter, isDeleted: { $ne: true } });
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to find record: ${error.message}`);
        }
    }
    async update(id, updateData, session) {
        try {
            return await this.model.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, { ...updateData, updatedAt: new Date() }, { new: true, session });
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to update record: ${error.message}`);
        }
    }
    async softDelete(id, deletedBy, session) {
        try {
            const res = await this.model.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, { isDeleted: true, deletedAt: new Date(), deletedBy }, { new: true, session });
            return !!res;
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to soft delete record: ${error.message}`);
        }
    }
    async restore(id, session) {
        try {
            const res = await this.model.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } }, { new: true, session });
            return !!res;
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to restore record: ${error.message}`);
        }
    }
    async paginate(filter, options = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const skip = (page - 1) * limit;
        try {
            const queryFilter = { ...filter, isDeleted: { $ne: true } };
            const [docs, totalDocs] = await Promise.all([
                this.model
                    .find(queryFilter)
                    .sort(options.sort || { createdAt: -1 })
                    .select(options.select || '')
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.model.countDocuments(queryFilter).exec(),
            ]);
            const totalPages = Math.ceil(totalDocs / limit);
            return {
                docs,
                totalDocs,
                limit,
                page,
                totalPages,
            };
        }
        catch (error) {
            throw new AppError_1.DatabaseError(`Failed to paginate records: ${error.message}`);
        }
    }
}
exports.BaseRepository = BaseRepository;
