import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, profile, isAdmin, isApproved, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/sheet', label: 'Sheet', requireApproved: true },
        { path: '/leaderboard', label: 'Leaderboard', requireApproved: false },
    ]

    return (
        <nav className="navbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                MACS CP
                            </span>
                        </motion.div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            if (link.requireApproved && !isApproved) return null
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                            ? 'bg-white/10 text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith('/admin')
                                        ? 'bg-purple-500/20 text-purple-400'
                                        : 'text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10'
                                    }`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {profile && (
                                    <Link
                                        to="/profile"
                                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {profile.full_name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm text-zinc-300">{profile.cf_username}</span>
                                    </Link>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSignOut}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-all"
                                >
                                    Sign Out
                                </motion.button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                        Join Guild
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
