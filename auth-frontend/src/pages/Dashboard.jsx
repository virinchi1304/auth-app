import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { logout, getCurrentUser, getStoredUser, isAuthenticated } from '../services/authService'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated on component mount
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    // Load user data
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        
        // First try to get user from localStorage
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        // Then fetch fresh user data from backend
        const response = await getCurrentUser()
        if (response.success) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        setError('Failed to load user data')
        
        // If token is invalid, redirect to login
        if (error.message?.includes('Invalid token') || error.message?.includes('Access denied')) {
          logout()
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [navigate])

  const handleLogout = () => {
    logout() // This will clear tokens and redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-dark-muted)' }}>Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 
                className="text-4xl font-bold mb-4"
                style={{ color: 'var(--color-accent-green)' }}
              >
                Welcome to Ahaa Dashboard! 🎉
              </h1>
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <p className="text-xl mb-2" style={{ color: 'var(--color-dark-text)' }}>
                    Hello, <span style={{ color: 'var(--color-accent-blue)' }}>{user.username}</span>! 
                  </p>
                  <p style={{ color: 'var(--color-dark-muted)' }}>
                    Email: {user.email}
                  </p>
                  <p style={{ color: 'var(--color-dark-muted)' }}>
                    Member since: {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </motion.div>
              )}
              <p style={{ color: 'var(--color-dark-muted)' }}>
                You've successfully authenticated with your account.
              </p>
              <p className="mt-4" style={{ color: 'var(--color-dark-text)' }}>
                This is your protected dashboard area. Only authenticated users can see this content.
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{ 
                backgroundColor: 'var(--color-accent-blue)',
                color: 'white'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg border"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
              }}
            >
              {error}
            </motion.div>
          )}

          {/* Additional dashboard content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid gap-6 md:grid-cols-2"
          >
            <div 
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)'
              }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-accent-blue)' }}>
                Account Status
              </h3>
              <p style={{ color: 'var(--color-dark-text)' }}>
                 Account verified and active
              </p>
              <p style={{ color: 'var(--color-dark-muted)' }}>
                Your authentication is working perfectly!
              </p>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)'
              }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-accent-green)' }}>
                Security
              </h3>
              <p style={{ color: 'var(--color-dark-text)' }}>
                 JWT Authentication Active
              </p>
              <p style={{ color: 'var(--color-dark-muted)' }}>
                Your session is secure and protected
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
