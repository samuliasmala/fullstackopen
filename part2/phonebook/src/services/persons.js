import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

export const getAll = () => axios.get(baseUrl);
export const create = (newPerson) => axios.post(baseUrl, newPerson);
export const update = (person) => axios.put(`${baseUrl}/${person.id}`, person);
export const del = (id) => axios.delete(`${baseUrl}/${id}`);
