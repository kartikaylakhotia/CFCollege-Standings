import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ProblemCard from '../components/ProblemCard'
import { useAuth } from '../context/AuthContext'
import { useProblems, useUserSolves } from '../hooks/useProblems'

export default function Sheet() {
    const { profile } = useAuth()
    const { data: problems, isLoading: problemsLoading } = useProblems()
    const { data: solves, isLoading: solvesLoading, refetch: refetchSolves } = useUserSolves(profile?.id)

    const solvedSet = useMemo(() => {
        return new Set(solves?.map((s) => s.problem_id) || [])
    }, [solves])

    const stats = useMemo(() => {
        const total = problems?.length || 0
        const solved = solvedSet.size
        const percentage = total > 0 ? Math.round((solved / total) * 100) : 0
        return { total, solved, percentage }
    }, [problems, solvedSet])

    const loading = problemsLoading || solvesLoading

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2">Problem Sheet</h1>
                    <p className="text-zinc-400">
                        Solve daily problems and track your progress
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-8">
                            <div>
                                <div className="text-3xl font-bold text-zinc-100">{stats.solved}</div>
                                <div className="text-sm text-zinc-500">Solved</div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div>
                                <div className="text-3xl font-bold text-zinc-100">{stats.total}</div>
                                <div className="text-sm text-zinc-500">Total</div>
                            </div>
                            <div className="w-px h-12 bg-white/10" />
                            <div>
                                <div className="text-3xl font-bold text-green-400">{stats.percentage}%</div>
                                <div className="text-sm text-zinc-500">Complete</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 max-w-md">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-zinc-400">Progress</span>
                                <span className="text-zinc-400">{stats.solved}/{stats.total}</span>
                            </div>
                            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.percentage}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Problems Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="spinner" />
                    </div>
                ) : problems && problems.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {problems.map((problem, index) => (
                            <motion.div
                                key={problem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProblemCard
                                    problem={problem}
                                    isSolved={solvedSet.has(problem.id)}
                                    onVerified={refetchSolves}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-12 text-center"
                    >
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold text-zinc-200 mb-2">No problems yet</h3>
                        <p className="text-zinc-400">
                            Problems will appear here once an admin adds them.
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
