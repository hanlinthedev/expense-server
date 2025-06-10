import Elysia, { t } from "elysia";

const categoryModel = t.Object({
   id: t.String(),
   name: t.String(),
   color: t.String({ pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }),
});

export type TCategoryModel = typeof categoryModel.static;

const createCategoryModel = t.Object({
   name: t.String(),
   color: t.String({ pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }),
});

export type TCreateCategoryModel = typeof createCategoryModel.static;

export const CategoryModel = new Elysia()
   .model({
      'category': categoryModel,
      'category.create': createCategoryModel,
   });
