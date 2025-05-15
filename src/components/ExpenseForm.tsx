import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Box, 
  Grid, 
  Paper,
  Typography,
  Autocomplete,
  Chip
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  existingCategories?: string[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, existingCategories = [] }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    
    const amountValue = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Create new expense (дата будет добавлена в App.tsx)
    const newExpense: Omit<Expense, 'createdAt'> = {
      id: uuidv4(),
      category: category.trim(),
      amount: amountValue
    };
    
    // Add expense
    onAddExpense(newExpense as Expense);
    
    // Reset form
    setCategory('');
    setAmount('');
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: '#f5f9ff' }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
        Add New Expense
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Autocomplete
              freeSolo
              options={existingCategories}
              value={category}
              onChange={(_, newValue) => {
                setCategory(newValue || '');
              }}
              inputValue={category}
              onInputChange={(_, newInputValue) => {
                setCategory(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Category"
                  variant="outlined"
                  error={error?.includes('Category')}
                  helperText={error?.includes('Category') ? error : ''}
                  sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Amount ($)"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={error?.includes('amount')}
              helperText={error?.includes('amount') ? error : ''}
              sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#1976d2' } } }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ 
                height: '100%', 
                bgcolor: '#1976d2',
                '&:hover': {
                  bgcolor: '#1565c0',
                }
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
        
        {existingCategories.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
              Quick select from existing categories:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {existingCategories.map((cat) => (
                <Chip 
                  key={cat} 
                  label={cat} 
                  onClick={() => setCategory(cat)}
                  sx={{ 
                    bgcolor: category === cat ? '#bbdefb' : 'white',
                    '&:hover': { bgcolor: '#e3f2fd' } 
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ExpenseForm; 