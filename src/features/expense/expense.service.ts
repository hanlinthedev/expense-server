import { ExpenseRepository } from './expense.repository';

export class ExpenseService {
   private expenseRepository : ExpenseRepository
   constructor(expenseRepository: ExpenseRepository) {
    this.expenseRepository = expenseRepository
  }
  async getAllMyExpenses(userId: string) {
    return this.expenseRepository.getAllMyExpenses(userId)
  }
}