import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Box
} from '@mui/material';
import { ExpenseSummary as ExpenseSummaryType } from '../types';

interface ExpenseSummaryProps {
  summary: ExpenseSummaryType | null;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ summary }) => {
  if (!summary) {
    return null;
  }

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

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: '#f5f9ff' }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
        Expense Summary
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Total Expenses:
        </Typography>
        <Typography variant="h4" sx={{ color: '#1565c0' }}>
          ${summary.totalAmount.toLocaleString()}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Average Daily Expense:
        </Typography>
        <Typography variant="h5" sx={{ color: '#1565c0' }}>
          ${summary.dailyAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Typography>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
        Top 3 Expenses:
      </Typography>
      
      <List sx={{ bgcolor: 'white', borderRadius: 1 }}>
        {summary.topExpenses.map((expense, index) => (
          <React.Fragment key={expense.id}>
            {index > 0 && <Divider />}
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight="medium">{expense.category}</Typography>
                    <Typography fontWeight="bold" color="#1976d2">
                      ${expense.amount.toLocaleString()}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Added on: {formatDate(expense.createdAt)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseSummary; 