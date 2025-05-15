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
                primary={expense.category}
                secondary={`$${expense.amount.toLocaleString()}`}
                primaryTypographyProps={{ fontWeight: 'medium' }}
                secondaryTypographyProps={{ fontSize: '1.1rem', color: '#1976d2' }}
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseSummary; 