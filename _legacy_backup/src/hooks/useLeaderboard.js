import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * Calculate streak for a user based on their solves
 */
function calculateStreak(solves) {
    if (!solves || solves.length === 0) return 0

    // Get unique solve dates
    const solveDates = [...new Set(
        solves.map(s => new Date(s.solved_at).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a))

    if (solveDates.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const lastSolveDate = new Date(solveDates[0])
    lastSolveDate.setHours(0, 0, 0, 0)

    // Check if streak is active (solved today or yesterday)
    if (lastSolveDate < yesterday) return 0

    let streak = 1
    let currentDate = lastSolveDate

    for (let i = 1; i < solveDates.length; i++) {
        const prevDate = new Date(solveDates[i])
        prevDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(currentDate)
        expectedDate.setDate(expectedDate.getDate() - 1)

        if (prevDate.getTime() === expectedDate.getTime()) {
            streak++
            currentDate = prevDate
        } else {
            break
        }
    }

    return streak
}

/**
 * Hook to fetch leaderboard data
 */
export function useLeaderboard() {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            // Fetch all approved profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('status', 'approved')
                .order('cf_rating', { ascending: false })

            if (profilesError) throw profilesError

            // Fetch all solves
            const { data: allSolves, error: solvesError } = await supabase
                .from('user_solves')
                .select('*')

            if (solvesError) throw solvesError

            // Group solves by user
            const solvesByUser = {}
            allSolves.forEach(solve => {
                if (!solvesByUser[solve.user_id]) {
                    solvesByUser[solve.user_id] = []
                }
                solvesByUser[solve.user_id].push(solve)
            })

            // Build leaderboard entries
            const leaderboard = profiles.map(profile => ({
                ...profile,
                totalSolves: solvesByUser[profile.id]?.length || 0,
                streak: calculateStreak(solvesByUser[profile.id] || []),
                solves: solvesByUser[profile.id] || [],
            }))

            // Sort by total solves, then by streak, then by rating
            leaderboard.sort((a, b) => {
                if (b.totalSolves !== a.totalSolves) return b.totalSolves - a.totalSolves
                if (b.streak !== a.streak) return b.streak - a.streak
                return (b.cf_rating || 0) - (a.cf_rating || 0)
            })

            return leaderboard
        },
        staleTime: 30000, // 30 seconds
    })
}

/**
 * Hook to get user stats for profile
 */
export function useUserStats(userId) {
    return useQuery({
        queryKey: ['userStats', userId],
        queryFn: async () => {
            if (!userId) return null

            // Fetch user solves
            const { data: solves, error } = await supabase
                .from('user_solves')
                .select(`
          *,
          daily_problems (*)
        `)
                .eq('user_id', userId)

            if (error) throw error

            // Calculate stats
            const totalSolves = solves.length
            const streak = calculateStreak(solves)

            // Build heatmap data (last 365 days)
            const heatmapData = {}
            const today = new Date()

            for (let i = 0; i < 365; i++) {
                const date = new Date(today)
                date.setDate(date.getDate() - i)
                const dateStr = date.toISOString().split('T')[0]
                heatmapData[dateStr] = 0
            }

            solves.forEach(solve => {
                const dateStr = new Date(solve.solved_at).toISOString().split('T')[0]
                if (heatmapData[dateStr] !== undefined) {
                    heatmapData[dateStr]++
                }
            })

            // Calculate rating distribution of solved problems
            const ratingDistribution = {}
            solves.forEach(solve => {
                const rating = solve.daily_problems?.rating
                if (rating) {
                    const bucket = Math.floor(rating / 200) * 200
                    ratingDistribution[bucket] = (ratingDistribution[bucket] || 0) + 1
                }
            })

            return {
                totalSolves,
                streak,
                heatmapData,
                ratingDistribution,
                solves,
            }
        },
        enabled: !!userId,
    })
}
