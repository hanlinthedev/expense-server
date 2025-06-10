import { Elysia } from "elysia";
import { auth } from "../../plugins/auth";
import { database } from "../../plugins/db";
import { CategoryModel } from "./category.model";
import { CategoryRepository } from './category.repository';
import { CategoryService } from "./category.service";

declare module "elysia" {
   interface ElysiaContext {
      categoryService: CategoryService;
   }
}

export const category = new Elysia({
   name: "category",
   detail: {
      tags: ['Category']
   }
})
   .use(auth)
   .use(database)
   .derive(({ db }) => {
      const categoryRepository = new CategoryRepository(db)
      const categoryService = new CategoryService(categoryRepository)
      return { categoryService }
   })
   .use(CategoryModel)
   .get("", ({ categoryService, userId }) => categoryService.getAllMyCategories(userId))
   .post("", ({ categoryService, userId, body }) => categoryService.createCategory(userId, body), { body: 'category.create', response: "category" })
   .patch(":id", ({ categoryService, userId, params: { id }, body }) => categoryService.updateCategory(userId, id, body), { body: 'category.create', response: "category" })
   .delete(":id", ({ categoryService, userId, params: { id } }) => categoryService.deleteCategory(userId, id))
