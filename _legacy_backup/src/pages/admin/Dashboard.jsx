import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
    const { isHeadAdmin } = useAuth()
    const location = useLocation()

    const tabs = [
        { path: '/admin', label: 'Overview', exact: true },
        { path: '/admin/problems', label: 'Problem Manager' },
        ...(isHeadAdmin ? [{ path: '/admin/users', label: 'User Management' }] : []),
    ]

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path
        return location.pathname.startsWith(path)
    }

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
                    <h1 className="text-3xl font-bold text-zinc-100 mb-2">Admin Dashboard</h1>
                    <p className="text-zinc-400">Manage problems and users</p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2"
                >
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${isActive(tab.path, tab.exact)
                                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </motion.div>

                {/* Content */}
                <Outlet />
            </main>
        </div>
    )
}
