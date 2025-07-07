import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Dashboard from '@pages/Dashboard'
import Login from '@pages/Login'
import { useAuth } from '@hooks/useAuth'
import Sidebar from '@components/Sidebar'
import Header from '@components/Header'
import LoadingSpinner from '@components/LoadingSpinner'

/**
 * Main App Component
 * 
 * This is the root component that handles routing and authentication.
 * It provides the main layout structure for the Lilith.Eve dashboard.
 * 
 * Features:
 * - Authentication routing
 * - Dashboard layout with sidebar and header
 * - Protected routes
 * - Loading states
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  // Main dashboard layout
  return (
    <Flex h="100vh" bg="gray.900">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <Box flex="1" overflow="auto" p={6}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<div>Patients Page</div>} />
            <Route path="/analysis" element={<div>Analysis Page</div>} />
            <Route path="/treatments" element={<div>Treatments Page</div>} />
            <Route path="/monitoring" element={<div>Monitoring Page</div>} />
            <Route path="/admin" element={<div>Admin Page</div>} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  )
}

export default App 