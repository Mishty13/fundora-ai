import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileSearch,
  LogOut,
  MapPin,
  Menu,
  Route,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import PageLoader from '../../components/common/PageLoader'
import useAuth from '../../hooks/useAuth'
import { startupService } from '../../services/startupService'
import { readinessService } from '../../services/readinessService'
import { ROUTES } from '../../config/app'

const STAGE_LABELS = Object.freeze({
  idea: 'Idea',
  pre_seed: 'Pre-seed',
  seed: 'Seed',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
  growth: 'Growth',
})

const REVENUE_LABELS = Object.freeze({
  pre_revenue: 'Pre-revenue',
  revenue_generating: 'Revenue generating',
})

const FUNDING_LABELS = Object.freeze({
  bootstrapped: 'Bootstrapped',
  grant_funded: 'Grant funded',
  angel_funded: 'Angel funded',
  vc_funded: 'VC funded',
  other: 'Other',
})

const formatUsd = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided'
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not provided'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: numericValue >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: numericValue >= 1000000 ? 1 : 0,
  }).format(numericValue)
}

const formatReadinessScore = (value) => {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not analyzed yet'
  }

  return `${numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}/100`
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-2xl border border-white/[0.07]
        bg-white/[0.03] p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-violet-400/15
            bg-violet-400/[0.07]
          "
        >
          <Icon className="h-5 w-5 text-violet-200" />
        </div>

        <Sparkles className="h-4 w-4 text-slate-700" />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-[-0.035em] text-white">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {description}
        </p>
      )}
    </motion.article>
  )
}

