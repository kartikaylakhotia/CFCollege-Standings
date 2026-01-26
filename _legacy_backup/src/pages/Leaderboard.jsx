import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import LeaderboardTable from '../components/LeaderboardTable'
import { useLeaderboard } from '../hooks/useLeaderboard'

export default function Leaderboard() {
    const { data: leaderboard, isLoading } = useLeaderboard()

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2">Leaderboard</h1>
                    <p className="text-zinc-400">
                        See how you rank against other guild members
                    </p>
                </motion.div>

                {/* Stats Row */}
                {leaderboard && leaderboard.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-3 gap-6 mb-8"
                    >
                        {[0, 1, 2].map((index) => {
                            const user = leaderboard[index]
                            if (!user) return null

                            const medals = ['🥇', '🥈', '🥉']
                            const gradients = [
                                'from-yellow-500/20 to-orange-500/20',
                                'from-zinc-400/20 to-zinc-500/20',
                                'from-amber-600/20 to-orange-600/20',
                            ]

                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className={`glass-card p-6 bg-gradient-to-br ${gradients[index]}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{medals[index]}</div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-zinc-100 truncate">
                                                {user.full_name}
                                            </h3>
                                            <p className="text-zinc-400 text-sm">{user.cf_username}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-zinc-100">
                                                {user.totalSolves}
                                            </div>
                                            <div className="text-xs text-zinc-500">solves</div>
                                        </div>
                                    </div>
                                    {user.streak > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
                                            <span className="text-lg">🔥</span>
                                            <span className="text-orange-400 font-semibold">
                                                {user.streak} day streak!
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                {/* Full Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <LeaderboardTable data={leaderboard} loading={isLoading} />
                </motion.div>
            </main>
        </div>
    )
}
