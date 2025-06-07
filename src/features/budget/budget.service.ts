import { BudgetRepository } from './budget.repository';
export class BudgetService {
   private budgetRepository: BudgetRepository;
   
    constructor(budgetRepository: BudgetRepository) {
        this.budgetRepository = budgetRepository;
    }
   
   async getAllBudgets(userId : string) {
      return await this.budgetRepository.getAllBudgets(userId);
   }
}