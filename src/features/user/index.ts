// src/plugins/user.ts
import { Elysia, t } from 'elysia';
import { PrismaClient } from '../../../prisma/generated/prisma'; // For type hinting db
import { auth } from '../../plugins/auth';
import { database } from '../../plugins/db';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// Extend ElysiaContext to include 'db' (if not already done in your db plugin)
declare module 'elysia' {
  interface ElysiaContext {
    userService: UserService;
    db: PrismaClient;
  }
}




// Define your user models (moved from inside the plugin for clarity if needed elsewhere)
const userModel = t.Object({
  email: t.String({ format: 'email' ,error: 'Invalid email format'}),
  password: t.String({ minLength: 8 }),
  name: t.String()
});

export const user = new Elysia({ name: 'user' }).use(database)
  .derive(({ db }) => {
    // Initialize repository and service here, passing the 'db' instance
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);
    return { userService }; // Add userService to the context
  })
  .model({
    user: userModel,
    'user.login': t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .post('/register', async ({ body, userService }) => { // Inject userService
    // The handler now just calls the service, very clean!
    return await userService.registerUser(body)
  }, {
    body: 'user'
  })
  .post('/login', async ({ body, userService }) => { // Inject userService
    // The handler now just calls the service
    return await userService.loginUser(body)
  }, {
    body: 'user.login'
  }).use(auth).get('/me', async ({ userService, userId, set }) => {
    if(!userId) throw new Error('User not found')
    // The handler now just calls the service
    const user = await userService.getMe(userId)
    
    if (!user) {
      set.status = 404
      return { message: 'User not found' }
    }
    return user
  } )