import { Elysia } from 'elysia';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { auth } from '../../plugins/auth';
import { database } from '../../plugins/db';
import { IncomeModel } from './income.model';
import { IncomeRepository } from './income.repository';
import { IncomeService } from './income.service';

declare module 'elysia' {
  interface ElysiaContext {
    incomeService: IncomeService
  }
}

export const income = new Elysia({
  name: 'income',
  detail: {
    tags: ['Income']
  }
})
  .use(auth)
  .use(database)
  .derive(({ db }: { db: PrismaClient }): { incomeService: IncomeService } => {
    const incomeRepository = new IncomeRepository(db)
    const incomeService = new IncomeService(incomeRepository);
    return { incomeService }
  })
  .use(IncomeModel)
  .get('', async ({ incomeService, userId }) => {
    return await incomeService.getAllIncomes(userId)
  })
  .post('', async ({ incomeService, userId, body }) => {
    return await incomeService.createIncome(userId, body)
  }, { body: 'income.create' })
