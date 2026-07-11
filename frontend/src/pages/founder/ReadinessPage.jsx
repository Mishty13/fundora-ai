import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import { readinessService } from '../../services/readinessService'

const DIMENSIONS = Object.freeze([
  {
    key: 'business_clarity',
    scoreKey: 'business_clarity_score',
    title: 'Business clarity',
    description:
      'Problem definition, solution clarity, business model, and competitive advantage.',
    icon: BriefcaseBusiness,
    weight: '20%',
  },
  {
    key: 'market_readiness',
    scoreKey: 'market_readiness_score',
    title: 'Market readiness',
    description:
      'Target market definition, positioning context, and genuine customer evidence.',
    icon: Target,
    weight: '20%',
  },
  {
    key: 'traction',
    scoreKey: 'traction_score',
    title: 'Traction',
    description:
      'Revenue, customer adoption, and measurable evidence of market progress.',
    icon: TrendingUp,
    weight: '25%',
  },
  {
    key: 'team_strength',
    scoreKey: 'team_strength_score',
    title: 'Team strength',
    description:
      'Full-time founder commitment and current execution capacity.',
    icon: UsersRound,
    weight: '15%',
  },
  {
    key: 'funding_preparedness',
    scoreKey: 'funding_preparedness_score',
    title: 'Funding preparedness',
    description:
      'Target raise, investment expectations, funding history, and current funding position.',
    icon: CircleDollarSign,
    weight: '20%',
  },
])

const PRIORITY_STYLES = Object.freeze({
  high: {
    label: 'High priority',
    classes:
      'border-rose-400/20 bg-rose-400/[0.07] text-rose-300',
  },
  medium: {
    label: 'Medium priority',
    classes:
      'border-amber-400/20 bg-amber-400/[0.07] text-amber-300',
  },
  low: {
    label: 'Low priority',
    classes:
      'border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300',
  },
})

function formatScore(value) {
  const score = Number(value)

  if (!Number.isFinite(score)) {
    return '0'
  }

  return Number.isInteger(score)
    ? String(score)
    : score.toFixed(1)
}

