import React, { useState, useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Expense } from '../types';

interface ExpenseCalendarProps {
  expenses: Expense[];
  onSelectDate?: (date: Date) => void;
}

const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ expenses, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Получаем год и месяц из текущей даты
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Названия месяцев
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  // Названия дней недели
  const weekDayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Предыдущий месяц
  const goToPreviousMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date);
  };
  
  // Следующий месяц
  const goToNextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date);
  };
  
  // Получаем массив дней для текущего месяца
  const calendarDays = useMemo(() => {
    // Первый день месяца
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    
    // Последний день месяца
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Количество дней в месяце
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник и т.д.)
    let firstWeekday = firstDayOfMonth.getDay();
    firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1; // Преобразуем в формат Пн-Вс (0-6)
    
    // Создаем массив дней
    const days = [];
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstWeekday; i++) {
      days.push(null);
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }
    
    return days;
  }, [currentMonth, currentYear]);
  
  // Получаем локальные даты без учета часового пояса
  const getLocalDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // Группируем расходы по датам (ключ: YYYY-MM-DD, значение: массив расходов)
  const expensesByDate = useMemo(() => {
    const byDate: Record<string, Expense[]> = {};
    
    expenses.forEach(expense => {
      // Получаем дату без времени в формате YYYY-MM-DD
      const expenseDate = new Date(expense.createdAt);
      const dateKey = getLocalDateString(expenseDate);
      
      if (!byDate[dateKey]) {
        byDate[dateKey] = [];
      }
      
      byDate[dateKey].push(expense);
    });
    
    return byDate;
  }, [expenses]);
  
  // Получаем сумму расходов для конкретной даты
  const getExpenseTotal = (date: Date) => {
    const dateKey = getLocalDateString(date);
    const expensesForDate = expensesByDate[dateKey] || [];
    
    return expensesForDate.reduce((total, expense) => total + expense.amount, 0);
  };
  
  // Проверяем, есть ли расходы для конкретной даты
  const hasExpenses = (date: Date) => {
    const dateKey = getLocalDateString(date);
    return !!expensesByDate[dateKey];
  };
  
  // Определяем цвет индикатора в зависимости от суммы расходов
  const getExpenseColor = (amount: number) => {
    if (amount > 10000) return '#f44336'; // Красный для крупных расходов
    if (amount > 5000) return '#ff9800';  // Оранжевый для средних
    return '#4caf50';                     // Зеленый для небольших
  };
  
  // Обработчик клика по дате
  const handleDayClick = (date: Date | null) => {
    if (date && onSelectDate) {
      // Устанавливаем время на начало дня, чтобы не было смещения
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      onSelectDate(selectedDate);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: '#f5f9ff', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={goToPreviousMonth} size="small" sx={{ color: '#1976d2' }}>
          <ChevronLeftIcon />
        </IconButton>
        
        <Typography variant="h6" component="h2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          {monthNames[currentMonth]} {currentYear}
        </Typography>
        
        <IconButton onClick={goToNextMonth} size="small" sx={{ color: '#1976d2' }}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      
      <Grid container spacing={1}>
        {/* Дни недели */}
        {weekDayNames.map((day, index) => (
          <Grid item key={`weekday-${index}`} xs={12/7}>
            <Typography 
              variant="caption" 
              align="center" 
              sx={{ 
                display: 'block', 
                fontWeight: 'bold',
                color: index >= 5 ? '#f44336' : '#1976d2' // Выходные красным
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        
        {/* Дни месяца */}
        {calendarDays.map((date, index) => {
          // Если нет даты (пустая ячейка в начале месяца)
          if (!date) {
            return (
              <Grid item key={`empty-${index}`} xs={12/7}>
                <Box 
                  sx={{ 
                    height: 40, 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(0,0,0,0.03)',
                    borderRadius: 1
                  }}
                />
              </Grid>
            );
          }
          
          const dayExpenseTotal = getExpenseTotal(date);
          const hasExpensesForDay = hasExpenses(date);
          const expenseColor = getExpenseColor(dayExpenseTotal);
          
          // Определяем, выходной ли день (суббота или воскресенье)
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          // Определяем, сегодняшний ли день
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dateWithoutTime = new Date(date);
          dateWithoutTime.setHours(0, 0, 0, 0);
          const isToday = dateWithoutTime.getTime() === today.getTime();
          
          return (
            <Grid item key={`day-${date.getDate()}`} xs={12/7}>
              <Tooltip 
                title={hasExpensesForDay ? `Расходы: $${dayExpenseTotal.toLocaleString()}` : 'Нет расходов'}
                arrow
              >
                <Box 
                  onClick={() => handleDayClick(date)}
                  sx={{ 
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    position: 'relative',
                    bgcolor: isToday ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  <Badge
                    variant="dot"
                    invisible={!hasExpensesForDay}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: expenseColor,
                        width: 8,
                        height: 8,
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: hasExpensesForDay || isToday ? 'bold' : 'normal',
                        color: isWeekend ? '#f44336' : hasExpensesForDay ? expenseColor : 'inherit'
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                  </Badge>
                  
                  {/* Кружок для дней с расходами */}
                  {hasExpensesForDay && (
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        border: `2px solid ${expenseColor}`,
                        borderRadius: '50%',
                        opacity: 0.7
                      }} 
                    />
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Легенда */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
          <Typography variant="caption">До $5,000</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff9800', mr: 1 }} />
          <Typography variant="caption">$5,000-$10,000</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f44336', mr: 1 }} />
          <Typography variant="caption">Более $10,000</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ExpenseCalendar; 