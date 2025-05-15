import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CssBaseline, 
  AppBar, 
  Toolbar,
  createTheme,
  ThemeProvider
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import ExpenseSummary from './components/ExpenseSummary';
import { Expense, ExpenseSummary as ExpenseSummaryType } from './types';

// Create a blue theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f5f9ff',
    },
    background: {
      default: '#e8f0fe',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummaryType | null>(null);

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const calculateSummary = () => {
    if (expenses.length === 0) {
      return;
    }

    // Calculate total
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate daily average (assuming 30 days per month)
    const dailyAverage = totalAmount / 30;
    
    // Get top 3 expenses
    const topExpenses = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
      
    setSummary({
      totalAmount,
      dailyAverage,
      topExpenses
    });
  };

  // Sample data for demonstration
  const addSampleData = () => {
    const sampleExpenses: Expense[] = [
      { id: '1', category: 'Groceries', amount: 15000 },
      { id: '2', category: 'Rent', amount: 40000 },
      { id: '3', category: 'Transportation', amount: 5000 },
      { id: '4', category: 'Entertainment', amount: 10000 },
      { id: '5', category: 'Communication', amount: 2000 },
      { id: '6', category: 'Gym', amount: 3000 }
    ];
    
    setExpenses(sampleExpenses);
  };

  const clearAll = () => {
    setExpenses([]);
    setSummary(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <CalculateIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Expense Calculator
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <ExpenseForm onAddExpense={handleAddExpense} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={calculateSummary}
              sx={{ fontWeight: 'bold' }}
            >
              Calculate Summary
            </Button>
            
            <Box>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={addSampleData} 
                sx={{ mr: 1 }}
              >
                Load Sample Data
              </Button>
              
              <Button 
                variant="outlined"
                color="primary"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </Box>
          </Box>
          
          <ExpenseTable expenses={expenses} />
          <ExpenseSummary summary={summary} />
          
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 