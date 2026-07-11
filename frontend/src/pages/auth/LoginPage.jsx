import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import PageLoader from '../../components/common/PageLoader'
import useAuth from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { ROUTES, USER_ROLES } from '../../config/app'

const getDashboardRoute = (role) => {
  if (role === USER_ROLES.FOUNDER) {
    return ROUTES.FOUNDER.DASHBOARD
  }

  if (role === USER_ROLES.INVESTOR) {
    return ROUTES.INVESTOR.DASHBOARD
  }

  return ROUTES.HOME
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    isAuthenticated,
    loading: authLoading,
    profile,
  } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const verificationMessage = location.state?.message || ''

  useEffect(() => {
    if (!authLoading && isAuthenticated && profile) {
      navigate(getDashboardRoute(profile.role), {
        replace: true,
      })
    }
  }, [authLoading, isAuthenticated, profile, navigate])

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await authService.signIn(formData)
    } catch (signInError) {
      setError(
        signInError?.message ||
          'We could not sign you in. Please check your credentials.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return <PageLoader label="Checking your secure session" />
  }

  if (isAuthenticated && profile) {
    return (
      <Navigate
        to={getDashboardRoute(profile.role)}
        replace
      />
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute left-1/4 top-0
          h-96 w-96 rounded-full bg-violet-500/[0.1]
          blur-[130px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute bottom-0 right-0
          h-96 w-96 rounded-full bg-cyan-400/[0.06]
          blur-[130px]
        "
      />

      <div className="section-container relative py-6">
        <div className="flex items-center justify-between">
          <Logo />

          <Link
            to={ROUTES.HOME}
            className="
              focus-ring inline-flex items-center gap-2 rounded-lg
              px-3 py-2 text-sm font-medium text-slate-400
              transition-colors hover:bg-white/[0.05] hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </div>

      <div
        className="
          section-container relative grid min-h-[calc(100vh-88px)]
          items-center gap-12 py-10 lg:grid-cols-2 lg:py-14
        "
      >
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hidden lg:block"
        >
          <div
            className="
              flex h-14 w-14 items-center justify-center
              rounded-2xl border border-violet-400/20
              bg-violet-400/[0.08]
            "
          >
            <LockKeyhole className="h-6 w-6 text-violet-200" />
          </div>

          <h1
            className="
              mt-7 max-w-xl text-5xl font-bold tracking-[-0.055em]
              text-white
            "
          >
            Welcome back to
            <span className="text-gradient"> funding intelligence.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Access your real startup analysis, investor preferences, and
            role-specific Fundora AI workspace securely.
          </p>

          <div className="mt-9 space-y-4">
            {[
              'Secure Supabase authentication',
              'Persistent authenticated sessions',
              'Protected role-based access',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                {item}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            glass-panel mx-auto w-full max-w-lg
            rounded-[2rem] p-6 sm:p-8
          "
        >
          <p className="text-sm font-semibold text-violet-300">
            Secure login
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
            Log in to Fundora AI
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Enter your verified account credentials to continue.
          </p>

          {verificationMessage && (
            <div
              className="
                mt-6 flex items-start gap-3 rounded-xl
                border border-emerald-400/20
                bg-emerald-400/[0.07] px-4 py-3
              "
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

              <p className="text-sm leading-6 text-emerald-200">
                {verificationMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  className="
                    pointer-events-none absolute left-3.5 top-1/2
                    h-4 w-4 -translate-y-1/2 text-slate-500
                  "
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField('email', event.target.value)
                  }
                  placeholder="you@example.com"
                  className="
                    w-full rounded-xl border border-white/[0.09]
                    bg-white/[0.035] py-3 pl-10 pr-4
                    text-sm text-white outline-none
                    placeholder:text-slate-600
                    transition-colors
                    focus:border-violet-400/40
                    focus:bg-white/[0.05]
                  "
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
                  placeholder="Enter your password"
                  className="
                    w-full rounded-xl border border-white/[0.09]
                    bg-white/[0.035] py-3 pl-4 pr-11
                    text-sm text-white outline-none
                    placeholder:text-slate-600
                    transition-colors
                    focus:border-violet-400/40
                    focus:bg-white/[0.05]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    rounded-lg p-1.5 text-slate-500
                    transition-colors hover:text-slate-200
                  "
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="
                  rounded-xl border border-rose-400/20
                  bg-rose-400/[0.07] px-4 py-3
                  text-sm leading-6 text-rose-200
                "
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="
                flex w-full items-center justify-center gap-2
                rounded-xl bg-gradient-to-r
                from-violet-600 to-cyan-500
                px-5 py-3.5 font-semibold text-white
                shadow-[0_12px_40px_rgba(124,58,237,0.25)]
                transition-opacity hover:opacity-95
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing in securely
                </>
              ) : (
                <>
                  Log in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to={ROUTES.SIGNUP}
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              Create one
            </Link>
          </p>
        </motion.section>
      </div>
    </main>
  )
}

export default LoginPage