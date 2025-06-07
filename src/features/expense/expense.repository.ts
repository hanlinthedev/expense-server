import { PrismaClient } from "../../../prisma/generated/prisma"

export class ExpenseRepository {
   private db: PrismaClient
   constructor(db: PrismaClient) {
    this.db = db
  }
  async getAllMyExpenses(userId: string) {
    return await this.db.expense.findMany({
      where: {
        userId
      }
    })
  }
}