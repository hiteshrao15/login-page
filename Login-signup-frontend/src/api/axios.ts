import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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

export interface AuthResponse {
  msg?: string
  token?: string
}

export const registerUser = (email: string, password: string) =>
  api.post<AuthResponse>('/register', { email, password })

export const loginUser = (email: string, password: string) =>
  api.post<AuthResponse | string>('/login', { email, password })

export const fetchHome = () => api.get<{ message: string }>('/home')

export const fetchDashboard = () => api.get<{ msg: string }>('/dashboard')

export default api
