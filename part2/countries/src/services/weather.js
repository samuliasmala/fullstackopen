import axios from 'axios';

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export const getWeather = ({ lat, lon }) =>
  axios.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
