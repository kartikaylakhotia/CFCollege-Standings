import { motion } from 'framer-motion'
import { useProblems } from '../../hooks/useProblems'
import { usePendingUsers, useAllUsers } from '../../hooks/useAdmin'
import { useLeaderboard } from '../../hooks/useLeaderboard'

export default function AdminOverview() {
    const { data: problems } = useProblems()
    const { data: pendingUsers } = usePendingUsers()
    const { data: allUsers } = useAllUsers()
    const { data: leaderboard } = useLeaderboard()

    const stats = [
        {
            label: 'Total Problems',
            value: problems?.length || 0,
            icon: '📋',
            color: 'from-indigo-500/20 to-purple-500/20',
        },
        {
            label: 'Active Members',
            value: allUsers?.filter(u => u.status === 'approved').length || 0,
            icon: '👥',
            color: 'from-green-500/20 to-emerald-500/20',
        },
        {
            label: 'Pending Approvals',
            value: pendingUsers?.length || 0,
            icon: '⏳',
            color: 'from-yellow-500/20 to-orange-500/20',
        },
        {
            label: 'Total Solves',
            value: leaderboard?.reduce((acc, u) => acc + u.totalSolves, 0) || 0,
            icon: '✅',
            color: 'from-cyan-500/20 to-blue-500/20',
        },
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card p-6 bg-gradient-to-br ${stat.color}`}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <div>
                                <div className="text-3xl font-bold text-zinc-100">{stat.value}</div>
                                <div className="text-sm text-zinc-400">{stat.label}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
            >
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a
                        href="/admin/problems"
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">➕</span>
                            <div>
                                <div className="font-medium text-zinc-200">Add Problem</div>
                                <div className="text-sm text-zinc-500">Add a new daily problem</div>
                            </div>
                        </div>
                    </a>
                    <a
                        href="/admin/users"
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">👤</span>
                            <div>
                                <div className="font-medium text-zinc-200">Manage Users</div>
                                <div className="text-sm text-zinc-500">
                                    {pendingUsers?.length || 0} pending approvals
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </motion.div>

            {/* Recent Problems */}
            {problems && problems.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h3 className="text-lg font-semibold text-zinc-100 mb-4">Recent Problems</h3>
                    <div className="space-y-3">
                        {problems.slice(0, 5).map((problem) => (
                            <div
                                key={problem.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                            >
                                <div>
                                    <div className="font-medium text-zinc-200">
                                        {problem.cf_contest_id}{problem.cf_index}. {problem.name}
                                    </div>
                                    <div className="text-sm text-zinc-500">{problem.date}</div>
                                </div>
                                <div className="rating-badge" style={{
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    color: '#a5b4fc'
                                }}>
                                    {problem.rating || '?'}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
