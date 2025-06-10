import { PrismaClient } from "../../../prisma/generated/prisma";
import { TCreateCategoryModel } from "./category.model";

export class CategoryRepository {
   private db: PrismaClient;
   constructor(db: PrismaClient) {
      this.db = db;
   }

   async getAllMyCategories(userId: string) {
      return await this.db.category.findMany({
         where: {
            userId
         },
         select: {
            id: true,
            name: true,
            color: true
         }
      })
   }

   async createCategory(userId: string, category: TCreateCategoryModel) {
      return await this.db.category.create({
         data: {
            userId,
            name: category.name,
            color: category.color
         }
      })
   }

   async updateCategory(userId: string, categoryId: string, category: TCreateCategoryModel) {
      return await this.db.category.update({
         where: {
            id: categoryId,
            userId
         },
         data: {
            name: category.name,
            color: category.color
         },
         select: {
            id: true,
            name: true,
            color: true
         }
      })
   }

   async deleteCategory(userId: string, categoryId: string) {
      return await this.db.category.delete({
         where: {
            id: categoryId,
            userId
         }
      })
   }
}