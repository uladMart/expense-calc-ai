import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography
} from '@mui/material';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: '#f5f9ff' }}>
        <Typography variant="body1" sx={{ color: '#1976d2' }}>
          No expenses added yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mb: 3, bgcolor: '#f5f9ff' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#1976d2' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Amount ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.category}</TableCell>
              <TableCell align="right">
                {expense.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseTable; 