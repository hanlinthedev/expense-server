import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../prisma/generated/prisma';
import { JWT_SECRET } from '../../_constant';
import { APIError } from '../../utils/error';
import { SignInUser } from './type';
import { UserRepository } from './user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userData: Pick<User, 'email' | 'password' | 'name'>): Promise<{ token: string, refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new APIError(400, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1D'
    })
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7D'
    })
    return {
      token,
      refreshToken
    };
  }

  async loginUser(credentials: Pick<User, 'email' | 'password'>): Promise<{ token: string, refreshToken: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new APIError(401, 'Invalid Credentials!');
    }

    const valid = await bcrypt.compare(credentials.password, user.password);
    if (!valid) {
      throw new APIError(401, 'Invalid password'); // More specific error handling in production
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '1D'
    })
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7D'
    })
    return {
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string, refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
      const token = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
        expiresIn: '1D'
      })
      const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
        expiresIn: '7D'
      })
      return {
        token,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new APIError(401, 'Invalid refresh token');
    }
  }

  async getMe(userId: string): Promise<SignInUser | null> {
    return this.userRepository.findById(userId);
  }
}