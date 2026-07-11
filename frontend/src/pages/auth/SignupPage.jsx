import { useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
  Rocket,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import { authService } from '../../services/authService'
import { ROUTES, USER_ROLES } from '../../config/app'

const roles = [
  {
    value: USER_ROLES.FOUNDER,
    title: 'Founder',
    description:
      'Evaluate your startup, analyze your pitch, and discover aligned investors.',
    icon: Rocket,
  },
  {
    value: USER_ROLES.INVESTOR,
    title: 'Investor',
    description:
      'Define your preferences and discover startups with explainable compatibility.',
    icon: Building2,
  },
]

function SignupPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    if (formData.fullName.trim().length < 2) {
      return 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      return 'Please enter your email address.'
    }

    if (formData.password.length < 8) {
      return 'Password must contain at least 8 characters.'
    }

    if (!formData.role) {
      return 'Please select whether you are a founder or investor.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const data = await authService.signUp(formData)

      if (data.session) {
        navigate(ROUTES.AUTH_CALLBACK, { replace: true })
        return
      }

      setSuccess(true)
    } catch (signupError) {
      setError(
        signupError?.message ||
          'We could not create your account. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-950 px-4 py-12">
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute left-1/2 top-1/2
            h-96 w-96 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-violet-500/15 blur-[120px]
          "
        />

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            glass-panel relative w-full max-w-lg
            rounded-[2rem] p-7 text-center sm:p-10
          "
        >
          <div
            className="
              mx-auto flex h-16 w-16 items-center justify-center
              rounded-2xl border border-emerald-400/20
              bg-emerald-400/[0.08]
            "
          >
            <Mail className="h-7 w-7 text-emerald-300" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white">
            Check your email
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            We sent a verification link to{' '}
            <span className="font-medium text-slate-200">
              {formData.email.trim().toLowerCase()}
            </span>
            . Open the link to verify your Fundora AI account.
          </p>

          <div
            className="
              mt-6 flex items-start gap-3 rounded-xl
              border border-white/[0.07] bg-white/[0.035]
              p-4 text-left
            "
          >
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

            <p className="text-sm leading-6 text-slate-400">
              After verification, you'll be able to sign in and continue to
              your role-specific Fundora AI experience.
            </p>
          </div>

          <Link
            to={ROUTES.LOGIN}
            className="
              mt-7 inline-flex items-center justify-center gap-2
              rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500
              px-6 py-3 font-semibold text-white
              transition-opacity hover:opacity-90
            "
          >
            Go to login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-32 top-20
          h-96 w-96 rounded-full bg-violet-500/[0.1]
          blur-[130px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-32 bottom-10
          h-96 w-96 rounded-full bg-cyan-400/[0.07]
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
          items-center gap-12 py-10 lg:grid-cols-[0.85fr_1.15fr]
          lg:py-14
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
          <span
            className="
              inline-flex items-center gap-2 rounded-full
              border border-violet-400/20 bg-violet-400/[0.07]
              px-3.5 py-2 text-sm font-medium text-violet-200
            "
          >
            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
            Real data. Explainable intelligence.
          </span>

          <h1
            className="
              mt-7 max-w-xl text-5xl font-bold tracking-[-0.055em]
              text-white
            "
          >
            Build your path to
            <span className="text-gradient"> better funding decisions.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Join Fundora AI as a founder or investor and access intelligence
            built around genuine profiles, transparent scoring, and real AI
            analysis.
          </p>

          <div className="mt-9 space-y-4">
            {[
              'Secure account powered by Supabase Auth',
              'Role-specific founder and investor experiences',
              'No fabricated scores or simulated AI results',
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
            glass-panel mx-auto w-full max-w-2xl
            rounded-[2rem] p-5 sm:p-8
          "
        >
          <div>
            <p className="text-sm font-semibold text-violet-300">
              Create your account
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
              Get started with Fundora AI
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Choose your role and create a secure account with your real
              information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  className="
                    pointer-events-none absolute left-3.5 top-1/2
                    h-4 w-4 -translate-y-1/2 text-slate-500
                  "
                />

                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField('fullName', event.target.value)
                  }
                  placeholder="Enter your full name"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(event) =>
                    updateField('password', event.target.value)
                  }
                  placeholder="Minimum 8 characters"
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

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-slate-300">
                I am joining as
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const Icon = role.icon
                  const selected = formData.role === role.value

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => updateField('role', role.value)}
                      className={`
                        rounded-xl border p-4 text-left
                        transition-all duration-200
                        ${
                          selected
                            ? 'border-violet-400/50 bg-violet-400/[0.1]'
                            : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.16] hover:bg-white/[0.045]'
                        }
                      `}
                      aria-pressed={selected}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`
                            flex h-10 w-10 shrink-0 items-center
                            justify-center rounded-xl
                            ${
                              selected
                                ? 'bg-violet-400/15 text-violet-200'
                                : 'bg-white/[0.05] text-slate-400'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {role.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </fieldset>

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
                transition-opacity
                hover:opacity-95
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating secure account
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              Log in
            </Link>
          </p>
        </motion.section>
      </div>
    </main>
  )
}

export default SignupPage