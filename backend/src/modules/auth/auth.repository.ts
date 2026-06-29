import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { SessionModel, ISession } from '../../database/schemas/Session';
import { RefreshTokenModel, IRefreshToken } from '../../database/schemas/RefreshToken';

export class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(SessionModel);
  }

  public async findActiveByUser(userId: string): Promise<ISession[]> {
    return this.model.find({ userId, isDeleted: { $ne: true } }).exec();
  }

  public async findByToken(token: string): Promise<ISession | null> {
    return this.findOne({ token });
  }
}

export class RefreshTokenRepository extends BaseRepository<IRefreshToken> {
  constructor() {
    super(RefreshTokenModel);
  }

  public async findActiveToken(token: string): Promise<IRefreshToken | null> {
    return this.findOne({ token, isRevoked: false });
  }

  public async revokeAllUserTokens(userId: string): Promise<void> {
    await this.model
      .updateMany({ userId, isRevoked: false }, { isRevoked: true, updatedAt: new Date() })
      .exec();
  }
}
