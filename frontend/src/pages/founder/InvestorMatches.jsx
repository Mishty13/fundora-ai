import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import { matchingService } from '../../services/matchingService'

const DIMENSION_LABELS = {
  sector: 'Sector',
  stage: 'Stage',
  geography: 'Geography',
  cheque: 'Cheque fit',
  readiness: 'Readiness',
  revenue: 'Revenue',
  traction: 'Traction',
}

const STATUS_LABELS = {
  eligible: 'Strong fit',
  partial_fit: 'Partial fit',
  ineligible: 'Low fit',
}

const INVESTOR_TYPE_LABELS = {
  angel: 'Angel Investor',
  venture_capital: 'Venture Capital',
  corporate_vc: 'Corporate VC',
  accelerator: 'Accelerator',
  family_office: 'Family Office',
  other: 'Other',
}

function formatCurrency(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not provided'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

function ScoreRing({ score }) {
  const normalizedScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  )

  return (
    <div
      className="
        flex h-20 w-20 shrink-0 items-center
        justify-center rounded-full border-4
        border-violet-400/30 bg-violet-400/[0.07]
      "
    >
      <div className="text-center">
        <p className="text-xl font-bold text-white">
          {Math.round(normalizedScore)}
        </p>

        <p className="text-[10px] font-medium text-slate-500">
          MATCH
        </p>
      </div>
    </div>
  )
}

function DimensionScore({ dimension, score }) {
  const numericScore = Math.max(
    0,
    Math.min(100, Number(score) || 0)
  )

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">
          {DIMENSION_LABELS[dimension] || dimension}
        </p>

        <p className="text-xs font-semibold text-slate-300">
          {Math.round(numericScore)}
        </p>
      </div>

      <div
        className="
          mt-2 h-1.5 overflow-hidden rounded-full
          bg-white/[0.05]
        "
      >
        <div
          className="
            h-full rounded-full
            bg-gradient-to-r from-violet-500 to-cyan-400
          "
          style={{
            width: `${numericScore}%`,
          }}
        />
      </div>
    </div>
  )
}

