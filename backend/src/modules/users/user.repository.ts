import { BaseRepository } from '../../shared/repositories/BaseRepository';
import { UserModel, IUser } from '../../database/schemas/User';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }
}
