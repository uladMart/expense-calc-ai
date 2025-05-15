import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';

interface LocationState {
  loading: boolean;
  error: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

const LocationInfo: React.FC = () => {
  const [location, setLocation] = useState<LocationState>({
    loading: true,
    error: null,
    city: null,
    country: null,
    latitude: null,
    longitude: null
  });

  const fetchLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    // Проверяем поддержку геолокации в браузере
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Геолокация не поддерживается вашим браузером'
      }));
      return;
    }

    // Получаем координаты
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Запрос к API для получения информации о местоположении по координатам
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          
          if (!response.ok) {
            throw new Error('Не удалось получить данные о местоположении');
          }
          
          const data = await response.json();
          
          // Извлекаем данные о городе и стране
          const city = data.address.city || 
                       data.address.town || 
                       data.address.village || 
                       data.address.hamlet ||
                       'Неизвестно';
                       
          const country = data.address.country || 'Неизвестно';
          
          setLocation({
            loading: false,
            error: null,
            city,
            country,
            latitude,
            longitude
          });
        } catch (error) {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: 'Ошибка при определении местоположения'
          }));
        }
      },
      (error) => {
        let errorMessage = 'Неизвестная ошибка';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Пользователь отклонил запрос на геолокацию';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Информация о местоположении недоступна';
            break;
          case error.TIMEOUT:
            errorMessage = 'Истекло время ожидания запроса местоположения';
            break;
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 минут
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      color: 'white',
      mr: 2
    }}>
      <LocationOnIcon sx={{ mr: 1 }} />
      
      <Box>
        {location.loading && (
          <Typography variant="body2">
            Определяем местоположение...
          </Typography>
        )}
        
        {location.error && (
          <Tooltip title={location.error}>
            <Typography variant="body2" sx={{ color: '#ffccbc' }}>
              Местоположение недоступно
            </Typography>
          </Tooltip>
        )}
        
        {!location.loading && !location.error && location.city && (
          <Typography variant="body2">
            {location.city}, {location.country}
          </Typography>
        )}
      </Box>
      
      <Tooltip title="Обновить местоположение">
        <IconButton 
          size="small" 
          onClick={fetchLocation}
          disabled={location.loading}
          sx={{ ml: 1, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default LocationInfo; 