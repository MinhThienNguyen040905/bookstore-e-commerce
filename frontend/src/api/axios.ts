import axios from 'axios';
// Axios instance (baseURL, headers)
const api = axios.create({
    baseURL: 'http://localhost:3000/api',  // Thay bằng backend URL (e.g., /api/books)
    headers: { 'Content-Type': 'application/json' },
    // Optional: Add auth token: headers: { Authorization: `Bearer ${token}` }
});

export default api;