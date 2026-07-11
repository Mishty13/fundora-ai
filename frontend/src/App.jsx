import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AuthProvider from './context/AuthProvider'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

import FounderDashboard from './pages/founder/FounderDashboard'
import StartupProfile from './pages/founder/StartupProfile'
import ReadinessPage from './pages/founder/ReadinessPage'
import PitchAnalysisPage from './pages/founder/PitchAnalysisPage'
import RoadmapPage from './pages/founder/RoadmapPage'
import InvestorMatches from './pages/founder/InvestorMatches'

import InvestorDashboard from './pages/investor/InvestorDashboard'
import InvestorProfile from './pages/investor/InvestorProfile'
import StartupMatches from './pages/investor/StartupMatches'

import AuthCallback from './components/common/AuthCallback'
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleRoute from './components/common/RoleRoute'

import { ROUTES, USER_ROLES } from './config/app'
import AIAdvisorPage from './pages/founder/AIAdvisorPage'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={<LandingPage />}
          />

          <Route
            path={ROUTES.LOGIN}
            element={<LoginPage />}
          />

          <Route
            path={ROUTES.SIGNUP}
            element={<SignupPage />}
          />

          <Route
            path={ROUTES.AUTH_CALLBACK}
            element={<AuthCallback />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <RoleRoute
                  allowedRole={USER_ROLES.FOUNDER}
                />
              }
            >
              <Route
                path={ROUTES.FOUNDER.DASHBOARD}
                element={<FounderDashboard />}
              />

              <Route
                path={ROUTES.FOUNDER.STARTUP_PROFILE}
                element={<StartupProfile />}
              />

              <Route
                path={ROUTES.FOUNDER.READINESS}
                element={<ReadinessPage />}
              />

              <Route
                path={ROUTES.FOUNDER.PITCH_ANALYSIS}
                element={<PitchAnalysisPage />}
              />

              <Route
                path={ROUTES.FOUNDER.ROADMAP}
                element={<RoadmapPage />}
              />

              <Route
                path={ROUTES.FOUNDER.INVESTOR_MATCHES}
                element={<InvestorMatches />}
              />
              <Route
                path={ROUTES.FOUNDER.AI_ADVISOR}
                element={<AIAdvisorPage />}
              />
            </Route>

            <Route
              element={
                <RoleRoute
                  allowedRole={USER_ROLES.INVESTOR}
                />
              }
            >
              <Route
                path={ROUTES.INVESTOR.DASHBOARD}
                element={<InvestorDashboard />}
              />

              <Route
                path={ROUTES.INVESTOR.PROFILE}
                element={<InvestorProfile />}
              />

              <Route
                path={ROUTES.INVESTOR.STARTUP_MATCHES}
                element={<StartupMatches />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App