import { Elysia } from 'elysia'
import { auth } from '../../plugins/auth'
import { database } from '../../plugins/db'
import ExpenseModel from './expense.model'
import { ExpenseRepository } from './expense.repository'
import { ExpenseService } from './expense.service'

declare module 'elysia' {
  interface ElysiaContext {
    expenseService: ExpenseService
  }
}



export const expense = new Elysia({
  name: 'expense', detail: {
    tags: ['Expense']
  }
})
  .use(auth)
  .use(database)
  .derive(({ db }) => {
    const expenseRepository = new ExpenseRepository(db)
    const expenseService = new ExpenseService(expenseRepository)
    return { expenseService }

  })
  .use(ExpenseModel)
  .get('', async ({ expenseService, userId }) => {
    return expenseService.getAllMyExpenses(userId)
  })
  .post('', async ({ expenseService, userId, body }) => {
    return expenseService.createExpense(userId, body)
  }, { body: 'expense.create' })
