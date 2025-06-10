import { PrismaClient } from "../../../prisma/generated/prisma"
import { TCreateExpenseModel } from "./expense.model"

export class ExpenseRepository {
  private db: PrismaClient
  constructor(db: PrismaClient) {
    this.db = db
  }

  async getAllMyExpenses(userId: string) {
    return await this.db.expense.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        amount: true,
        description: true,
        usedAt: true,
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
  }

  async createExpense(userId: string, data: TCreateExpenseModel) {
    return await this.db.expense.create({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        userId: userId,
        usedAt: data.usedAt
      },
      select: {
        id: true,
      }
    })
  }
}