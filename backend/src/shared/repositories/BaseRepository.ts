import { Model, Document, FilterQuery, UpdateQuery, ClientSession } from 'mongoose';
import { DatabaseError } from '../errors/AppError';

export interface PaginateOptions {
  page?: number;
  limit?: number;
  sort?: string | Record<string, any>;
  select?: string | Record<string, number>;
}

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  public async create(data: Partial<T> | any, session?: ClientSession): Promise<T> {
    try {
      const doc = new this.model(data);
      if (session) {
        await doc.save({ session });
      } else {
        await doc.save();
      }
      return doc;
    } catch (error) {
      throw new DatabaseError(`Failed to create record: ${(error as Error).message}`);
    }
  }

  public async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findOne({ _id: id, isDeleted: { $ne: true } } as any);
    } catch (error) {
      throw new DatabaseError(`Failed to fetch record by ID: ${(error as Error).message}`);
    }
  }

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne({ ...filter, isDeleted: { $ne: true } });
    } catch (error) {
      throw new DatabaseError(`Failed to find record: ${(error as Error).message}`);
    }
  }

  public async update(
    id: string,
    updateData: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } } as any,
        { ...updateData, updatedAt: new Date() },
        { new: true, session },
      );
    } catch (error) {
      throw new DatabaseError(`Failed to update record: ${(error as Error).message}`);
    }
  }

  public async softDelete(
    id: string,
    deletedBy?: string,
    session?: ClientSession,
  ): Promise<boolean> {
    try {
      const res = await this.model.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } } as any,
        { isDeleted: true, deletedAt: new Date(), deletedBy } as any,
        { new: true, session },
      );
      return !!res;
    } catch (error) {
      throw new DatabaseError(`Failed to soft delete record: ${(error as Error).message}`);
    }
  }

  public async restore(id: string, session?: ClientSession): Promise<boolean> {
    try {
      const res = await this.model.findOneAndUpdate(
        { _id: id, isDeleted: true } as any,
        { isDeleted: false, $unset: { deletedAt: 1, deletedBy: 1 } } as any,
        { new: true, session },
      );
      return !!res;
    } catch (error) {
      throw new DatabaseError(`Failed to restore record: ${(error as Error).message}`);
    }
  }

  public async paginate(
    filter: FilterQuery<T>,
    options: PaginateOptions = {},
  ): Promise<PaginateResult<T>> {
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
    } catch (error) {
      throw new DatabaseError(`Failed to paginate records: ${(error as Error).message}`);
    }
  }
}
