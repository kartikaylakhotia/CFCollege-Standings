import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

export default function Landing() {
    const stats = [
        { label: 'Members', value: '50+' },
        { label: 'Problems', value: '200+' },
        { label: 'Contests', value: '100+' },
    ]

    const features = [
        {
            icon: '📋',
            title: 'Daily Problems',
            description: 'Track your progress with curated POTD challenges from Codeforces.',
        },
        {
            icon: '🔥',
            title: 'Streak Tracking',
            description: 'Build consistency with streak counters and contribution graphs.',
        },
        {
            icon: '🏆',
            title: 'Leaderboard',
            description: 'Compete with guild members and climb the rankings.',
        },
        {
            icon: '✅',
            title: 'Auto Verification',
            description: 'One-click verification of your solves via Codeforces API.',
        },
    ]

    return (
        <div className="min-h-screen gradient-bg">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm text-indigo-300">Now Recruiting Members</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                                MACS DTU
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                CP Guild
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            The premier competitive programming community at Delhi Technological University.
                            Level up your coding skills, track your progress, and compete with the best.
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                                    Join the Guild
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/leaderboard" className="btn-secondary text-lg px-8 py-4">
                                    View Leaderboard
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                            Everything you need to
                            <span className="text-indigo-400"> level up</span>
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">
                            Track your competitive programming journey with our comprehensive suite of tools.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-card p-12 text-center glow-purple"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                        Ready to start your journey?
                    </h2>
                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                        Join our community of competitive programmers and start tracking your progress today.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-block">
                            Get Started
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="text-zinc-500 text-sm">
                        © 2024 MACS DTU. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://codeforces.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                        >
                            Codeforces
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
