import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileSearch,
  LoaderCircle,
  RefreshCw,
  Route,
  Sparkles,
  Target,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import { roadmapService } from '../../services/roadmapService'

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
}

const PRIORITY_STYLES = {
  high:
    'border-rose-400/20 bg-rose-400/[0.07] text-rose-300',
  medium:
    'border-amber-400/20 bg-amber-400/[0.07] text-amber-300',
  low:
    'border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300',
}

const SOURCE_LABELS = {
  readiness: 'Funding readiness',
  pitch: 'Pitch intelligence',
}

function formatScore(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not available'
  }

  return `${numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}/100`
}

function ActionCard({ item, number }) {
  const priority = item.priority || 'medium'

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(number * 0.05, 0.4),
      }}
      className="
        rounded-2xl border border-white/[0.07]
        bg-white/[0.025] p-5 sm:p-6
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl border
            border-violet-400/15 bg-violet-400/[0.07]
            text-sm font-bold text-violet-200
          "
        >
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                rounded-full border px-2.5 py-1
                text-xs font-semibold capitalize
                ${PRIORITY_STYLES[priority]}
              `}
            >
              {priority} priority
            </span>

            <span
              className="
                rounded-full border border-white/[0.07]
                bg-white/[0.035] px-2.5 py-1
                text-xs font-medium text-slate-500
              "
            >
              {SOURCE_LABELS[item.source] || item.source}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            {item.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {item.description}
          </p>
        </div>
      </div>

      <div
        className="
          mt-5 rounded-xl border border-cyan-400/10
          bg-cyan-400/[0.035] p-4
        "
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="
              mt-0.5 h-4 w-4 shrink-0 text-cyan-300
            "
          />

          <div>
            <p className="text-xs font-semibold text-cyan-300">
              Recommended action
            </p>

            <p className="mt-1.5 text-sm leading-6 text-slate-400">
              {item.action}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadRoadmap = async () => {
      try {
        const latestRoadmap =
          await roadmapService.getLatestRoadmap()

        if (active) {
          setRoadmap(latestRoadmap)
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your improvement roadmap.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRoadmap()

    return () => {
      active = false
    }
  }, [])

  const sortedActions = useMemo(() => {
    const actions = roadmap?.actions || []

    return [...actions].sort(
      (first, second) =>
        (PRIORITY_ORDER[first.priority] ?? 1) -
        (PRIORITY_ORDER[second.priority] ?? 1)
    )
  }, [roadmap?.actions])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')

    try {
      const generatedRoadmap =
        await roadmapService.generateRoadmap()

      setRoadmap(generatedRoadmap)
    } catch (generateError) {
      setError(
        generateError?.message ||
          'We could not generate your improvement roadmap.'
      )
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading your improvement roadmap" />
  }

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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-5xl"
        >
          <div className="text-center">
            <div
              className="
                mx-auto flex h-16 w-16 items-center
                justify-center rounded-2xl border
                border-violet-400/20
                bg-violet-400/[0.08]
              "
            >
              <Route className="h-7 w-7 text-violet-200" />
            </div>

            <p className="mt-6 text-sm font-semibold text-violet-300">
              Improvement Roadmap
            </p>

            <h1
              className="
                mt-2 text-4xl font-bold tracking-[-0.05em]
                text-white sm:text-5xl
              "
            >
              Turn intelligence into action.
            </h1>

            <p
              className="
                mx-auto mt-5 max-w-2xl text-base
                leading-7 text-slate-400
              "
            >
              Fundora converts your genuine analysis results into
              prioritized actions, helping you focus first on the
              improvements that matter most for fundraising.
            </p>
          </div>

          {error && (
            <div
              className="
                mx-auto mt-7 flex max-w-3xl items-start gap-3
                rounded-xl border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!roadmap ? (
            <section
              className="
                glass-panel mx-auto mt-9 max-w-3xl
                rounded-[2rem] p-7 text-center sm:p-10
              "
            >
              <div
                className="
                  mx-auto flex h-14 w-14 items-center
                  justify-center rounded-2xl border
                  border-cyan-400/15 bg-cyan-400/[0.06]
                "
              >
                <Target className="h-6 w-6 text-cyan-200" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Generate your first improvement roadmap
              </h2>

              <p
                className="
                  mx-auto mt-3 max-w-xl text-sm
                  leading-6 text-slate-500
                "
              >
                Your current roadmap will use genuine Funding
                Readiness results. Once Pitch Intelligence is
                completed through Granite, future roadmaps can
                combine both sources automatically.
              </p>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="
                  focus-ring mt-7 inline-flex items-center
                  justify-center gap-2 rounded-xl
                  bg-gradient-to-r from-violet-600
                  to-cyan-500 px-6 py-3
                  text-sm font-semibold text-white
                  transition-opacity hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {generating ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Generating roadmap
                  </>
                ) : (
                  <>
                    Generate roadmap
                    <Route className="h-4 w-4" />
                  </>
                )}
              </button>
            </section>
          ) : (
            <>
              <section
                className="
                  glass-panel mt-9 rounded-[2rem] p-7 sm:p-9
                "
              >
                <div
                  className="
                    flex flex-col gap-6 lg:flex-row
                    lg:items-start lg:justify-between
                  "
                >
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="
                          rounded-full border
                          border-violet-400/20
                          bg-violet-400/[0.07]
                          px-3 py-1 text-xs font-semibold
                          capitalize text-violet-300
                        "
                      >
                        {roadmap.status} roadmap
                      </span>

                      <span
                        className="
                          rounded-full border border-white/[0.07]
                          bg-white/[0.035] px-3 py-1
                          text-xs font-medium text-slate-500
                        "
                      >
                        {sortedActions.length}{' '}
                        {sortedActions.length === 1
                          ? 'action'
                          : 'actions'}
                      </span>
                    </div>

                    <h2
                      className="
                        mt-4 text-2xl font-bold
                        tracking-[-0.035em] text-white
                      "
                    >
                      Your prioritized improvement plan
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {roadmap.overall_summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={generating}
                    className="
                      focus-ring inline-flex items-center
                      justify-center gap-2 rounded-xl
                      border border-white/[0.09]
                      bg-white/[0.04] px-4 py-2.5
                      text-sm font-semibold text-slate-300
                      transition-colors hover:bg-white/[0.07]
                      hover:text-white disabled:opacity-60
                    "
                  >
                    {generating ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}

                    Regenerate
                  </button>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div
                    className="
                      rounded-xl border border-white/[0.07]
                      bg-white/[0.025] p-5
                    "
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-violet-300" />

                      <p className="text-sm font-semibold text-slate-300">
                        Funding readiness
                      </p>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                      {formatScore(
                        roadmap.source_snapshot
                          ?.readiness_overall_score
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl border border-white/[0.07]
                      bg-white/[0.025] p-5
                    "
                  >
                    <div className="flex items-center gap-2">
                      <FileSearch className="h-4 w-4 text-cyan-300" />

                      <p className="text-sm font-semibold text-slate-300">
                        Pitch intelligence
                      </p>
                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                      {formatScore(
                        roadmap.source_snapshot?.pitch_overall_score
                      )}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <p className="text-sm font-semibold text-violet-300">
                  Priority queue
                </p>

                <h2
                  className="
                    mt-2 text-2xl font-bold
                    tracking-[-0.035em] text-white
                  "
                >
                  What to improve next
                </h2>

                {sortedActions.length ? (
                  <div className="mt-6 space-y-4">
                    {sortedActions.map((item, index) => (
                      <ActionCard
                        key={`${item.source}-${item.dimension}-${index}`}
                        item={item}
                        number={index + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="
                      mt-6 rounded-2xl border
                      border-emerald-400/15
                      bg-emerald-400/[0.05] p-6
                    "
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="
                          mt-0.5 h-5 w-5 shrink-0
                          text-emerald-300
                        "
                      />

                      <div>
                        <h3 className="font-semibold text-white">
                          No priority actions identified
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Your available analysis results did not
                          produce any dimensions below the current
                          roadmap threshold.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </motion.section>
      </div>
    </main>
  )
}

export default RoadmapPage