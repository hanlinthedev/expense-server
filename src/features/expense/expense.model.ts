import Elysia, { t } from "elysia";

const expenseModel = t.Object({
   id: t.String({ format: 'uuid' }),
   amount: t.Number(),
   description: t.String(),
   category: t.String(),
   date: t.String()
})

export type TExpenseModel = typeof expenseModel.static;

const createExpenseModel = t.Object({
   amount: t.Number(),
   categoryId: t.String({ format: 'uuid' }),
   description: t.String(),
   usedAt: t.Date({
      format: 'date-time'
   })
})

export type TCreateExpenseModel = typeof createExpenseModel.static;

const ExpenseModel = new Elysia().model({
   expense: expenseModel,
   'expense.create': createExpenseModel
})

export default ExpenseModel;