function InvestorMatchCard({ match, rank }) {
  const [expanded, setExpanded] = useState(false)

  const dimensions = Object.entries(
    match.dimension_scores || {}
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(rank * 0.05, 0.3),
      }}
      className="glass-panel rounded-[2rem] p-6 sm:p-7"
    >
      <div
        className="
          flex flex-col gap-5 sm:flex-row
          sm:items-start sm:justify-between
        "
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="
                rounded-full border border-white/[0.07]
                bg-white/[0.03] px-2.5 py-1
                text-xs font-semibold text-slate-500
              "
            >
              #{rank}
            </span>

            <span
              className="
                rounded-full border border-violet-400/15
                bg-violet-400/[0.07] px-2.5 py-1
                text-xs font-semibold text-violet-200
              "
            >
              {STATUS_LABELS[match.eligibility_status] ||
                match.eligibility_status}
            </span>
          </div>

          <h2
            className="
              mt-4 text-2xl font-bold tracking-[-0.035em]
              text-white
            "
          >
            {match.investor_name}
          </h2>

          {match.organization_name && (
            <div className="mt-2 flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-slate-600" />

              <p className="text-sm text-slate-400">
                {match.organization_name}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/[0.07]
                bg-white/[0.025] px-3 py-1.5
                text-xs font-medium text-slate-400
              "
            >
              <UserRound className="h-3.5 w-3.5" />

              {INVESTOR_TYPE_LABELS[match.investor_type] ||
                match.investor_type}
            </span>

            <span
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/[0.07]
                bg-white/[0.025] px-3 py-1.5
                text-xs font-medium text-slate-400
              "
            >
              <Target className="h-3.5 w-3.5" />

              {match.preferred_sectors?.length || 0} sectors
            </span>

            <span
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/[0.07]
                bg-white/[0.025] px-3 py-1.5
                text-xs font-medium text-slate-400
              "
            >
              <Globe2 className="h-3.5 w-3.5" />

              {match.preferred_geographies?.length || 0} geographies
            </span>
          </div>
        </div>

        <ScoreRing score={match.overall_score} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div
          className="
            rounded-xl border border-white/[0.07]
            bg-white/[0.025] p-4
          "
        >
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-emerald-300" />

            <p className="text-xs font-medium text-slate-600">
              Minimum cheque
            </p>
          </div>

          <p className="mt-2 font-semibold text-slate-300">
            {formatCurrency(match.minimum_cheque_size)}
          </p>
        </div>

        <div
          className="
            rounded-xl border border-white/[0.07]
            bg-white/[0.025] p-4
          "
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-300" />

            <p className="text-xs font-medium text-slate-600">
              Maximum cheque
            </p>
          </div>

          <p className="mt-2 font-semibold text-slate-300">
            {formatCurrency(match.maximum_cheque_size)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {dimensions.map(([dimension, score]) => (
          <DimensionScore
            key={dimension}
            dimension={dimension}
            score={score}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="
          focus-ring mt-6 inline-flex items-center gap-2
          text-sm font-semibold text-violet-300
          transition-colors hover:text-violet-200
        "
      >
        <Sparkles className="h-4 w-4" />

        {expanded
          ? 'Hide match explanation'
          : 'Why this match?'}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="
            mt-5 space-y-3 border-t
            border-white/[0.06] pt-5
          "
        >
          {(match.match_reasons || []).map(
            (reason, index) => (
              <div
                key={`${reason.dimension}-${index}`}
                className="
                  flex items-start gap-3 rounded-xl
                  border border-white/[0.06]
                  bg-white/[0.02] p-4
                "
              >
                <CheckCircle2
                  className="
                    mt-0.5 h-4 w-4 shrink-0
                    text-violet-300
                  "
                />

                <div>
                  <p
                    className="
                      text-xs font-semibold uppercase
                      tracking-[0.12em] text-slate-600
                    "
                  >
                    {DIMENSION_LABELS[reason.dimension] ||
                      reason.dimension}
                  </p>

                  <p
                    className="
                      mt-1 text-sm leading-6
                      text-slate-400
                    "
                  >
                    {reason.message}
                  </p>
                </div>
              </div>
            )
          )}
        </motion.div>
      )}
    </motion.article>
  )
}

function InvestorMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadMatches = async () => {
      try {
        const data =
          await matchingService.getInvestorMatches()

        if (active) {
          setMatches(data || [])
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your investor matches.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadMatches()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <PageLoader label="Loading investor matches" />
  }

  return (
    <main
      className="
        relative min-h-screen overflow-hidden bg-surface-950
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-40 top-20
          h-[30rem] w-[30rem] rounded-full
          bg-violet-500/[0.07] blur-[150px]
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
          <Link
            to={ROUTES.FOUNDER.DASHBOARD}
            className="
              focus-ring inline-flex items-center gap-2
              text-sm font-medium text-slate-400
              transition-colors hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Founder dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" />

            <span className="text-sm font-semibold text-slate-300">
              Fundora Intelligence
            </span>
          </div>
        </div>
      </header>

      <div className="section-container relative py-10 lg:py-14">
        <section className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-semibold text-violet-300">
              Explainable investor discovery
            </p>

            <h1
              className="
                mt-2 text-4xl font-bold tracking-[-0.05em]
                text-white sm:text-5xl
              "
            >
              Your investor matches.
            </h1>

            <p
              className="
                mt-4 max-w-2xl text-base
                leading-7 text-slate-400
              "
            >
              Discover investors whose investment preferences
              align with your startup&apos;s real profile,
              funding requirements and readiness.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="
                mt-7 flex items-start gap-3 rounded-xl
                border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!matches.length && !error ? (
            <div
              className="
                glass-panel mt-9 rounded-[2rem]
                px-6 py-16 text-center
              "
            >
              <div
                className="
                  mx-auto flex h-16 w-16 items-center
                  justify-center rounded-2xl
                  border border-violet-400/15
                  bg-violet-400/[0.07]
                "
              >
                <BriefcaseBusiness className="h-7 w-7 text-violet-300" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                No investor matches yet.
              </h2>

              <p
                className="
                  mx-auto mt-3 max-w-lg text-sm
                  leading-6 text-slate-500
                "
              >
                Investor matches become available when an
                investor generates startup matches that include
                your startup.
              </p>
            </div>
          ) : (
            <div className="mt-9 space-y-5">
              {matches.map((match, index) => (
                <InvestorMatchCard
                  key={match.id}
                  match={match}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default InvestorMatches