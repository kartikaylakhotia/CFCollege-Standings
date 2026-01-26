import { useState } from 'react'
import { motion } from 'framer-motion'
import UserTable from '../../components/UserTable'
import { usePendingUsers, useAllUsers } from '../../hooks/useAdmin'

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('pending')
    const { data: pendingUsers, isLoading: pendingLoading } = usePendingUsers()
    const { data: allUsers, isLoading: allLoading } = useAllUsers()

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                        }`}
                >
                    Pending ({pendingUsers?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                        }`}
                >
                    All Users ({allUsers?.length || 0})
                </button>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {activeTab === 'pending' ? (
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-zinc-100">Pending Approvals</h3>
                            <p className="text-sm text-zinc-400">
                                Review and approve new member requests
                            </p>
                        </div>
                        <UserTable
                            users={pendingUsers}
                            loading={pendingLoading}
                            showActions={true}
                        />
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-zinc-100">All Users</h3>
                            <p className="text-sm text-zinc-400">
                                Manage member roles and permissions
                            </p>
                        </div>
                        <UserTable
                            users={allUsers}
                            loading={allLoading}
                            showRoleActions={true}
                        />
                    </>
                )}
            </motion.div>
        </div>
    )
}
