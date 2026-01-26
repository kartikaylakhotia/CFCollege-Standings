import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { fetchProblemInfo, parseProblemId } from '../lib/codeforces'

/**
 * Hook to fetch daily problems
 */
export function useProblems() {
    return useQuery({
        queryKey: ['problems'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('daily_problems')
                .select('*')
                .order('date', { ascending: false })

            if (error) throw error
            return data
        },
    })
}

/**
 * Hook to fetch user solves
 */
export function useUserSolves(userId) {
    return useQuery({
        queryKey: ['solves', userId],
        queryFn: async () => {
            if (!userId) return []

            const { data, error } = await supabase
                .from('user_solves')
                .select('*')
                .eq('user_id', userId)

            if (error) throw error
            return data
        },
        enabled: !!userId,
    })
}

/**
 * Hook to add a new problem
 */
export function useAddProblem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ problemInput, date, userId }) => {
            // Parse the problem ID
            const { contestId, index } = parseProblemId(problemInput)

            // Fetch problem metadata from CF
            const problemInfo = await fetchProblemInfo(contestId, index)

            // Insert into database
            const { data, error } = await supabase
                .from('daily_problems')
                .insert({
                    date,
                    cf_contest_id: contestId,
                    cf_index: index,
                    name: problemInfo.name,
                    rating: problemInfo.rating,
                    tags: problemInfo.tags,
                    created_by: userId,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['problems'] })
        },
    })
}

/**
 * Hook to record a solve
 */
export function useRecordSolve() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ userId, problemId }) => {
            const { data, error } = await supabase
                .from('user_solves')
                .insert({
                    user_id: userId,
                    problem_id: problemId,
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['solves', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

/**
 * Hook to delete a problem
 */
export function useDeleteProblem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (problemId) => {
            const { error } = await supabase
                .from('daily_problems')
                .delete()
                .eq('id', problemId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['problems'] })
        },
    })
}