function formatCriterionName(value) {
  return value
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

function formatAssessmentDate(value) {
  if (!value) {
    return 'Date unavailable'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getReadinessLevel(score) {
  if (score >= 80) {
    return {
      label: 'Strong readiness',
      description:
        'Your startup demonstrates a strong structured foundation across the assessed dimensions.',
    }
  }

  if (score >= 65) {
    return {
      label: 'Advancing readiness',
      description:
        'Your startup has a meaningful foundation with specific opportunities for improvement.',
    }
  }

  if (score >= 45) {
    return {
      label: 'Developing readiness',
      description:
        'Several important foundations are present, while key gaps should be addressed before fundraising.',
    }
  }

  return {
    label: 'Early readiness',
    description:
      'Your startup has significant opportunities to strengthen its funding preparation.',
  }
}

function ScoreRing({ score }) {
  const normalizedScore = Math.min(
    100,
    Math.max(0, Number(score) || 0)
  )

  const radius = 74
  const circumference = 2 * Math.PI * radius
  const offset =
    circumference - (normalizedScore / 100) * circumference

  return (
    <div className="relative h-48 w-48">
      <svg
        viewBox="0 0 176 176"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-white/[0.06]"
        />

        <motion.circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke="url(#readiness-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <defs>
          <linearGradient
            id="readiness-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tracking-[-0.06em] text-white">
          {formatScore(score)}
        </span>

        <span className="mt-1 text-sm font-medium text-slate-500">
          out of 100
        </span>
      </div>
    </div>
  )
}

function DimensionCard({ dimension, assessment }) {
  const Icon = dimension.icon
  const score = Number(assessment[dimension.scoreKey]) || 0
  const criteria =
    assessment.score_breakdown?.[dimension.key] ?? []

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="
        rounded-2xl border border-white/[0.07]
        bg-white/[0.025] p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-violet-400/15
            bg-violet-400/[0.07]
          "
        >
          <Icon className="h-5 w-5 text-violet-200" />
        </div>

        <span
          className="
            rounded-full border border-white/[0.07]
            bg-white/[0.035] px-2.5 py-1
            text-xs font-medium text-slate-500
          "
        >
          Weight {dimension.weight}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">
            {dimension.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {dimension.description}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-3xl font-bold tracking-[-0.04em] text-white">
            {formatScore(score)}
          </span>

          <span className="text-sm text-slate-600">
            /100
          </span>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(100, Math.max(0, score))}%`,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            h-full rounded-full bg-gradient-to-r
            from-violet-500 to-cyan-400
          "
        />
      </div>

      {criteria.length > 0 && (
        <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
          {criteria.map((criterion) => (
            <div
              key={criterion.criterion}
              className="
                rounded-xl border border-white/[0.06]
                bg-white/[0.02] p-3.5
              "
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-300">
                  {formatCriterionName(criterion.criterion)}
                </p>

                <span className="shrink-0 text-xs font-semibold text-slate-400">
                  {formatScore(criterion.score)} /{' '}
                  {formatScore(criterion.maximum_score)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {criterion.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  )
}

function EmptyReadinessState({
  onRunAssessment,
  assessing,
  error,
}) {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          glass-panel overflow-hidden
          rounded-[2rem] p-7 sm:p-10
        "
      >
        <div
          className="
            flex flex-col gap-8
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div className="max-w-2xl">
            <div
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl border border-violet-400/20
                bg-violet-400/[0.08]
              "
            >
              <BarChart3 className="h-6 w-6 text-violet-200" />
            </div>

            <h1
              className="
                mt-6 text-4xl font-bold
                tracking-[-0.05em] text-white sm:text-5xl
              "
            >
              Understand your funding readiness.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Fundora AI evaluates your genuine startup profile
              across five measurable dimensions using a transparent,
              versioned methodology.
            </p>

            {error && (
              <div
                className="
                  mt-5 flex items-start gap-3 rounded-xl
                  border border-rose-400/20
                  bg-rose-400/[0.07] px-4 py-3
                  text-sm text-rose-200
                "
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onRunAssessment}
              disabled={assessing}
              className="
                focus-ring mt-7 inline-flex items-center
                justify-center gap-2 rounded-xl
                bg-gradient-to-r from-violet-600 to-cyan-500
                px-6 py-3 font-semibold text-white
                shadow-[0_12px_40px_rgba(124,58,237,0.22)]
                transition-opacity hover:opacity-95
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {assessing ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Assessing startup
                </>
              ) : (
                <>
                  Run readiness assessment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div
            className="
              rounded-2xl border border-white/[0.07]
              bg-white/[0.025] p-5 lg:w-[22rem]
            "
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />

              <p className="text-sm font-semibold text-slate-200">
                Transparent methodology
              </p>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              The score is calculated from your real startup data.
              The current methodology is deterministic, explainable,
              and stored with every assessment for auditability.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="mt-8">
        <div>
          <p className="text-sm font-semibold text-violet-300">
            Assessment framework
          </p>

          <h2
            className="
              mt-2 text-2xl font-bold
              tracking-[-0.035em] text-white
            "
          >
            Five dimensions of funding readiness
          </h2>
        </div>

        <div
          className="
            mt-6 grid gap-4
            sm:grid-cols-2 xl:grid-cols-5
          "
        >
          {DIMENSIONS.map((dimension) => {
            const Icon = dimension.icon

            return (
              <motion.article
                key={dimension.key}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="
                  rounded-2xl border border-white/[0.07]
                  bg-white/[0.025] p-5
                "
              >
                <div
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    border border-violet-400/15
                    bg-violet-400/[0.07]
                  "
                >
                  <Icon className="h-5 w-5 text-violet-200" />
                </div>

                <h3 className="mt-5 font-semibold text-white">
                  {dimension.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {dimension.description}
                </p>

                <p className="mt-4 text-xs font-semibold text-cyan-300">
                  {dimension.weight} of overall score
                </p>
              </motion.article>
            )
          })}
        </div>
      </section>
    </>
  )
}

function ReadinessResults({
  assessment,
  onRunAssessment,
  assessing,
  error,
}) {
  const readinessLevel = useMemo(
    () => getReadinessLevel(Number(assessment.overall_score)),
    [assessment.overall_score]
  )

  return (
    <>
      {error && (
        <div
          className="
            mb-6 flex items-start gap-3 rounded-xl
            border border-rose-400/20
            bg-rose-400/[0.07] px-4 py-3
            text-sm text-rose-200
          "
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          glass-panel overflow-hidden
          rounded-[2rem] p-6 sm:p-8
        "
      >
        <div
          className="
            grid gap-8
            lg:grid-cols-[auto_1fr_auto]
            lg:items-center
          "
        >
          <ScoreRing score={assessment.overall_score} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-emerald-400/20
                  bg-emerald-400/[0.07]
                  px-2.5 py-1 text-xs
                  font-medium text-emerald-300
                "
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Assessment complete
              </span>

              <span
                className="
                  rounded-full border border-white/[0.07]
                  bg-white/[0.035] px-2.5 py-1
                  text-xs font-medium text-slate-500
                "
              >
                Methodology v{assessment.methodology_version}
              </span>
            </div>

            <h1
              className="
                mt-5 text-4xl font-bold
                tracking-[-0.05em] text-white
              "
            >
              {readinessLevel.label}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
              {readinessLevel.description}
            </p>

            <div
              className="
                mt-5 inline-flex items-center gap-2
                text-sm text-slate-600
              "
            >
              <CalendarDays className="h-4 w-4" />
              Assessed {formatAssessmentDate(assessment.created_at)}
            </div>
          </div>

          <button
            type="button"
            onClick={onRunAssessment}
            disabled={assessing}
            className="
              focus-ring inline-flex items-center
              justify-center gap-2 rounded-xl
              border border-white/[0.09]
              bg-white/[0.04] px-5 py-3
              text-sm font-semibold text-slate-200
              transition-colors hover:bg-white/[0.07]
              hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {assessing ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Reassessing
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Run new assessment
              </>
            )}
          </button>
        </div>
      </motion.section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold text-violet-300">
            Dimension analysis
          </p>

          <h2
            className="
              mt-2 text-2xl font-bold
              tracking-[-0.035em] text-white
            "
          >
            Understand every part of your score
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Each result below is calculated from the startup data
            captured when this assessment was performed.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {DIMENSIONS.map((dimension) => (
            <DimensionCard
              key={dimension.key}
              dimension={dimension}
              assessment={assessment}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div>
          <p className="text-sm font-semibold text-violet-300">
            Priority actions
          </p>

          <h2
            className="
              mt-2 text-2xl font-bold
              tracking-[-0.035em] text-white
            "
          >
            Where to focus next
          </h2>
        </div>

        {assessment.recommendations?.length > 0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {assessment.recommendations.map(
              (recommendation, index) => {
                const priority =
                  PRIORITY_STYLES[recommendation.priority] ??
                  PRIORITY_STYLES.low

                return (
                  <motion.article
                    key={`${recommendation.dimension}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                    className="
                      rounded-2xl border border-white/[0.07]
                      bg-white/[0.025] p-5
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="
                          flex h-10 w-10 items-center
                          justify-center rounded-xl
                          border border-amber-400/15
                          bg-amber-400/[0.06]
                        "
                      >
                        <Lightbulb className="h-5 w-5 text-amber-200" />
                      </div>

                      <span
                        className={`
                          rounded-full border px-2.5 py-1
                          text-xs font-medium
                          ${priority.classes}
                        `}
                      >
                        {priority.label}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {recommendation.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {recommendation.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-600">
                        Current dimension score
                      </span>

                      <span className="text-sm font-semibold text-slate-300">
                        {formatScore(recommendation.score)}/100
                      </span>
                    </div>
                  </motion.article>
                )
              }
            )}
          </div>
        ) : (
          <div
            className="
              mt-6 rounded-2xl border border-emerald-400/15
              bg-emerald-400/[0.05] p-6
            "
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

              <div>
                <h3 className="font-semibold text-white">
                  No priority recommendations generated
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Every assessed dimension currently meets the
                  methodology threshold for which no additional
                  recommendation is generated.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        className="
          mt-10 rounded-2xl border border-white/[0.07]
          bg-white/[0.025] p-6
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl
              border border-cyan-400/15
              bg-cyan-400/[0.06]
            "
          >
            <ShieldCheck className="h-5 w-5 text-cyan-200" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              About this assessment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This result uses Fundora AI readiness methodology
              version {assessment.methodology_version}. It is based
              on the startup information captured at assessment time
              and is intended as structured funding-preparation
              guidance rather than a guarantee of investment.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function ReadinessPage() {
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assessing, setAssessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
  
    async function loadLatestAssessment() {
      setLoading(true)
      setError('')
  
      try {
        const latestAssessment =
          await readinessService.getLatestAssessment()
  
        if (active) {
          setAssessment(latestAssessment)
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your readiness assessment.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }
  
    loadLatestAssessment()
  
    return () => {
      active = false
    }
  }, [])

  const handleRunAssessment = async () => {
    setAssessing(true)
    setError('')

    try {
      const newAssessment =
        await readinessService.createAssessment()

      setAssessment(newAssessment)
    } catch (assessmentError) {
      setError(
        assessmentError?.message ||
          'We could not complete your readiness assessment.'
      )
    } finally {
      setAssessing(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading funding readiness" />
  }

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        bg-surface-950
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
        {assessment ? (
          <ReadinessResults
            assessment={assessment}
            onRunAssessment={handleRunAssessment}
            assessing={assessing}
            error={error}
          />
        ) : (
          <EmptyReadinessState
            onRunAssessment={handleRunAssessment}
            assessing={assessing}
            error={error}
          />
        )}
      </div>
    </main>
  )
}

export default ReadinessPage