function IntelligenceCard({
  icon: Icon,
  title,
  description,
  status,
  actionLabel,
  to,
  featured = false,
}) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`
        group flex h-full flex-col rounded-2xl
        border p-5 transition-colors
        ${
          featured
            ? `
              border-violet-400/20
              bg-gradient-to-br
              from-violet-500/[0.09]
              to-cyan-400/[0.04]
              hover:border-violet-400/30
            `
            : `
              border-white/[0.07]
              bg-white/[0.025]
              hover:border-white/[0.12]
              hover:bg-white/[0.04]
            `
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`
            flex h-11 w-11 items-center justify-center
            rounded-xl border
            ${
              featured
                ? `
                  border-violet-400/25
                  bg-violet-400/[0.12]
                `
                : `
                  border-cyan-400/15
                  bg-cyan-400/[0.06]
                `
            }
          `}
        >
          <Icon
            className={`
              h-5 w-5
              ${
                featured
                  ? 'text-violet-200'
                  : 'text-cyan-200'
              }
            `}
          />
        </div>

        <span
          className={`
            rounded-full border px-2.5 py-1
            text-xs font-medium
            ${
              featured
                ? `
                  border-violet-400/20
                  bg-violet-400/[0.08]
                  text-violet-200
                `
                : `
                  border-white/[0.07]
                  bg-white/[0.035]
                  text-slate-500
                `
            }
          `}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        to={to}
        className="
          mt-5 inline-flex items-center gap-2
          text-sm font-semibold text-violet-300
          transition-colors hover:text-violet-200
        "
      >
        {actionLabel}

        <ArrowRight
          className="
            h-4 w-4 transition-transform
            group-hover:translate-x-1
          "
        />
      </Link>
    </motion.article>
  )
}

function FounderDashboard() {
  const navigate = useNavigate()

  const {
    user,
    profile,
    signOut,
  } = useAuth()

  const [startup, setStartup] = useState(null)
  const [readinessAssessment, setReadinessAssessment] =
    useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      if (!user?.id) {
        return
      }

      try {
        const [
          startupData,
          latestReadinessAssessment,
        ] = await Promise.all([
          startupService.getMyStartup(user.id),
          readinessService.getLatestAssessment(),
        ])

        if (active) {
          setStartup(startupData)
          setReadinessAssessment(latestReadinessAssessment)
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your founder dashboard.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [user?.id])

  const handleSignOut = async () => {
    setSigningOut(true)

    try {
      await signOut()
      navigate(ROUTES.HOME, { replace: true })
    } catch (signOutError) {
      setError(
        signOutError?.message ||
          'We could not sign you out. Please try again.'
      )
      setSigningOut(false)
    }
  }

  const founderFirstName = useMemo(() => {
    const fullName = profile?.full_name?.trim()

    if (!fullName) {
      return 'Founder'
    }

    return fullName.split(/\s+/)[0]
  }, [profile?.full_name])

  if (loading) {
    return <PageLoader label="Loading your founder workspace" />
  }

  if (!startup) {
    return (
      <main
        className="
          relative flex min-h-screen items-center
          justify-center overflow-hidden bg-surface-950
          px-4 py-12
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute left-1/2 top-1/2
            h-[30rem] w-[30rem]
            -translate-x-1/2 -translate-y-1/2
            rounded-full bg-violet-500/[0.1]
            blur-[150px]
          "
        />

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            glass-panel relative w-full max-w-xl
            rounded-[2rem] p-7 text-center sm:p-10
          "
        >
          <div
            className="
              mx-auto flex h-16 w-16 items-center
              justify-center rounded-2xl
              border border-violet-400/20
              bg-violet-400/[0.08]
            "
          >
            <Rocket className="h-7 w-7 text-violet-200" />
          </div>

          <h1
            className="
              mt-6 text-3xl font-bold
              tracking-[-0.04em] text-white
            "
          >
            Build your startup profile first
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            Your dashboard needs genuine startup information before
            Fundora AI can provide readiness analysis, pitch
            intelligence, or investor matching.
          </p>

          {error && (
            <div
              className="
                mt-5 rounded-xl border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
              role="alert"
            >
              {error}
            </div>
          )}

          <Link
            to={ROUTES.FOUNDER.STARTUP_PROFILE}
            className="
              mt-7 inline-flex items-center justify-center
              gap-2 rounded-xl bg-gradient-to-r
              from-violet-600 to-cyan-500
              px-6 py-3 font-semibold text-white
              shadow-[0_12px_40px_rgba(124,58,237,0.22)]
              transition-opacity hover:opacity-95
            "
          >
            Create startup profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </main>
    )
  }

  const location = [
    startup.headquarters_city,
    startup.headquarters_country,
  ]
    .filter(Boolean)
    .join(', ')

  const startupStage =
    STAGE_LABELS[startup.stage] ?? startup.stage

  const revenueStatus =
    REVENUE_LABELS[startup.revenue_status] ??
    startup.revenue_status

  const fundingStatus =
    FUNDING_LABELS[startup.funding_status] ??
    startup.funding_status

  const readinessStatus = readinessAssessment
    ? formatReadinessScore(readinessAssessment.overall_score)
    : 'Not analyzed yet'

  const readinessActionLabel = readinessAssessment
    ? 'View readiness analysis'
    : 'Start assessment'

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-40 top-20
          h-[30rem] w-[30rem] rounded-full
          bg-violet-500/[0.07] blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 bottom-0
          h-[28rem] w-[28rem] rounded-full
          bg-cyan-400/[0.05] blur-[150px]
        "
      />

      <header
        className="
          relative z-20 border-b border-white/[0.06]
          bg-slate-950/70 backdrop-blur-xl
        "
      >
        <div
          className="
            section-container flex min-h-20
            items-center justify-between gap-4
          "
        >
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to={ROUTES.FOUNDER.DASHBOARD}
              className="
                rounded-lg bg-white/[0.06]
                px-3.5 py-2 text-sm font-medium text-white
              "
            >
              Dashboard
            </Link>

            <Link
              to={ROUTES.FOUNDER.STARTUP_PROFILE}
              className="
                rounded-lg px-3.5 py-2 text-sm
                font-medium text-slate-400
                transition-colors
                hover:bg-white/[0.04] hover:text-white
              "
            >
              Startup profile
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-200">
                {profile?.full_name || user?.email}
              </p>

              <p className="text-xs text-slate-600">
                Founder
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="
                focus-ring flex h-10 w-10 items-center
                justify-center rounded-xl border
                border-white/[0.08] bg-white/[0.035]
                text-slate-400 transition-colors
                hover:bg-white/[0.06] hover:text-white
                disabled:cursor-not-allowed disabled:opacity-50
              "
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            className="
              focus-ring flex h-10 w-10 items-center
              justify-center rounded-xl border
              border-white/[0.08] bg-white/[0.035]
              text-slate-300 md:hidden
            "
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="
              section-container border-t
              border-white/[0.06] py-4 md:hidden
            "
          >
            <nav className="space-y-1">
              <Link
                to={ROUTES.FOUNDER.DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  block rounded-lg bg-white/[0.06]
                  px-3 py-2.5 text-sm font-medium text-white
                "
              >
                Dashboard
              </Link>

              <Link
                to={ROUTES.FOUNDER.STARTUP_PROFILE}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  block rounded-lg px-3 py-2.5
                  text-sm font-medium text-slate-400
                  transition-colors hover:bg-white/[0.04]
                  hover:text-white
                "
              >
                Startup profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="
                  flex w-full items-center gap-2 rounded-lg
                  px-3 py-2.5 text-sm font-medium
                  text-slate-400 transition-colors
                  hover:bg-white/[0.04] hover:text-white
                "
              >
                <LogOut className="h-4 w-4" />
                {signingOut ? 'Signing out' : 'Sign out'}
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="section-container relative py-10 lg:py-14">
        {error && (
          <div
            className="
              mb-6 rounded-xl border border-rose-400/20
              bg-rose-400/[0.07] px-4 py-3
              text-sm text-rose-200
            "
            role="alert"
          >
            {error}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="
              flex flex-col gap-6 lg:flex-row
              lg:items-end lg:justify-between
            "
          >
            <div>
              <p className="text-sm font-semibold text-violet-300">
                Founder workspace
              </p>

              <h1
                className="
                  mt-2 text-4xl font-bold
                  tracking-[-0.05em] text-white sm:text-5xl
                "
              >
                Welcome back, {founderFirstName}.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Your workspace is connected to the real startup
                information stored for{' '}
                <span className="font-medium text-slate-200">
                  {startup.name}
                </span>
                .
              </p>
            </div>

            <Link
              to={ROUTES.FOUNDER.STARTUP_PROFILE}
              className="
                focus-ring inline-flex items-center
                justify-center gap-2 rounded-xl
                border border-white/[0.09]
                bg-white/[0.04] px-5 py-3
                text-sm font-semibold text-slate-200
                transition-colors hover:bg-white/[0.07]
                hover:text-white
              "
            >
              Manage startup profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            glass-panel mt-9 overflow-hidden
            rounded-[2rem] p-6 sm:p-8
          "
        >
          <div
            className="
              flex flex-col gap-6 lg:flex-row
              lg:items-start lg:justify-between
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex h-14 w-14 shrink-0 items-center
                  justify-center rounded-2xl border
                  border-violet-400/20
                  bg-violet-400/[0.08]
                "
              >
                <Building2 className="h-6 w-6 text-violet-200" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className="
                      text-2xl font-bold
                      tracking-[-0.035em] text-white
                    "
                  >
                    {startup.name}
                  </h2>

                  {startup.onboarding_completed && (
                    <span
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full border
                        border-emerald-400/20
                        bg-emerald-400/[0.07]
                        px-2.5 py-1 text-xs
                        font-medium text-emerald-300
                      "
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Profile complete
                    </span>
                  )}
                </div>

                {startup.tagline && (
                  <p className="mt-2 text-sm text-slate-400">
                    {startup.tagline}
                  </p>
                )}

                <div
                  className="
                    mt-4 flex flex-wrap items-center
                    gap-x-5 gap-y-2 text-sm text-slate-500
                  "
                >
                  <span className="inline-flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    {startupStage}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {startup.industry}
                  </span>

                  {location && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              className="
                rounded-xl border border-white/[0.07]
                bg-white/[0.025] px-4 py-3
              "
            >
              <p className="text-xs font-medium text-slate-600">
                Funding status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-200">
                {fundingStatus}
              </p>
            </div>
          </div>
        </motion.section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={UsersRound}
            label="Team size"
            value={startup.team_size}
            description={`${startup.full_time_founders} full-time ${
              startup.full_time_founders === 1
                ? 'founder'
                : 'founders'
            }`}
          />

          <MetricCard
            icon={TrendingUp}
            label="Revenue status"
            value={revenueStatus}
            description={
              startup.revenue_status === 'revenue_generating'
                ? `${formatUsd(startup.annual_revenue_usd)} annual revenue`
                : 'No annual revenue reported yet'
            }
          />

          <MetricCard
            icon={WalletCards}
            label="Funding raised"
            value={formatUsd(startup.total_funding_raised_usd)}
            description={`Current status: ${fundingStatus}`}
          />

          <MetricCard
            icon={Target}
            label="Target raise"
            value={formatUsd(startup.target_raise_usd)}
            description={
              startup.minimum_investment_usd
                ? `Minimum investment: ${formatUsd(
                    startup.minimum_investment_usd
                  )}`
                : 'No minimum investment specified'
            }
          />
        </section>

        <section className="mt-10">
          <div
            className="
              flex flex-col gap-3 sm:flex-row
              sm:items-end sm:justify-between
            "
          >
            <div>
              <p className="text-sm font-semibold text-violet-300">
                Funding intelligence
              </p>

              <h2
                className="
                  mt-2 text-2xl font-bold
                  tracking-[-0.035em] text-white
                "
              >
                Your analysis workspace
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Each module displays results only after genuine
                analysis has been performed.
              </p>
            </div>
          </div>

          <div
            className="
              mt-6 grid gap-4
              sm:grid-cols-2 xl:grid-cols-4
            "
          >
            <IntelligenceCard
              icon={BarChart3}
              title="Funding readiness"
              description="
                Evaluate your startup across measurable
                funding-readiness dimensions.
              "
              status={readinessStatus}
              actionLabel={readinessActionLabel}
              to={ROUTES.FOUNDER.READINESS}
            />

            <IntelligenceCard
              icon={FileSearch}
              title="Pitch intelligence"
              description="
                Analyze a genuine pitch deck for clarity,
                completeness, and investor relevance.
              "
              status="No analysis yet"
              actionLabel="Analyze pitch"
              to={ROUTES.FOUNDER.PITCH_ANALYSIS}
            />

            <IntelligenceCard
              icon={UsersRound}
              title="Investor matches"
              description="
                Discover investors based on real startup and
                investor preference compatibility.
              "
              status="No matches yet"
              actionLabel="Find investors"
              to={ROUTES.FOUNDER.INVESTOR_MATCHES}
            />

            <IntelligenceCard
              icon={Route}
              title="Improvement roadmap"
              description="
                Receive prioritized improvements based on
                genuine analysis results.
              "
              status="Not generated yet"
              actionLabel="View roadmap"
              to={ROUTES.FOUNDER.ROADMAP}
            />

            <IntelligenceCard
              icon={BrainCircuit}
              title="AI Funding Advisor"
              description="
                Get personalized funding guidance powered by
                IBM watsonx.ai using your real startup
                intelligence.
              "
              status="AI powered"
              actionLabel="Get AI advice"
              to={ROUTES.FOUNDER.AI_ADVISOR}
              featured
            />
          </div>
        </section>

        <section
          className="
            mt-10 grid gap-6
            lg:grid-cols-[1.3fr_0.7fr]
          "
        >
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-violet-400/15
                  bg-violet-400/[0.07]
                "
              >
                <Target className="h-5 w-5 text-violet-200" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Current startup foundation
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Loaded directly from your startup profile
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div
                className="
                  rounded-xl border border-white/[0.07]
                  bg-white/[0.025] p-4
                "
              >
                <p className="text-xs font-medium text-slate-600">
                  Target market
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {startup.target_market}
                </p>
              </div>

              <div
                className="
                  rounded-xl border border-white/[0.07]
                  bg-white/[0.025] p-4
                "
              >
                <p className="text-xs font-medium text-slate-600">
                  Business model
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {startup.business_model}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-cyan-400/15
                  bg-cyan-400/[0.06]
                "
              >
                <CircleDollarSign className="h-5 w-5 text-cyan-200" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Funding snapshot
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Real reported values
                </p>
              </div>
            </div>

            <dl className="mt-6 space-y-4">
              <div
                className="
                  flex items-center justify-between gap-4
                  border-b border-white/[0.06] pb-4
                "
              >
                <dt className="text-sm text-slate-500">
                  Status
                </dt>

                <dd className="text-sm font-medium text-slate-200">
                  {fundingStatus}
                </dd>
              </div>

              <div
                className="
                  flex items-center justify-between gap-4
                  border-b border-white/[0.06] pb-4
                "
              >
                <dt className="text-sm text-slate-500">
                  Raised
                </dt>

                <dd className="text-sm font-medium text-slate-200">
                  {formatUsd(startup.total_funding_raised_usd)}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-slate-500">
                  Target
                </dt>

                <dd className="text-sm font-medium text-slate-200">
                  {formatUsd(startup.target_raise_usd)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  )
}

export default FounderDashboard