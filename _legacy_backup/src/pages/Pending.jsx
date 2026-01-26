import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Pending() {
    const { profile, signOut } = useAuth()

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⏳</span>
                    </div>

                    <h1 className="text-2xl font-bold text-zinc-100 mb-3">
                        Pending Approval
                    </h1>

                    <p className="text-zinc-400 mb-6">
                        Your account is awaiting approval from an administrator. You'll be able to access the platform once approved.
                    </p>

                    {profile && (
                        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6 text-left">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-zinc-500 text-sm">Name</span>
                                <span className="text-zinc-200">{profile.full_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500 text-sm">CF Handle</span>
                                <span className="text-zinc-200">{profile.cf_username}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.reload()}
                            className="btn-primary w-full py-3"
                        >
                            Check Status
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={signOut}
                            className="btn-secondary w-full py-3"
                        >
                            Sign Out
                        </motion.button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <Link to="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
