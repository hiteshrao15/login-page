import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginUser, registerUser } from '../api/axios'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string>
  register: (email: string, password: string) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function extractMessage(data: unknown): string {
  if (typeof data === 'string') return data
  if (data && typeof data === 'object' && 'msg' in data) {
    return String((data as { msg: string }).msg)
  }
  return 'Something went wrong'
}

function extractToken(data: unknown): string | null {
  if (data && typeof data === 'object' && 'token' in data) {
    const token = (data as { token?: string }).token
    return token ?? null
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  )

  const persistToken = useCallback((value: string) => {
    localStorage.setItem('token', value)
    setToken(value)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await loginUser(email, password)
      const message = extractMessage(data)
      const newToken = extractToken(data)

      if (!newToken) {
        throw new Error(message)
      }

      persistToken(newToken)
      return message
    },
    [persistToken],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      const { data } = await registerUser(email, password)
      const message = extractMessage(data)
      const newToken = extractToken(data)

      if (!newToken) {
        throw new Error(message)
      }

      persistToken(newToken)
      return message
    },
    [persistToken],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
