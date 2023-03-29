import axios from 'axios';

const baseUrl = 'https://restcountries.com/v3.1';

export const getAll = () => axios.get(`${baseUrl}/all`);
