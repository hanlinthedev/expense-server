// src/repositories/userRepository.ts
import { PrismaClient, User } from '../../../prisma/generated/prisma';
import { SignInUser } from './type';

export class UserRepository {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<SignInUser | null> {
    return this.db.user.findUnique({
      where: { id }, select: {
        id: true,
        name: true,
        email: true,
      }
    });
  }

  async create(userData: Pick<User, 'email' | 'password' | 'name'>): Promise<User> {
    return this.db.user.create({ data: userData });
  }
}