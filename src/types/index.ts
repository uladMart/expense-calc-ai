export interface Expense {
  id: string;
  category: string;
  amount: number;
}

export interface ExpenseSummary {
  totalAmount: number;
  dailyAverage: number;
  topExpenses: Expense[];
} 