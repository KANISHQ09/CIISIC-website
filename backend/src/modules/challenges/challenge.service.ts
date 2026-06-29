import { ChallengeRepository } from './challenge.repository';
import { IChallenge } from '../../database/schemas/Challenge';
import { NotFoundError } from '../../shared/errors/AppError';
import AuditLogModel from '../../database/schemas/AuditLog';

export class ChallengeService {
  private readonly challengeRepository: ChallengeRepository;

  constructor() {
    this.challengeRepository = new ChallengeRepository();
  }

  private generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Date.now().toString().slice(-4)
    );
  }

  public async createChallenge(data: any, userId: string, userName: string): Promise<IChallenge> {
    const slug = this.generateSlug(data.title);
    const challenge = await this.challengeRepository.create({
      ...data,
      slug,
      status: 'DRAFT',
    });

    await AuditLogModel.create({
      userId,
      userName,
      action: 'CHALLENGE_CREATED',
      description: `Challenge draft created: "${challenge.title}"`,
      ipAddress: '0.0.0.0',
      category: 'APPROVAL',
    });

    return challenge;
  }

  public async getChallengeById(id: string): Promise<IChallenge> {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge statement not found');
    }
    return challenge;
  }

  public async updateChallenge(
    id: string,
    data: any,
    userId: string,
    userName: string,
  ): Promise<IChallenge> {
    const challenge = await this.challengeRepository.update(id, data);
    if (!challenge) {
      throw new NotFoundError('Challenge statement not found');
    }

    await AuditLogModel.create({
      userId,
      userName,
      action: 'CHALLENGE_UPDATED',
      description: `Challenge updated: "${challenge.title}"`,
      ipAddress: '0.0.0.0',
      category: 'APPROVAL',
    });

    return challenge;
  }

  public async transitionStatus(
    id: string,
    status: IChallenge['status'],
    userId: string,
    userName: string,
  ): Promise<IChallenge> {
    const challenge = await this.challengeRepository.update(id, { status });
    if (!challenge) {
      throw new NotFoundError('Challenge statement not found');
    }

    await AuditLogModel.create({
      userId,
      userName,
      action: 'CHALLENGE_STATUS_TRANSITION',
      description: `Challenge status transitioned to ${status} for "${challenge.title}"`,
      ipAddress: '0.0.0.0',
      category: 'APPROVAL',
    });

    return challenge;
  }

  public async assignReviewer(
    id: string,
    reviewerId: string,
    userId: string,
    userName: string,
  ): Promise<IChallenge> {
    const challenge = await this.challengeRepository.update(id, { reviewerId });
    if (!challenge) {
      throw new NotFoundError('Challenge statement not found');
    }

    await AuditLogModel.create({
      userId,
      userName,
      action: 'CHALLENGE_REVIEWER_ASSIGNED',
      description: `Reviewer allocated to challenge: "${challenge.title}"`,
      ipAddress: '0.0.0.0',
      category: 'APPROVAL',
    });

    return challenge;
  }

  public async searchChallenges(queryParams: any) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const search = queryParams.search || '';
    const category = queryParams.category || '';
    const difficulty = queryParams.difficulty || '';
    const status = queryParams.status || 'PUBLISHED';
    const isFeatured = queryParams.isFeatured === 'true';

    const filter: any = { isDeleted: { $ne: true } };

    if (status) {
      filter.status = status;
    }

    if (isFeatured) {
      filter.isFeatured = true;
    }

    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    return this.challengeRepository.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
  }
}
