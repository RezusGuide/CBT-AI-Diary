import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

console.log('Axios instance initialized with baseURL:', api.defaults.baseURL);

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && !original.url.includes('/api/auth/login')) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) { logout(); return Promise.reject(err); }
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/refresh`,
          { refreshToken: refresh }
        );
        localStorage.setItem('accessToken', res.data.accessToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch {
        logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export default api;
