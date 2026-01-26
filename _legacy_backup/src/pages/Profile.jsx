import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ContributionHeatmap from '../components/ContributionHeatmap'
import { useAuth } from '../context/AuthContext'
import { useUserStats } from '../hooks/useLeaderboard'
import { getRatingColor, getRatingTier } from '../lib/codeforces'

export default function Profile() {
    const { userId } = useParams()
    const { profile: currentProfile } = useAuth()

    // Use provided userId or fall back to current user
    const targetUserId = userId || currentProfile?.id
    const { data: stats, isLoading } = useUserStats(targetUserId)

    // For displaying user info, we need to get it from leaderboard or current profile
    const profile = userId ? null : currentProfile

    if (isLoading) {
        return (
            <div className="min-h-screen gradient-bg">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <div className="spinner" />
                </div>
            </div>
        )
    }

    const displayProfile = profile || {
        full_name: 'User',
        cf_username: 'unknown',
        cf_rating: null,
        role: 'member',
    }

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                            <span className="text-white text-3xl font-bold">
                                {displayProfile.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-zinc-100 mb-1">
                                {displayProfile.full_name}
                            </h1>
                            <a
                                href={`https://codeforces.com/profile/${displayProfile.cf_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-lg font-medium ${getRatingColor(displayProfile.cf_rating)} hover:underline`}
                            >
                                @{displayProfile.cf_username}
                            </a>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                                {displayProfile.cf_rating && (
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-xl ${getRatingColor(displayProfile.cf_rating)}`}>
                                            {displayProfile.cf_rating}
                                        </span>
                                        <span className="text-zinc-500 text-sm">
                                            {getRatingTier(displayProfile.cf_rating)}
                                        </span>
                                    </div>
                                )}
                                {displayProfile.role !== 'member' && (
                                    <span className={`badge ${displayProfile.role === 'head_admin' ? 'badge-head-admin' : 'badge-admin'
                                        }`}>
                                        {displayProfile.role === 'head_admin' ? 'Head Admin' : 'Admin'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-zinc-100">
                                    {stats?.totalSolves || 0}
                                </div>
                                <div className="text-sm text-zinc-500">Solved</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-orange-400 flex items-center justify-center gap-1">
                                    {stats?.streak > 0 && <span>🔥</span>}
                                    {stats?.streak || 0}
                                </div>
                                <div className="text-sm text-zinc-500">Streak</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contribution Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ContributionHeatmap data={stats?.heatmapData} />
                </motion.div>

                {/* Rating Distribution */}
                {stats?.ratingDistribution && Object.keys(stats.ratingDistribution).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 mt-8"
                    >
                        <h3 className="text-lg font-semibold text-zinc-100 mb-6">
                            Problems by Rating
                        </h3>
                        <div className="flex items-end gap-2 h-40">
                            {Object.entries(stats.ratingDistribution)
                                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                .map(([rating, count]) => {
                                    const maxCount = Math.max(...Object.values(stats.ratingDistribution))
                                    const height = (count / maxCount) * 100

                                    return (
                                        <div key={rating} className="flex-1 flex flex-col items-center gap-2">
                                            <span className="text-xs text-zinc-400">{count}</span>
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all"
                                                style={{ height: `${height}%`, minHeight: '4px' }}
                                            />
                                            <span className="text-xs text-zinc-500">{rating}</span>
                                        </div>
                                    )
                                })}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
