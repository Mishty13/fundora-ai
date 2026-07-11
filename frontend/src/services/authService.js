import { supabase } from '../lib/supabase'

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const authService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return data.session
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return user
  },

  async getProfile(userId) {
    return getProfile(userId)
  },

  async signUp({ email, password, fullName, role }) {
    const emailRedirectTo = `${window.location.origin}/auth/callback`

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    })

    if (error) {
      throw error
    }

    return data
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      throw error
    }

    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}