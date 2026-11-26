import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import Logo from '../../components/common/Logo'
import PageLoader from '../../components/common/PageLoader'
import { matchingService } from '../../services/matchingService'
import {
  generateInvestmentBrief,
} from '../../services/investmentBriefApi'
import { ROUTES } from '../../config/app'
const formatScore = (value) => {
  if (value == null || value === '') return '—'
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return '—'
  }
  return numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
}
const formatUsd = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Not provided'
  }
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return 'Not provided'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation:
      numericValue >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits:
      numericValue >= 1000000 ? 1 : 0,
  }).format(numericValue)
}
function DimensionScore({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl border border-white/[0.07]
        bg-white/[0.025] p-3
      "
    >
      <p className="text-xs text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-200">
        {formatScore(value)}/100
      </p>
    </div>
  )
}
function BriefInsightCard({
  icon: Icon,
  title,
  explanation,
  type,
}) {
  const isStrength = type === 'strength'
  return (
    <article
      className="
        rounded-xl border border-white/[0.07]
        bg-white/[0.025] p-4
      "
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center
            justify-center rounded-lg border
            ${
              isStrength
                ? `
                  border-emerald-400/20
                  bg-emerald-400/[0.08]
                `
                : `
                  border-amber-400/20
                  bg-amber-400/[0.08]
                `
            }
          `}
        >
          <Icon
            className={`
              h-4 w-4
              ${
                isStrength
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }
            `}
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">
            {title}
          </h4>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {explanation}
          </p>
        </div>
      </div>
    </article>
  )
}
function InvestmentBrief({
  brief,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        mt-5 overflow-hidden rounded-2xl
        border border-violet-400/20
        bg-gradient-to-br
        from-violet-500/[0.08]
        via-white/[0.025]
        to-cyan-400/[0.04]
        p-5
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-violet-400/20
            bg-violet-400/[0.1]
          "
        >
          <BrainCircuit className="h-5 w-5 text-violet-200" />
        </div>
        <div>
          <p
            className="
              text-xs font-semibold uppercase
              tracking-[0.12em] text-violet-300
            "
          >
            IBM watsonx.ai intelligence
          </p>
          <h3 className="mt-1 text-lg font-bold text-white">
            AI Investment Brief
          </h3>
        </div>
      </div>
      <div
        className="
          mt-5 rounded-xl border border-white/[0.07]
          bg-slate-950/30 p-4
        "
      >
        <p
          className="
            text-xs font-semibold uppercase
            tracking-[0.1em] text-violet-300
          "
        >
          Investment thesis
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {brief.investment_thesis}
        </p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <h4 className="text-sm font-semibold text-white">
              Key strengths
            </h4>
          </div>
          <div className="space-y-3">
            {brief.key_strengths?.map((item, index) => (
              <BriefInsightCard
                key={`${item.title}-${index}`}
                icon={CheckCircle2}
                title={item.title}
                explanation={item.explanation}
                type="strength"
              />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-300" />
            <h4 className="text-sm font-semibold text-white">
              Due-diligence concerns
            </h4>
          </div>
          <div className="space-y-3">
            {brief.due_diligence_concerns?.map(
              (item, index) => (
                <BriefInsightCard
                  key={`${item.title}-${index}`}
                  icon={ShieldAlert}
                  title={item.title}
                  explanation={item.explanation}
                  type="risk"
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          <CircleHelp className="h-4 w-4 text-cyan-300" />
          <h4 className="text-sm font-semibold text-white">
            Questions to ask the founder
          </h4>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {brief.founder_questions?.map((item, index) => (
            <article
              key={`${item.question}-${index}`}
              className="
                rounded-xl border border-cyan-400/10
                bg-cyan-400/[0.035] p-4
              "
            >
              <span
                className="
                  flex h-7 w-7 items-center justify-center
                  rounded-lg bg-cyan-400/[0.1]
                  text-xs font-bold text-cyan-200
                "
              >
                {index + 1}
              </span>
              <p className="mt-3 text-sm font-medium leading-6 text-white">
                {item.question}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {item.reason}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div
        className="
          mt-5 rounded-xl border border-violet-400/15
          bg-violet-400/[0.05] p-4
        "
      >
        <div className="flex items-start gap-3">
          <TrendingUp
            className="
              mt-0.5 h-5 w-5 shrink-0 text-violet-300
            "
          />
          <div>
            <p className="text-sm font-semibold text-white">
              Investor perspective
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {brief.investor_perspective}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
function StartupMatchCard({
  match,
  index,
}) {
  const [expanded, setExpanded] = useState(false)
  const [brief, setBrief] = useState(null)
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefError, setBriefError] = useState('')
  const nested = match.startup || match.startups || match.startup_profile
  const startup = { ...match, ...(Array.isArray(nested) ? (nested[0] || {}) : (nested || {})) }
  const startupName = startup.name || startup.startup_name || startup.company_name || match.startup_name || match.company_name || 'Unnamed startup'
  const reasons = Array.isArray(match.match_reasons) ? match.match_reasons : []
  const handleGenerateBrief = async () => {
    setBriefLoading(true)
    setBriefError('')
    try {
      const result = await generateInvestmentBrief(match.id)
      setBrief(result.brief)
    } catch (requestError) {
      setBriefError(
        requestError?.message ||
          'Unable to generate the AI investment brief.'
      )
    } finally {
      setBriefLoading(false)
    }
  }
  const location = [
    startup.headquarters_city,
    startup.headquarters_country,
  ]
    .filter(Boolean)
    .join(', ')
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
      }}
      className="
        glass-panel overflow-hidden rounded-[2rem]
      "
    >
      <div className="p-6 sm:p-7">
        <div
          className="
            flex flex-col gap-5
            lg:flex-row lg:items-start
            lg:justify-between
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-13 w-13 shrink-0 items-center
                justify-center rounded-2xl
                border border-violet-400/20
                bg-violet-400/[0.08]
              "
            >
              <Building2 className="h-6 w-6 text-violet-200" />
            </div>
            <div>
              <h2
                className="
                  text-xl font-bold
                  tracking-[-0.03em] text-white
                "
              >
                {startupName}
              </h2>
              {startup.tagline && (
                <p className="mt-1 text-sm text-slate-400">
                  {startup.tagline}
                </p>
              )}
              <div
                className="
                  mt-3 flex flex-wrap gap-x-4
                  gap-y-2 text-xs text-slate-500
                "
              >
                {startup.industry && (
                  <span className="inline-flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    {startup.industry}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                  </span>
                )}
                {startup.team_size !== undefined && (
                  <span className="inline-flex items-center gap-1.5">
                    <UsersRound className="h-3.5 w-3.5" />
                    Team of {startup.team_size}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className="
              flex items-center gap-3 lg:flex-col
              lg:items-end
            "
          >
            <div
              className="
                rounded-2xl border border-violet-400/20
                bg-violet-400/[0.08]
                px-5 py-3 text-center
              "
            >
              <p className="text-xs font-medium text-violet-300">
                Match score
              </p>
              <p
                className="
                  mt-1 text-2xl font-bold text-white
                "
              >
                {formatScore(match.overall_score)}
                <span className="text-sm text-slate-500">
                  /100
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          className="
            mt-5 grid gap-3
            sm:grid-cols-2 lg:grid-cols-4
          "
        >
          <DimensionScore
            label="Industry fit"
            value={
              match.dimension_scores?.sector ??
              match.dimension_scores?.industry_fit ??
              match.dimension_scores?.industry
            }
          />
          <DimensionScore
            label="Stage fit"
            value={
              match.dimension_scores?.stage_fit ??
              match.dimension_scores?.stage
            }
          />
          <DimensionScore
            label="Geography fit"
            value={
              match.dimension_scores?.geography_fit ??
              match.dimension_scores?.geography
            }
          />
          <DimensionScore
            label="Investment fit"
            value={
              match.dimension_scores?.cheque ??
              match.dimension_scores?.investment_fit ??
              match.dimension_scores?.investment
            }
          />
        </div>
        <div
          className="
            mt-5 flex flex-col gap-3
            sm:flex-row sm:items-center
            sm:justify-between
          "
        >
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="
              inline-flex items-center gap-2
              text-sm font-semibold text-slate-400
              transition-colors hover:text-white
            "
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {expanded
              ? 'Hide match details'
              : 'View match details'}
          </button>
          <button
            type="button"
            onClick={handleGenerateBrief}
            disabled={briefLoading}
            className="
              focus-ring inline-flex items-center
              justify-center gap-2 rounded-xl
              bg-gradient-to-r from-violet-600
              to-cyan-500 px-4 py-2.5
              text-sm font-semibold text-white
              shadow-[0_10px_30px_rgba(124,58,237,0.18)]
              transition-opacity hover:opacity-95
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {briefLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Analyzing startup
              </>
            ) : brief ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate AI brief
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI investment brief
              </>
            )}
          </button>
        </div>
        {briefError && (
          <div
            className="
              mt-4 flex items-start gap-2
              rounded-xl border border-rose-400/20
              bg-rose-400/[0.07] px-4 py-3
              text-sm text-rose-200
            "
            role="alert"
          >
            <AlertTriangle
              className="
                mt-0.5 h-4 w-4 shrink-0
              "
            />
            <p>{briefError}</p>
          </div>
        )}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="
              mt-5 border-t border-white/[0.06]
              pt-5
            "
          >
            <h3 className="text-sm font-semibold text-white">
              Why this startup matched
            </h3>
            {reasons.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {reasons.map((reason, reasonIndex) => (
                  <li
                    key={`${reason?.dimension || 'reason'}-${reasonIndex}`}
                    className="
                      flex items-start gap-2
                      text-sm leading-6 text-slate-400
                    "
                  >
                    <CheckCircle2
                      className="
                        mt-1 h-4 w-4 shrink-0
                        text-emerald-300
                      "
                    />
                    {typeof reason === 'string' ? reason : typeof reason?.message === 'string' ? reason.message : 'No explanation available.'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No detailed match explanation is available.
              </p>
            )}
            <div
              className="
                mt-5 grid gap-3 sm:grid-cols-2
              "
            >
              <div
                className="
                  rounded-xl border border-white/[0.07]
                  bg-white/[0.025] p-4
                "
              >
                <p className="text-xs text-slate-600">
                  Funding raised
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  {formatUsd(
                    startup.total_funding_raised_usd
                  )}
                </p>
              </div>
              <div
                className="
                  rounded-xl border border-white/[0.07]
                  bg-white/[0.025] p-4
                "
              >
                <p className="text-xs text-slate-600">
                  Target raise
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  {formatUsd(startup.target_raise_usd)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {brief && (
          <InvestmentBrief brief={brief} />
        )}
      </div>
    </motion.article>
  )
}
function StartupMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const loadMatches = async () => {
    setLoading(true)
    setError('')
    try {
      const result =
        await matchingService.getStartupMatches()
      setMatches(Array.isArray(result?.matches) ? result.matches : Array.isArray(result) ? result : [])
    } catch (loadError) {
      setError(
        loadError?.message ||
          'Unable to load your startup matches.'
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      setError('')
      try {
        const result =
          await matchingService.getStartupMatches()
        setMatches(Array.isArray(result?.matches) ? result.matches : Array.isArray(result) ? result : [])
      } catch (loadError) {
        setError(
          loadError?.message ||
            'Unable to load your startup matches.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])
  const handleGenerateMatches = async () => {
    setGenerating(true)
    setError('')
    try {
      await matchingService.generateMatches()
      await loadMatches()
    } catch (generateError) {
      setError(
        generateError?.message ||
          'Unable to generate startup matches.'
      )
    } finally {
      setGenerating(false)
    }
  }
  if (loading) {
    return (
      <PageLoader label="Loading your startup matches" />
    )
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
          <Logo />
          <Link
            to={ROUTES.INVESTOR.DASHBOARD}
            className="
              focus-ring inline-flex items-center gap-2
              rounded-xl border border-white/[0.08]
              bg-white/[0.035] px-4 py-2.5
              text-sm font-semibold text-slate-300
              transition-colors hover:bg-white/[0.06]
              hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>
      <div
        className="
          section-container relative py-10 lg:py-14
        "
      >
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex flex-col gap-6 lg:flex-row
            lg:items-end lg:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex items-center gap-2
                rounded-full border border-violet-400/20
                bg-violet-400/[0.07]
                px-3 py-1.5 text-xs font-semibold
                text-violet-200
              "
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-assisted investment intelligence
            </div>
            <h1
              className="
                mt-5 text-4xl font-bold
                tracking-[-0.05em] text-white sm:text-5xl
              "
            >
              Startup matches
            </h1>
            <p
              className="
                mt-4 max-w-2xl text-base
                leading-7 text-slate-400
              "
            >
              Discover startups aligned with your investment
              preferences, explore deterministic match
              explanations, and generate AI-powered investment
              briefs through IBM watsonx.ai.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateMatches}
            disabled={generating}
            className="
              focus-ring inline-flex items-center
              justify-center gap-2 rounded-xl
              border border-white/[0.09]
              bg-white/[0.04] px-5 py-3
              text-sm font-semibold text-slate-200
              transition-colors hover:bg-white/[0.07]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {generating ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Generating matches
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh matches
              </>
            )}
          </button>
        </motion.section>
        {error && (
          <div
            className="
              mt-6 flex items-start gap-3
              rounded-xl border border-rose-400/20
              bg-rose-400/[0.07] px-4 py-3
              text-sm text-rose-200
            "
            role="alert"
          >
            <AlertTriangle
              className="
                mt-0.5 h-5 w-5 shrink-0
              "
            />
            {error}
          </div>
        )}
        {matches.length === 0 ? (
          <section
            className="
              glass-panel mt-8 rounded-[2rem]
              px-6 py-14 text-center
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
              <Target className="h-7 w-7 text-violet-200" />
            </div>
            <h2
              className="
                mt-6 text-2xl font-bold text-white
              "
            >
              No startup matches yet
            </h2>
            <p
              className="
                mx-auto mt-3 max-w-xl
                text-sm leading-7 text-slate-500
              "
            >
              Generate matches to discover startups aligned
              with your investment profile.
            </p>
            <button
              type="button"
              onClick={handleGenerateMatches}
              disabled={generating}
              className="
                mt-7 inline-flex items-center
                justify-center gap-2 rounded-xl
                bg-gradient-to-r from-violet-600
                to-cyan-500 px-5 py-3
                text-sm font-semibold text-white
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {generating ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Generating matches
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate startup matches
                </>
              )}
            </button>
          </section>
        ) : (
          <section className="mt-8 space-y-5">
            <div
              className="
                flex items-center justify-between gap-4
              "
            >
              <p className="text-sm text-slate-500">
                {matches.length}{' '}
                {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>
            {matches.map((match, index) => (
              <StartupMatchCard
                key={match.id || index}
                match={match}
                index={index}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
export default StartupMatches
