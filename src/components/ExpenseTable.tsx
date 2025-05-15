import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box
} from '@mui/material';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [prevExpenses, setPrevExpenses] = useState<Expense[]>([]);
  
  // Check for updated expenses
  useEffect(() => {
    if (prevExpenses.length > 0 && expenses.length === prevExpenses.length) {
      // Find updated expense (amount changed but id remains the same)
      for (let i = 0; i < expenses.length; i++) {
        const curr = expenses[i];
        const prev = prevExpenses.find(p => p.category === curr.category);
        
        if (prev && prev.amount !== curr.amount) {
          setHighlightedId(curr.id);
          
          // Clear highlighted id after animation
          setTimeout(() => {
            setHighlightedId(null);
          }, 2000);
          
          break;
        }
      }
    }
    
    setPrevExpenses([...expenses]);
  }, [expenses]);

  // Форматирование даты
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Date Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow 
              key={expense.id}
              sx={{
                bgcolor: highlightedId === expense.id ? 'rgba(25, 118, 210, 0.1)' : 'inherit',
                transition: 'background-color 0.5s ease',
              }}
            >
              <TableCell>{expense.category}</TableCell>
              <TableCell align="right">
                {expense.amount.toLocaleString()}
                {highlightedId === expense.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '20px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      animation: 'pulse 1s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(0.95)',
                          boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
                        },
                        '70%': {
                          transform: 'scale(1)',
                          boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                        },
                        '100%': {
                          transform: 'scale(0.95)',
                          boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                        },
                      },
                    }}
                  />
                )}
              </TableCell>
              <TableCell align="right" sx={{ color: '#666', fontSize: '0.875rem' }}>
                {formatDate(expense.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseTable; 