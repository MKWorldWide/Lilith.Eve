import { useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthState, User } from '@types/index'

/**
 * Authentication Hook
 * 
 * Manages user authentication state, JWT tokens, and authentication operations.
 * Provides a centralized way to handle login, logout, and token management.
 * 
 * Features:
 * - JWT token management
 * - Automatic token refresh
 * - User session persistence
 * - Role-based access control
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Initialize authentication state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('lilith_eve_token')
        if (token) {
          const decoded = jwtDecode<User>(token)
          const currentTime = Date.now() / 1000
          
          if (decoded.exp && decoded.exp > currentTime) {
            setAuthState({
              user: decoded,
              token,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            // Token expired, clear it
            localStorage.removeItem('lilith_eve_token')
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        localStorage.removeItem('lilith_eve_token')
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const { token, user } = data
      localStorage.setItem('lilith_eve_token', token)

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate token on server
      const token = localStorage.getItem('lilith_eve_token')
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear local storage and state regardless of server response
      localStorage.removeItem('lilith_eve_token')
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('lilith_eve_token')
      if (!token) {
        throw new Error('No token to refresh')
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed')
      }

      const { token: newToken, user } = data
      localStorage.setItem('lilith_eve_token', newToken)

      setAuthState({
        user,
        token: newToken,
        isAuthenticated: true,
        isLoading: false
      })

      return { success: true }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, logout the user
      await logout()
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Token refresh failed' 
      }
    }
  }, [logout])

  // Check if user has permission
  const hasPermission = useCallback((resource: string, action: string) => {
    if (!authState.user) return false
    
    const permission = authState.user.permissions.find(p => p.resource === resource)
    return permission?.actions.includes(action) || false
  }, [authState.user])

  // Check if user has role
  const hasRole = useCallback((role: string) => {
    return authState.user?.role === role
  }, [authState.user])

  // Get current user
  const getCurrentUser = useCallback(() => {
    return authState.user
  }, [authState.user])

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('lilith_eve_token')
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Profile update failed')
      }

      setAuthState(prev => ({
        ...prev,
        user: data.user
      }))

      return { success: true, user: data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      }
    }
  }, [])

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('lilith_eve_token')
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password change failed')
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password change failed' 
      }
    }
  }, [])

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    
    // Actions
    login,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    
    // Utilities
    hasPermission,
    hasRole,
    getCurrentUser,
  }
} 