import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Add token to axios headers if it exists
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me/')
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', {
        email,
        password
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      navigate('/dashboard')
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.detail || 'Login failed')
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Network error. Please check your connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('An error occurred during login')
      }
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await api.post('/auth/register/', {
        email,
        password,
        firstName,
        lastName,
      })
      navigate('/login')
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Registration failed')
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.')
      } else {
        throw new Error('An error occurred during registration')
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 