import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useProblems, useAddProblem, useDeleteProblem } from '../../hooks/useProblems'
import { getTodayDate, formatDate, getProblemUrl, getRatingBadgeStyle } from '../../utils/helpers'

export default function ProblemManager() {
    const { profile } = useAuth()
    const { data: problems, isLoading } = useProblems()
    const addProblem = useAddProblem()
    const deleteProblem = useDeleteProblem()

    const [problemInput, setProblemInput] = useState('')
    const [dateInput, setDateInput] = useState(getTodayDate())
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        try {
            await addProblem.mutateAsync({
                problemInput,
                date: dateInput,
                userId: profile?.id,
            })
            setProblemInput('')
            setSuccess('Problem added successfully!')
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            setError(err.message || 'Failed to add problem')
        }
    }

    const handleDelete = async (problemId) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return

        try {
            await deleteProblem.mutateAsync(problemId)
        } catch (err) {
            setError(err.message || 'Failed to delete problem')
        }
    }

    return (
        <div className="space-y-8">
            {/* Add Problem Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">Add New Problem</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Problem ID or URL
                            </label>
                            <input
                                type="text"
                                value={problemInput}
                                onChange={(e) => setProblemInput(e.target.value)}
                                placeholder="e.g., 1955C or codeforces.com/problemset/problem/1955/C"
                                className="input-field"
                                required
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                Supports formats: 1955C, 1955/C, or full Codeforces URL
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                        >
                            {success}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={addProblem.isPending}
                        className="btn-primary py-3 px-6"
                    >
                        {addProblem.isPending ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Fetching from CF...
                            </span>
                        ) : (
                            'Add Problem'
                        )}
                    </motion.button>
                </form>
            </motion.div>

            {/* Problems List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card overflow-hidden"
            >
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-zinc-100">
                        All Problems ({problems?.length || 0})
                    </h3>
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center">
                        <div className="spinner" />
                    </div>
                ) : problems && problems.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Problem</th>
                                    <th className="text-center">Rating</th>
                                    <th>Tags</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((problem) => (
                                    <tr key={problem.id}>
                                        <td>
                                            <span className="text-zinc-400">{formatDate(problem.date)}</span>
                                        </td>
                                        <td>
                                            <a
                                                href={getProblemUrl(problem.cf_contest_id, problem.cf_index)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-zinc-200 hover:text-indigo-400 transition-colors"
                                            >
                                                {problem.cf_contest_id}{problem.cf_index}. {problem.name}
                                            </a>
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className="rating-badge"
                                                style={getRatingBadgeStyle(problem.rating)}
                                            >
                                                {problem.rating || '?'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1">
                                                {problem.tags?.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="tag">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {problem.tags?.length > 2 && (
                                                    <span className="text-xs text-zinc-500">
                                                        +{problem.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(problem.id)}
                                                disabled={deleteProblem.isPending}
                                                className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                                            >
                                                Delete
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-zinc-400">
                        No problems added yet
                    </div>
                )}
            </motion.div>
        </div>
    )
}
