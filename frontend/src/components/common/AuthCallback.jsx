import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { ROUTES, USER_ROLES } from '../../config/app'
import PageLoader from './PageLoader'

function AuthCallback() {
  const navigate = useNavigate()
  const { profile, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: {
          message: 'Email verified. You can now log in.',
        },
      })
      return
    }

    if (profile?.role === USER_ROLES.FOUNDER) {
      navigate(ROUTES.FOUNDER.DASHBOARD, { replace: true })
      return
    }

    if (profile?.role === USER_ROLES.INVESTOR) {
      navigate(ROUTES.INVESTOR.DASHBOARD, { replace: true })
    }
  }, [profile, loading, isAuthenticated, navigate])

  return <PageLoader label="Verifying your account" />
}

export default AuthCallback