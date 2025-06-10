import { TCreateCategoryModel } from "./category.model";
import { CategoryRepository } from "./category.repository";

export class CategoryService {
   private categoryRepository: CategoryRepository;
   constructor(categoryRepository: CategoryRepository) {
      this.categoryRepository = categoryRepository;
   }

   async getAllMyCategories(userId: string) {
      return await this.categoryRepository.getAllMyCategories(userId);
   }

   async createCategory(userId: string, category: TCreateCategoryModel) {
      return await this.categoryRepository.createCategory(userId, category);
   }

   async updateCategory(userId: string, categoryId: string, category: TCreateCategoryModel) {
      return await this.categoryRepository.updateCategory(userId, categoryId, category);
   }

   async deleteCategory(userId: string, categoryId: string) {
      return await this.categoryRepository.deleteCategory(userId, categoryId);
   }
}