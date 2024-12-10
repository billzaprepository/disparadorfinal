import axios from 'axios';
import { API_BASE_URL, API_HEADERS } from '../config/api';
import { handleAPIError } from '../utils/error';

export const api = axios.create({
  baseURL: https://evo.iainfinito.com.br/instance/create,
  headers: API_HEADERS,
  timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Unknown error occurred');
    }
    return response;
  },
  (error) => {
    throw handleAPIError(error);
  }
);