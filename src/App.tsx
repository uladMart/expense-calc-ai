import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CssBaseline, 
  AppBar, 
  Toolbar,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import ExpenseSummary from './components/ExpenseSummary';
import Clock from './components/Clock';
import LocationInfo from './components/LocationInfo';
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
  const [notification, setNotification] = useState<{
    open: boolean, 
    message: string, 
    category: string,
    before: number,
    after: number
  }>({
    open: false,
    message: '',
    category: '',
    before: 0,
    after: 0
  });

  // Extract unique categories from expenses
  const existingCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    expenses.forEach(expense => categoriesSet.add(expense.category));
    return Array.from(categoriesSet);
  }, [expenses]);

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => {
      // Check if the category already exists
      const existingExpenseIndex = prev.findIndex(
        item => item.category.toLowerCase() === expense.category.toLowerCase()
      );
      
      if (existingExpenseIndex !== -1) {
        // Category exists, update the amount
        const updatedExpenses = [...prev];
        const previousAmount = updatedExpenses[existingExpenseIndex].amount;
        const newAmount = previousAmount + expense.amount;
        
        updatedExpenses[existingExpenseIndex] = {
          ...updatedExpenses[existingExpenseIndex],
          amount: newAmount
        };
        
        // Show notification
        setNotification({
          open: true,
          message: `Updated existing category`,
          category: expense.category,
          before: previousAmount,
          after: newAmount
        });
        
        return updatedExpenses;
      } else {
        // Category doesn't exist, add as new expense
        return [...prev, expense];
      }
    });
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
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalculateIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div">
                Expense Calculator
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationInfo />
              <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Clock />
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <ExpenseForm 
            onAddExpense={handleAddExpense} 
            existingCategories={existingCategories}
          />
          
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
          
          <Snackbar
            open={notification.open}
            autoHideDuration={4000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity="success"
              sx={{ width: '100%' }}
            >
              <Typography variant="subtitle2">
                {notification.message}: <strong>{notification.category}</strong>
              </Typography>
              <Typography variant="body2">
                Previous amount: ${notification.before.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                New amount: ${notification.after.toLocaleString()}
              </Typography>
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 