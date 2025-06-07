import { Elysia, t } from 'elysia'
import { auth } from '../../plugins/auth'
import { database } from '../../plugins/db'
import { ExpenseRepository } from './expense.repository'
import { ExpenseService } from './expense.service'

declare module 'elysia' {
  interface Elysia {
     expenseService: ExpenseService
  }
}

const expenseModel = t.Object({
  amount: t.Number(),
  description: t.String(),
  category: t.String(),
  date: t.String()
})

export const expense = new Elysia({ name: 'expense' })
  .model({
    expense: expenseModel
  })
   .use(auth)
   .use(database)
   .derive(({ db} ) => {
      const expenseRepository = new ExpenseRepository(db)
      const expenseService = new ExpenseService(expenseRepository)
      return { expenseService }
    
   })
  .get('/expenses', async ({ db, userId }) => {
    return await db.expense.findMany({ where: { userId } })
  })
  .post('/expenses', async ({ body, db, userId }) => {
    return await db.expense.create({
      data: {
        ...body,
        date: new Date(body.date),
        userId
      }
    })
  }, {
    body: 'expense'
  })