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
  Divider,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearIcon from '@mui/icons-material/Clear';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import ExpenseSummary from './components/ExpenseSummary';
import Clock from './components/Clock';
import LocationInfo from './components/LocationInfo';
import ExpenseCalendar from './components/ExpenseCalendar';
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  // Форматирование даты
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Вспомогательная функция для сравнения дат (только день, месяц, год)
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Extract unique categories from expenses
  const existingCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    expenses.forEach(expense => categoriesSet.add(expense.category));
    return Array.from(categoriesSet);
  }, [expenses]);

  // Фильтруем расходы по выбранной дате
  const filteredExpenses = useMemo(() => {
    if (!selectedDate) return expenses;
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
      return isSameDay(expenseDate, selectedDate);
    });
  }, [expenses, selectedDate]);

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const handleAddExpense = (expense: Expense) => {
    // Создаем новую дату и устанавливаем время на начало дня
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Добавляем текущую дату к расходу
    const expenseWithDate = {
      ...expense,
      createdAt: now
    };

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
          amount: newAmount,
          createdAt: now // Обновляем дату при изменении суммы
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
        return [...prev, expenseWithDate];
      }
    });
  };

  const calculateSummary = () => {
    if (filteredExpenses.length === 0) {
      return;
    }

    // Calculate total for filtered expenses
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate daily average (assuming 30 days per month)
    const dailyAverage = totalAmount / 30;
    
    // Get top 3 expenses from filtered expenses
    const topExpenses = [...filteredExpenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
      
    setSummary({
      totalAmount,
      dailyAverage,
      topExpenses
    });
  };

  // Обработчик выбора даты
  const handleSelectDate = (date: Date) => {
    // Если выбрана та же дата, снимаем выбор
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  // Очистка выбранной даты
  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  // Sample data for demonstration
  const addSampleData = () => {
    // Создаем даты с установкой времени на начало дня
    const createDate = (daysAgo: number): Date => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(0, 0, 0, 0);
      return date;
    };
    
    const now = createDate(0);
    const yesterday = createDate(1);
    const twoDaysAgo = createDate(2);
    const threeDaysAgo = createDate(3);
    const fourDaysAgo = createDate(4);
    const fiveDaysAgo = createDate(5);
    
    const sampleExpenses: Expense[] = [
      { id: '1', category: 'Groceries', amount: 15000, createdAt: now },
      { id: '2', category: 'Rent', amount: 40000, createdAt: yesterday },
      { id: '3', category: 'Transportation', amount: 5000, createdAt: twoDaysAgo },
      { id: '4', category: 'Entertainment', amount: 10000, createdAt: threeDaysAgo },
      { id: '5', category: 'Communication', amount: 2000, createdAt: fourDaysAgo },
      { id: '6', category: 'Gym', amount: 3000, createdAt: fiveDaysAgo }
    ];
    
    setExpenses(sampleExpenses);
  };

  const clearAll = () => {
    setExpenses([]);
    setSummary(null);
    setSelectedDate(null);
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
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

          {selectedDate && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Chip 
                icon={<CalendarMonthIcon />}
                label={`Showing expenses for: ${formatDate(selectedDate)}`}
                color="primary"
                onDelete={clearSelectedDate}
                deleteIcon={<ClearIcon />}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <ExpenseTable expenses={filteredExpenses} />
              <ExpenseSummary summary={summary} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ExpenseCalendar 
                expenses={expenses} 
                onSelectDate={handleSelectDate}
              />
            </Grid>
          </Grid>
          
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