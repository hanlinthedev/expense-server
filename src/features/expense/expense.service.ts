import { TCreateExpenseModel } from './expense.model';
import { ExpenseRepository } from './expense.repository';

export class ExpenseService {
  private expenseRepository: ExpenseRepository
  constructor(expenseRepository: ExpenseRepository) {
    this.expenseRepository = expenseRepository
  }

  async getAllMyExpenses(userId: string) {
    return this.expenseRepository.getAllMyExpenses(userId)
  }

  async createExpense(userId: string, data: TCreateExpenseModel) {
    return this.expenseRepository.createExpense(userId, data)
  }
}