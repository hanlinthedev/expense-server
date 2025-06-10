import { PrismaClient } from "../../../prisma/generated/prisma";
import { TCreateIncomeModel } from "./income.model";

export class IncomeRepository {
   private db: PrismaClient;
   constructor(db: PrismaClient) {
      this.db = db;
   }

   async getAllIncomes(userId: string) {
      return await this.db.income.findMany({
         where: {
            userId: userId
         },
         select: {
            id: true,
            amount: true,
            receivedAt: true,
            description: true,
            category: {
               select: {
                  id: true,
                  name: true,
               }
            },
         },
         orderBy: {
            receivedAt: 'desc'
         }
      })
   }

   async createIncome(userId: string, income: TCreateIncomeModel) {
      return await this.db.income.create({
         data: {
            userId: userId,
            amount: income.amount,
            description: income.description,
            categoryId: income.categoryId,
            receivedAt: income.receivedAt,
         },
         select: {
            id: true,
         }
      })
   }
}