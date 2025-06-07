import { Elysia, t } from 'elysia';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { auth } from '../../plugins/auth';
import { database } from '../../plugins/db';
import { BudgetRepository } from './budget.repository';
import { BudgetService } from './budget.service';

declare module 'elysia' {
  interface ElysiaContext {
    budgetService: BudgetService
  }
}

const budgetModel = t.Object({
  amount: t.Number(),
  category: t.String(),
  month: t.String()
})

export const budget = new Elysia({ name: 'budget' })
  .use(auth)
  .use(database)
  .derive(({ db }: { db: PrismaClient }): { budgetService: BudgetService } => {
    const budgetRepository = new BudgetRepository(db)
    const budgetService = new BudgetService(budgetRepository);
    return { budgetService }
  })
  .model({
    budget: budgetModel
  })
  .get('/', async ({ budgetService, userId }) => {
    return await budgetService.getAllBudgets(userId)
  })
