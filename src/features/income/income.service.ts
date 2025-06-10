import { TCreateIncomeModel } from './income.model';
import { IncomeRepository } from './income.repository';

export class IncomeService {
   private incomeRepository: IncomeRepository;

   constructor(incomeRepository: IncomeRepository) {
      this.incomeRepository = incomeRepository;
   }

   async getAllIncomes(userId: string) {
      return await this.incomeRepository.getAllIncomes(userId);
   }

   async createIncome(userId: string, income: TCreateIncomeModel) {
      return await this.incomeRepository.createIncome(userId, income);
   }
}