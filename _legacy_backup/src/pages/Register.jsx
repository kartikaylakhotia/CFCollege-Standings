import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchUserInfo } from '../lib/codeforces'

export default function Register() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [cfValidating, setCfValidating] = useState(false)
    const [cfValidated, setCfValidated] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        cfUsername: '',
    })

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
        if (e.target.name === 'cfUsername') {
            setCfValidated(false)
        }
    }

    const validateCfHandle = async () => {
        if (!formData.cfUsername.trim()) return

        setCfValidating(true)
        setError(null)

        try {
            await fetchUserInfo(formData.cfUsername)
            setCfValidated(true)
        } catch (err) {
            setError('Invalid Codeforces handle')
            setCfValidated(false)
        } finally {
            setCfValidating(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        if (!cfValidated) {
            setError('Please validate your Codeforces handle first')
            setLoading(false)
            return
        }

        try {
            await signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                cfUsername: formData.cfUsername,
            })
            navigate('/pending')
        } catch (err) {
            setError(err.message || 'Failed to sign up')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        MACS CP
                    </span>
                </Link>

                <div className="glass-card p-8">
                    <h1 className="text-2xl font-bold text-zinc-100 text-center mb-2">
                        Join the Guild
                    </h1>
                    <p className="text-zinc-400 text-center mb-8">
                        Create your account to get started
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Codeforces Handle
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="cfUsername"
                                    value={formData.cfUsername}
                                    onChange={handleChange}
                                    required
                                    className="input-field flex-1"
                                    placeholder="tourist"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={validateCfHandle}
                                    disabled={cfValidating || !formData.cfUsername.trim()}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${cfValidated
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30'
                                        }`}
                                >
                                    {cfValidating ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : cfValidated ? (
                                        '✓ Valid'
                                    ) : (
                                        'Verify'
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-zinc-500">Already have an account? </span>
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
