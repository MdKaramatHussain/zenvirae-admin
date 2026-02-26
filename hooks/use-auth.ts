import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeToken, isTokenExpired } from '@/lib/auth'

export interface AuthUser {
  id: string
  email: string
  role: string
  name?: string
}

export interface UseAuthReturn {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

/**
 * Hook to manage authentication state
 */
export const useAuth = (): UseAuthReturn => {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for token in sessionStorage
    const storedToken = sessionStorage.getItem('authToken')
    const storedUser = sessionStorage.getItem('adminUser')

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Failed to parse user data:', error)
          sessionStorage.removeItem('authToken')
          sessionStorage.removeItem('adminUser')
        }
      }
    } else if (storedToken) {
      // Token is expired
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('adminUser')
    }

    setIsLoading(false)
  }, [])

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear session storage
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('adminUser')
      setUser(null)
      setToken(null)

      // Redirect to login
      router.push('/login')
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    logout,
  }
}

/**
 * Hook to check if user is authenticated and redirect if not
 */
export const useProtectedRoute = () => {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isLoading }
}
