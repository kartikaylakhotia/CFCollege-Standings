import { motion } from 'framer-motion'
import { useApproveUser, useRejectUser, usePromoteToAdmin, useDemoteToMember } from '../hooks/useAdmin'
import { getRatingColor } from '../lib/codeforces'

export default function UserTable({ users, loading, showActions = false, showRoleActions = false }) {
    const approveUser = useApproveUser()
    const rejectUser = useRejectUser()
    const promoteToAdmin = usePromoteToAdmin()
    const demoteToMember = useDemoteToMember()

    if (loading) {
        return (
            <div className="glass-card p-8 flex justify-center">
                <div className="spinner" />
            </div>
        )
    }

    if (!users || users.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-zinc-400">No users found</p>
            </div>
        )
    }

    const handleApprove = async (userId) => {
        await approveUser.mutateAsync(userId)
    }

    const handleReject = async (userId) => {
        if (window.confirm('Are you sure you want to reject this user?')) {
            await rejectUser.mutateAsync(userId)
        }
    }

    const handlePromote = async (userId) => {
        await promoteToAdmin.mutateAsync(userId)
    }

    const handleDemote = async (userId) => {
        await demoteToMember.mutateAsync(userId)
    }

    const getRoleBadge = (role) => {
        switch (role) {
            case 'head_admin':
                return <span className="badge badge-head-admin">Head Admin</span>
            case 'admin':
                return <span className="badge badge-admin">Admin</span>
            default:
                return <span className="badge" style={{ background: 'rgba(100,100,100,0.2)', color: '#888' }}>Member</span>
        }
    }

    const getStatusBadge = (status) => {
        return status === 'approved' ? (
            <span className="badge badge-approved">Approved</span>
        ) : (
            <span className="badge badge-pending">Pending</span>
        )
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>CF Handle</th>
                            <th className="text-center">Rating</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Role</th>
                            {(showActions || showRoleActions) && <th className="text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <td>
                                    <span className="font-medium text-zinc-200">{user.full_name}</span>
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
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="text-center">
                                    {getRoleBadge(user.role)}
                                </td>
                                {(showActions || showRoleActions) && (
                                    <td className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {showActions && user.status === 'pending' && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleApprove(user.id)}
                                                        disabled={approveUser.isPending}
                                                        className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-all"
                                                    >
                                                        Approve
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleReject(user.id)}
                                                        disabled={rejectUser.isPending}
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-all"
                                                    >
                                                        Reject
                                                    </motion.button>
                                                </>
                                            )}
                                            {showRoleActions && user.role === 'member' && user.status === 'approved' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handlePromote(user.id)}
                                                    disabled={promoteToAdmin.isPending}
                                                    className="px-3 py-1.5 text-xs font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-all"
                                                >
                                                    Promote
                                                </motion.button>
                                            )}
                                            {showRoleActions && user.role === 'admin' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDemote(user.id)}
                                                    disabled={demoteToMember.isPending}
                                                    className="px-3 py-1.5 text-xs font-medium bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30 rounded-lg transition-all"
                                                >
                                                    Demote
                                                </motion.button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
