import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                    setLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    async function fetchProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    async function signUp({ email, password, fullName, cfUsername }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) throw error

        // Create profile
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                cf_username: cfUsername,
                role: 'member',
                status: 'pending',
            })

            if (profileError) throw profileError
        }

        return data
    }

    async function signIn({ email, password }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setProfile(null)
    }

    async function updateProfile(updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error
        setProfile(data)
        return data
    }

    const isApproved = profile?.status === 'approved'
    const isAdmin = profile?.role === 'admin' || profile?.role === 'head_admin'
    const isHeadAdmin = profile?.role === 'head_admin'

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        isApproved,
        isAdmin,
        isHeadAdmin,
        refreshProfile: () => user && fetchProfile(user.id),
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
