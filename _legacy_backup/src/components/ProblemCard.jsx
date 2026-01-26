import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useRecordSolve } from '../hooks/useProblems'
import { checkUserSolved, getRatingColor } from '../lib/codeforces'
import { getProblemUrl, formatDate, getRatingBadgeStyle } from '../utils/helpers'

export default function ProblemCard({ problem, isSolved, onVerified }) {
    const { profile } = useAuth()
    const recordSolve = useRecordSolve()
    const [verifying, setVerifying] = useState(false)
    const [error, setError] = useState(null)

    const handleVerify = async () => {
        if (!profile?.cf_username) return

        setVerifying(true)
        setError(null)

        try {
            const solved = await checkUserSolved(
                profile.cf_username,
                problem.cf_contest_id,
                problem.cf_index
            )

            if (solved) {
                await recordSolve.mutateAsync({
                    userId: profile.id,
                    problemId: problem.id,
                })
                onVerified?.()
            } else {
                setError('Not solved yet')
                setTimeout(() => setError(null), 3000)
            }
        } catch (err) {
            setError(err.message || 'Verification failed')
            setTimeout(() => setError(null), 5000)
        } finally {
            setVerifying(false)
        }
    }

    const ratingStyle = getRatingBadgeStyle(problem.rating)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`problem-card ${isSolved ? 'solved' : ''}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-500 mb-1">
                        {formatDate(problem.date)}
                    </div>
                    <a
                        href={getProblemUrl(problem.cf_contest_id, problem.cf_index)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-zinc-100 hover:text-indigo-400 transition-colors line-clamp-2"
                    >
                        {problem.cf_contest_id}{problem.cf_index}. {problem.name}
                    </a>
                </div>

                {/* Rating Badge */}
                <div
                    className="rating-badge shrink-0"
                    style={ratingStyle}
                >
                    {problem.rating || '?'}
                </div>
            </div>

            {/* Tags */}
            {problem.tags && problem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {problem.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                    {problem.tags.length > 3 && (
                        <span className="tag">+{problem.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <a
                    href={getProblemUrl(problem.cf_contest_id, problem.cf_index)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    Open on CF →
                </a>

                {isSolved ? (
                    <div className="flex items-center gap-2 text-green-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm font-medium">Solved</span>
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerify}
                        disabled={verifying}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${error
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 border border-indigo-500/30'
                            }`}
                    >
                        {verifying ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Checking...
                            </span>
                        ) : error ? (
                            error
                        ) : (
                            'Verify'
                        )}
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}
