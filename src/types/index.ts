export interface Expense {
  id: string;
  category: string;
  amount: number;
  createdAt: Date;
}

export interface ExpenseSummary {
  totalAmount: number;
  dailyAverage: number;
  topExpenses: Expense[];
} 