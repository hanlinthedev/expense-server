import { PrismaClient } from "../../../prisma/generated/prisma";

export class BudgetRepository {
   private db: PrismaClient;
   constructor(db : PrismaClient) {
      this.db = db;
   }

   async getAllBudgets(userId : string) {
      return await this.db.budget.findMany({
         where: {
            userId: userId
         }
      })
   }
}