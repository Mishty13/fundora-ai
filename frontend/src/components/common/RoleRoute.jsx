import { Navigate, Outlet } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { ROUTES, USER_ROLES } from '../../config/app'
import PageLoader from './PageLoader'

const getDashboardRoute = (role) => {
  if (role === USER_ROLES.FOUNDER) {
    return ROUTES.FOUNDER.DASHBOARD
  }

  if (role === USER_ROLES.INVESTOR) {
    return ROUTES.INVESTOR.DASHBOARD
  }

  return ROUTES.HOME
}

function RoleRoute({ allowedRole }) {
  const { profile, loading } = useAuth()

  if (loading) {
    return <PageLoader label="Verifying account access" />
  }

  if (!profile) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  if (profile.role !== allowedRole) {
    return <Navigate to={getDashboardRoute(profile.role)} replace />
  }

  return <Outlet />
}

export default RoleRoute