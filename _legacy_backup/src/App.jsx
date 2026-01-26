import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Pending from './pages/Pending'
import Sheet from './pages/Sheet'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminOverview from './pages/admin/Overview'
import ProblemManager from './pages/admin/ProblemManager'
import UserManagement from './pages/admin/UserManagement'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Pending Route */}
            <Route
              path="/pending"
              element={
                <ProtectedRoute requireApproved={false}>
                  <Pending />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes (Approved Users) */}
            <Route
              path="/sheet"
              element={
                <ProtectedRoute>
                  <Sheet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="problems" element={<ProblemManager />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requireHeadAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
