import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { ROUTES } from '../../config/app'
import PageLoader from './PageLoader'

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <PageLoader label="Restoring your secure session" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute