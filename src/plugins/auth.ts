import { Elysia } from 'elysia'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../_constant'
import { APIError } from '../utils/error'


export const auth = new Elysia({ name: 'auth' })
  .derive({ as: 'scoped' }, ({ headers: { authorization }, set }) => {
    if (!authorization) {
      throw new APIError(401, 'Unauthorized')
    }

    try {
      const token = authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string }
      return { userId: decoded.userId }
    } catch (error: Error | any) {
      console.log(error)
      throw new APIError(401, error.message)
    }
  })

declare module 'elysia' {
  interface ElysiaContext {
    userId: string
  }
}