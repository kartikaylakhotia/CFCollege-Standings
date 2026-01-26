import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getRatingColor } from '../lib/codeforces'

export default function LeaderboardTable({ data, loading }) {
    if (loading) {
        return (
            <div className="glass-card p-8 flex justify-center">
                <div className="spinner" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-zinc-400">No members yet</p>
            </div>
        )
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">Rank</th>
                            <th>Name</th>
                            <th>CF Handle</th>
                            <th className="text-center">Rating</th>
                            <th className="text-center">Solved</th>
                            <th className="text-center">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <td>
                                    <div className="flex items-center justify-center">
                                        {index === 0 ? (
                                            <span className="text-2xl">🥇</span>
                                        ) : index === 1 ? (
                                            <span className="text-2xl">🥈</span>
                                        ) : index === 2 ? (
                                            <span className="text-2xl">🥉</span>
                                        ) : (
                                            <span className="text-zinc-500 font-medium">#{index + 1}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <Link
                                        to={`/profile/${user.id}`}
                                        className="font-medium text-zinc-200 hover:text-indigo-400 transition-colors"
                                    >
                                        {user.full_name}
                                    </Link>
                                </td>
                                <td>
                                    <a
                                        href={`https://codeforces.com/profile/${user.cf_username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`font-medium ${getRatingColor(user.cf_rating)} hover:underline`}
                                    >
                                        {user.cf_username}
                                    </a>
                                </td>
                                <td className="text-center">
                                    <span className={`font-semibold ${getRatingColor(user.cf_rating)}`}>
                                        {user.cf_rating || '—'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <span className="text-zinc-300 font-medium">{user.totalSolves}</span>
                                </td>
                                <td className="text-center">
                                    {user.streak > 0 ? (
                                        <div className="streak-fire justify-center">
                                            <span>🔥</span>
                                            <span>{user.streak}</span>
                                        </div>
                                    ) : (
                                        <span className="text-zinc-500">—</span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
