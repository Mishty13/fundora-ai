import {
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from 'react'
  
  import { AuthContext } from './authContext'
  import { authService } from '../services/authService'
  
  function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
  
    const loadProfile = useCallback(async (currentUser) => {
      if (!currentUser) {
        setProfile(null)
        return null
      }
  
      const currentProfile = await authService.getProfile(currentUser.id)
  
      setProfile(currentProfile)
  
      return currentProfile
    }, [])
  
    useEffect(() => {
      let active = true
  
      const initializeAuth = async () => {
        try {
          const currentSession = await authService.getSession()
  
          if (!active) {
            return
          }
  
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
  
          if (currentSession?.user) {
            await loadProfile(currentSession.user)
          }
        } catch (error) {
          console.error('Failed to initialize authentication:', error)
  
          if (active) {
            setSession(null)
            setUser(null)
            setProfile(null)
          }
        } finally {
          if (active) {
            setLoading(false)
          }
        }
      }
  
      initializeAuth()
  
      const {
        data: { subscription },
      } = authService.onAuthStateChange(
        async (_event, currentSession) => {
          if (!active) {
            return
          }
  
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
  
          try {
            if (currentSession?.user) {
              await loadProfile(currentSession.user)
            } else {
              setProfile(null)
            }
          } catch (error) {
            console.error(
              'Failed to load authenticated profile:',
              error
            )
  
            setProfile(null)
          } finally {
            setLoading(false)
          }
        }
      )
  
      return () => {
        active = false
        subscription.unsubscribe()
      }
    }, [loadProfile])
  
    const signOut = useCallback(async () => {
      await authService.signOut()
    }, [])
  
    const refreshProfile = useCallback(() => {
      return loadProfile(user)
    }, [loadProfile, user])
  
    const value = useMemo(
      () => ({
        session,
        user,
        profile,
        loading,
        isAuthenticated: Boolean(session?.user),
        signOut,
        refreshProfile,
      }),
      [
        session,
        user,
        profile,
        loading,
        signOut,
        refreshProfile,
      ]
    )
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
  }
  
  export default AuthProvider