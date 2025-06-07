import { Elysia } from 'elysia'
import { PrismaClient } from '../../prisma/generated/prisma'

const db = new PrismaClient()

export const database = new Elysia({ name: 'database' })
  .decorate('db', db)

// Add type declaration
declare module 'elysia' {
  interface Elysia {
    db: PrismaClient
  }
}