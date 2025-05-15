import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Clock: React.FC = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Форматирование времени
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  // Форматирование даты
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('ru-RU', options);
  };
  
  return (
    <Box sx={{ 
      textAlign: 'right',
      color: 'white',
      animation: 'pulse 2s infinite ease-in-out',
      '@keyframes pulse': {
        '0%': { opacity: 0.8 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0.8 }
      }
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
        {formatTime(date)}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        {formatDate(date)}
      </Typography>
    </Box>
  );
};

export default Clock; 