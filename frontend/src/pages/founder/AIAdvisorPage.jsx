import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import { generateAIAdvice } from '../../services/aiAdvisorApi'
import { ROUTES } from '../../config/app'


function InsightCard({
  icon: Icon,
  title,
  explanation,
  type,
  index,
}) {
  const styles = {
    strength: {
      iconBorder: 'border-emerald-400/20',
      iconBackground: 'bg-emerald-400/[0.08]',
      iconColor: 'text-emerald-300',
      glow: 'bg-emerald-400/[0.03]',
    },
    risk: {
      iconBorder: 'border-amber-400/20',
      iconBackground: 'bg-amber-400/[0.08]',
      iconColor: 'text-amber-300',
      glow: 'bg-amber-400/[0.03]',
    },
  }

  const selectedStyle = styles[type]

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
      }}
      className="
        relative overflow-hidden rounded-2xl
        border border-white/[0.07]
        bg-white/[0.025] p-5
      "
    >
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0
          ${selectedStyle.glow}
        `}
      />

      <div className="relative flex items-start gap-4">
        <div
          className={`
            flex h-10 w-10 shrink-0 items-center
            justify-center rounded-xl border
            ${selectedStyle.iconBorder}
            ${selectedStyle.iconBackground}
          `}
        >
          <Icon
            className={`
              h-5 w-5
              ${selectedStyle.iconColor}
            `}
          />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {explanation}
          </p>
        </div>
      </div>
    </motion.article>
  )
}


function PriorityActionCard({ action, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
      }}
      className="
        group rounded-2xl border border-white/[0.07]
        bg-white/[0.025] p-5
        transition-colors hover:border-violet-400/20
        hover:bg-violet-400/[0.035]
      "
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center
            justify-center rounded-xl
            bg-gradient-to-br from-violet-600 to-cyan-500
            text-base font-bold text-white
            shadow-[0_8px_30px_rgba(124,58,237,0.2)]
          "
        >
          {action.priority}
        </div>

        <div className="min-w-0">
          <p
            className="
              text-xs font-semibold uppercase
              tracking-[0.12em] text-violet-300
            "
          >
            Priority {action.priority}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-white">
            {action.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {action.action}
          </p>

          <div
            className="
              mt-4 flex items-start gap-2 rounded-xl
              border border-cyan-400/10
              bg-cyan-400/[0.04] px-3.5 py-3
            "
          >
            <TrendingUp
              className="
                mt-0.5 h-4 w-4 shrink-0 text-cyan-300
              "
            />

            <p className="text-xs leading-5 text-slate-400">
              <span className="font-semibold text-cyan-200">
                Expected impact:
              </span>{' '}
              {action.expected_impact}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}


function AIAdvisorPage() {
  const [advice, setAdvice] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerateAdvice = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await generateAIAdvice()
      setAdvice(result.advice)
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to generate AI funding advice.'
      )
    } finally {
      setIsLoading(false)
    }
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
          h-[32rem] w-[32rem] rounded-full
          bg-violet-500/[0.08] blur-[160px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 top-[35rem]
          h-[30rem] w-[30rem] rounded-full
          bg-cyan-400/[0.05] blur-[160px]
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
            to={ROUTES.FOUNDER.DASHBOARD}
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
          section-container relative py-10
          lg:py-14
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
            relative overflow-hidden rounded-[2rem]
            border border-violet-400/15
            bg-gradient-to-br
            from-violet-500/[0.09]
            via-white/[0.025]
            to-cyan-400/[0.05]
            p-6 sm:p-8 lg:p-10
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute -right-20 -top-20
              h-64 w-64 rounded-full
              bg-violet-500/[0.1] blur-[100px]
            "
          />

          <div className="relative">
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
              Powered by IBM watsonx.ai
            </div>

            <div
              className="
                mt-6 flex flex-col gap-6
                lg:flex-row lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-3xl">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex h-14 w-14 shrink-0
                      items-center justify-center rounded-2xl
                      border border-violet-400/20
                      bg-violet-400/[0.1]
                    "
                  >
                    <BrainCircuit
                      className="
                        h-7 w-7 text-violet-200
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm font-semibold
                        text-violet-300
                      "
                    >
                      Fundora intelligence
                    </p>

                    <h1
                      className="
                        mt-1 text-3xl font-bold
                        tracking-[-0.045em] text-white
                        sm:text-4xl lg:text-5xl
                      "
                    >
                      Founder AI Funding Advisor
                    </h1>
                  </div>
                </div>

                <p
                  className="
                    mt-6 max-w-2xl text-base
                    leading-7 text-slate-400
                  "
                >
                  Receive personalized funding guidance based
                  on your real startup profile, readiness
                  assessment, pitch intelligence, and
                  improvement roadmap.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={isLoading}
                className="
                  focus-ring inline-flex min-w-[220px]
                  items-center justify-center gap-2
                  rounded-xl bg-gradient-to-r
                  from-violet-600 to-cyan-500
                  px-5 py-3.5 text-sm font-semibold
                  text-white
                  shadow-[0_12px_40px_rgba(124,58,237,0.22)]
                  transition-all hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isLoading ? (
                  <>
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                    />
                    Analyzing startup
                  </>
                ) : advice ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate advice
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate AI advice
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mt-6 flex items-start gap-3 rounded-2xl
              border border-rose-400/20
              bg-rose-400/[0.07] px-5 py-4
              text-sm text-rose-200
            "
            role="alert"
          >
            <AlertTriangle
              className="
                mt-0.5 h-5 w-5 shrink-0
              "
            />

            <p>{error}</p>
          </motion.div>
        )}

        {!advice && !isLoading && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="
              glass-panel mt-6 rounded-[2rem]
              px-6 py-14 text-center sm:px-10
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
              <BrainCircuit
                className="h-7 w-7 text-violet-200"
              />
            </div>

            <h2
              className="
                mt-6 text-2xl font-bold
                tracking-[-0.035em] text-white
              "
            >
              Your personalized funding intelligence
              is ready to be generated
            </h2>

            <p
              className="
                mx-auto mt-3 max-w-2xl
                text-sm leading-7 text-slate-500
              "
            >
              Fundora combines your existing startup
              intelligence and uses IBM watsonx.ai to
              generate contextual, evidence-based guidance
              tailored to your funding journey.
            </p>

            <div
              className="
                mx-auto mt-8 grid max-w-3xl gap-3
                sm:grid-cols-3
              "
            >
              {[
                {
                  icon: ShieldCheck,
                  title: 'Evidence based',
                  text: 'Uses your real Fundora data',
                },
                {
                  icon: Target,
                  title: 'Prioritized',
                  text: 'Focuses on highest-impact actions',
                },
                {
                  icon: Lightbulb,
                  title: 'Contextual',
                  text: 'Personalized to your startup',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="
                    rounded-xl border border-white/[0.07]
                    bg-white/[0.025] p-4
                  "
                >
                  <item.icon
                    className="
                      mx-auto h-5 w-5 text-cyan-300
                    "
                  />

                  <p
                    className="
                      mt-3 text-sm font-semibold text-white
                    "
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      mt-1 text-xs text-slate-600
                    "
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {isLoading && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              glass-panel mt-6 rounded-[2rem]
              px-6 py-16 text-center
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
              <LoaderCircle
                className="
                  h-7 w-7 animate-spin
                  text-violet-200
                "
              />
            </div>

            <h2
              className="
                mt-6 text-2xl font-bold
                tracking-[-0.035em] text-white
              "
            >
              Analyzing your startup intelligence
            </h2>

            <p
              className="
                mx-auto mt-3 max-w-xl
                text-sm leading-7 text-slate-500
              "
            >
              Fundora is combining your startup profile,
              readiness assessment, pitch analysis, and
              roadmap to generate personalized funding
              guidance.
            </p>
          </motion.section>
        )}

        {advice && !isLoading && (
          <div className="mt-8 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                glass-panel rounded-[2rem] p-6
                sm:p-8
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 items-center
                    justify-center rounded-xl
                    border border-violet-400/20
                    bg-violet-400/[0.08]
                  "
                >
                  <Sparkles
                    className="
                      h-5 w-5 text-violet-200
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-xs font-semibold uppercase
                      tracking-[0.12em] text-violet-300
                    "
                  >
                    AI assessment
                  </p>

                  <h2
                    className="
                      mt-1 text-xl font-bold text-white
                    "
                  >
                    Executive summary
                  </h2>
                </div>
              </div>

              <p
                className="
                  mt-6 text-base leading-8 text-slate-300
                "
              >
                {advice.executive_summary}
              </p>
            </motion.section>

            <section
              className="
                grid gap-6
                lg:grid-cols-2
              "
            >
              <div className="glass-panel rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 items-center
                      justify-center rounded-xl
                      border border-emerald-400/20
                      bg-emerald-400/[0.08]
                    "
                  >
                    <CheckCircle2
                      className="
                        h-5 w-5 text-emerald-300
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-xs font-semibold uppercase
                        tracking-[0.12em]
                        text-emerald-300
                      "
                    >
                      What works
                    </p>

                    <h2
                      className="
                        mt-1 text-xl font-bold text-white
                      "
                    >
                      Funding strengths
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {advice.funding_strengths?.map(
                    (item, index) => (
                      <InsightCard
                        key={`${item.title}-${index}`}
                        icon={CheckCircle2}
                        title={item.title}
                        explanation={item.explanation}
                        type="strength"
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="glass-panel rounded-[2rem] p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10 items-center
                      justify-center rounded-xl
                      border border-amber-400/20
                      bg-amber-400/[0.08]
                    "
                  >
                    <AlertTriangle
                      className="
                        h-5 w-5 text-amber-300
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-xs font-semibold uppercase
                        tracking-[0.12em]
                        text-amber-300
                      "
                    >
                      Needs attention
                    </p>

                    <h2
                      className="
                        mt-1 text-xl font-bold text-white
                      "
                    >
                      Critical risks
                    </h2>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {advice.critical_risks?.map(
                    (item, index) => (
                      <InsightCard
                        key={`${item.title}-${index}`}
                        icon={AlertTriangle}
                        title={item.title}
                        explanation={item.explanation}
                        type="risk"
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            </section>

            <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <div
                className="
                  flex flex-col gap-4 sm:flex-row
                  sm:items-center sm:justify-between
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11 items-center
                      justify-center rounded-xl
                      border border-cyan-400/20
                      bg-cyan-400/[0.07]
                    "
                  >
                    <Target
                      className="
                        h-5 w-5 text-cyan-300
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-xs font-semibold uppercase
                        tracking-[0.12em] text-cyan-300
                      "
                    >
                      Recommended next steps
                    </p>

                    <h2
                      className="
                        mt-1 text-xl font-bold text-white
                      "
                    >
                      Priority actions
                    </h2>
                  </div>
                </div>

                <span
                  className="
                    w-fit rounded-full border
                    border-white/[0.07]
                    bg-white/[0.035]
                    px-3 py-1.5 text-xs
                    font-medium text-slate-500
                  "
                >
                  Ranked by expected impact
                </span>
              </div>

              <div
                className="
                  mt-6 grid gap-4
                  lg:grid-cols-3
                "
              >
                {advice.priority_actions?.map(
                  (action, index) => (
                    <PriorityActionCard
                      key={action.priority}
                      action={action}
                      index={index}
                    />
                  )
                )}
              </div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                relative overflow-hidden rounded-[2rem]
                border border-violet-400/20
                bg-gradient-to-br
                from-violet-500/[0.12]
                via-white/[0.025]
                to-cyan-400/[0.07]
                p-6 sm:p-8
              "
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  -right-20 -top-20
                  h-60 w-60 rounded-full
                  bg-violet-500/[0.12]
                  blur-[100px]
                "
              />

              <div className="relative">
                <div
                  className="
                    flex h-12 w-12 items-center
                    justify-center rounded-xl
                    border border-violet-400/20
                    bg-violet-400/[0.1]
                  "
                >
                  <TrendingUp
                    className="
                      h-6 w-6 text-violet-200
                    "
                  />
                </div>

                <p
                  className="
                    mt-5 text-xs font-semibold uppercase
                    tracking-[0.14em] text-violet-300
                  "
                >
                  Investor positioning
                </p>

                <h2
                  className="
                    mt-2 text-2xl font-bold
                    tracking-[-0.035em] text-white
                  "
                >
                  How to position your startup
                </h2>

                <p
                  className="
                    mt-4 max-w-4xl text-base
                    leading-8 text-slate-300
                  "
                >
                  {advice.investor_positioning}
                </p>

                <Link
                  to={ROUTES.FOUNDER.INVESTOR_MATCHES}
                  className="
                    mt-6 inline-flex items-center gap-2
                    text-sm font-semibold text-violet-300
                    transition-colors hover:text-violet-200
                  "
                >
                  Explore investor matches
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.section>

            <div
              className="
                flex justify-center border-t
                border-white/[0.06] pt-8
              "
            >
              <button
                type="button"
                onClick={handleGenerateAdvice}
                disabled={isLoading}
                className="
                  focus-ring inline-flex items-center
                  justify-center gap-2 rounded-xl
                  border border-white/[0.09]
                  bg-white/[0.04] px-5 py-3
                  text-sm font-semibold text-slate-300
                  transition-colors hover:bg-white/[0.07]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate with latest data
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}


export default AIAdvisorPage