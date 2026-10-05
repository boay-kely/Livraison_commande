import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthEndpoint =
      url.includes('/auth/login/') || url.includes('/auth/register/')

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      localStorage.removeItem('user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: (username, password) =>
    api.post('/auth/login/', { username, password }),
  register: (payload) => api.post('/auth/register/', payload),
  me: () => api.get('/auth/me/'),
}

export const productApi = {
  list: () => api.get('/products/'),
}

export const orderApi = {
  list: () => api.get('/orders/'),
  create: (payload) => api.post('/orders/', payload),
  updateStatus: (id, payload) => api.post(`/orders/${id}/update-status/`, payload),
}

export const livreurApi = {
  list: () => api.get('/livreurs/'),
}

export default api
