import { UserRepository } from './user.repository';
import { RegisterUserDTO } from './user.dto';
import { ConflictError, NotFoundError } from '../../shared/errors/AppError';
import bcrypt from 'bcryptjs';
import { IUser } from '../../database/schemas/User';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(dto: RegisterUserDTO): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email is already registered under another account');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    return this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
  }

  public async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User record not found');
    }
    return user;
  }
}
