import axios from 'axios';

// Axios instance for public endpoints (no authentication required)
const publicApi = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// No interceptors needed for public API

export default publicApi;
