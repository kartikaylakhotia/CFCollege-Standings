import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireApproved = true, requireAdmin = false, requireHeadAdmin = false }) {
    const { user, profile, loading, isApproved, isAdmin, isHeadAdmin } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // No profile yet
    if (!profile) {
        return (
            <div className="min-h-screen gradient-bg flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    // Requires head admin
    if (requireHeadAdmin && !isHeadAdmin) {
        return <Navigate to="/" replace />
    }

    // Requires admin
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />
    }

    // Requires approved status
    if (requireApproved && !isApproved) {
        return <Navigate to="/pending" replace />
    }

    return children
}
