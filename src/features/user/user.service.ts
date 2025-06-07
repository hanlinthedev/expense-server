import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../prisma/generated/prisma'; // Import User type for better typing
import { JWT_SECRET } from '../../_constant';
import { APIError } from '../../utils/error';
import { SignInUser } from './type';
import { UserRepository } from './user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userData: Pick<User, 'email' | 'password' | 'name' >): Promise<{ token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new APIError(400,'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.userRepository.create({ 
      email: userData.email, 
      password: hashedPassword,
      name: userData.name // Assuming name is optional
    });
    
    return {
      token: jwt.sign({ userId: user.id }, JWT_SECRET)
    };
  }

  async loginUser(credentials: Pick<User, 'email' | 'password'>): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new  APIError(401,'Invalid Credentials!'); 
    }
    
    const valid = await bcrypt.compare(credentials.password, user.password);
    if (!valid) {
      throw new APIError(401,'Invalid password'); // More specific error handling in production
    }
    
    return {
      token: jwt.sign({ userId: user.id }, JWT_SECRET)
    };
  }

  async getMe(userId: string): Promise<SignInUser | null> {
    return this.userRepository.findById(userId);
  }
}