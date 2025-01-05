import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL
});

export const optimizeImages = async (files, settings) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  Object.keys(settings).forEach(key => {
    formData.append(key, settings[key]);
  });

  const response = await api.post('/optimize', formData);
  return response.data.results;
};

export const downloadAll = async () => {
  const response = await api.get('/download-results', {
    responseType: 'blob'
  });
  return response.data;
};

export const downloadSingle = async (fileName) => {
  const response = await api.get(`/download-single/${fileName}`, {
    responseType: 'blob'
  });
  return response.data;
};

export const deleteSingle = async (fileName) => {
  const response = await api.delete(`/delete-single/${fileName}`);
  return response.data;
};

export const cleanAll = async () => {
  const response = await api.post('/clean');
  return response.data;
};