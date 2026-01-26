import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/**
 * Hook to fetch pending users (for admin)
 */
export function usePendingUsers() {
    return useQuery({
        queryKey: ['pendingUsers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        },
    })
}

/**
 * Hook to fetch all users (for admin)
 */
export function useAllUsers() {
    return useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        },
    })
}

/**
 * Hook to approve a user
 */
export function useApproveUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId) => {
            const { data, error } = await supabase
                .from('profiles')
                .update({ status: 'approved' })
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

/**
 * Hook to reject (delete) a user
 */
export function useRejectUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId) => {
            // Delete from profiles (will cascade delete from auth via trigger or manually)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingUsers'] })
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
        },
    })
}

/**
 * Hook to promote user to admin
 */
export function usePromoteToAdmin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId) => {
            const { data, error } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
        },
    })
}

/**
 * Hook to demote admin to member
 */
export function useDemoteToMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId) => {
            const { data, error } = await supabase
                .from('profiles')
                .update({ role: 'member' })
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] })
        },
    })
}
