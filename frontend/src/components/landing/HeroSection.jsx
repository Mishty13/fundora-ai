import { motion } from 'motion/react'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
} from 'lucide-react'
import Button from '../common/Button'
import { ROUTES } from '../../config/app'
import {
  fadeUp,
  staggerContainer,
} from '../../utils/animations'
const capabilities = [
  {
    icon: Target,
    label: 'Funding readiness',
  },
  {
    icon: FileSearch,
    label: 'Pitch intelligence',
  },
  {
    icon: BrainCircuit,
    label: 'Explainable matching',
  },
]
function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-36">
      <div
        className="
          pointer-events-none absolute left-1/2 top-0 -z-20
          h-[46rem] w-[72rem] -translate-x-1/2 rounded-full
          bg-violet-600/[0.09] blur-[140px]
        "
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 28, 0],
          y: [0, -18, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none absolute -left-28 top-52 -z-10
          h-72 w-72 rounded-full bg-violet-500/[0.13] blur-[100px]
        "
      />
      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -24, 0],
          y: [0, 22, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="
          pointer-events-none absolute -right-24 top-32 -z-10
          h-80 w-80 rounded-full bg-cyan-400/[0.09] blur-[110px]
        "
      />
      <div className="section-container section-spacing pt-16 sm:pt-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center"
        >
          <motion.div variants={fadeUp} className="mb-7 flex justify-center">
            <div
              className="
                inline-flex items-center gap-2 rounded-full
                border border-violet-400/20 bg-violet-400/[0.07]
                px-3.5 py-2 text-sm font-medium text-violet-200
                backdrop-blur-xl
              "
            >
              <Sparkles className="h-4 w-4 text-cyan-300" />
              AI-powered startup funding intelligence
            </div>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="
              text-balance text-5xl font-bold tracking-[-0.055em]
              text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]
              lg:leading-[0.98]
            "
          >
            Funding intelligence that
            <span className="text-gradient"> moves startups forward.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="
              mx-auto mt-7 max-w-3xl text-pretty text-base leading-8
              text-slate-400 sm:text-lg
            "
          >
            Evaluate funding readiness, uncover pitch strengths and risks with
            IBM Granite, and discover explainable investor matches through
            real data and transparent intelligence.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="
              mt-9 flex flex-col items-center justify-center gap-3
              sm:flex-row
            "
          >
            <Button
              to={ROUTES.SIGNUP}
              className="min-w-44 px-6 py-3.5 text-base"
            >
              Start your analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="#how-it-works"
              className="
                focus-ring inline-flex min-w-44 items-center justify-center
                gap-2 rounded-xl border border-white/10 bg-white/[0.04]
                px-6 py-3.5 text-base font-semibold text-slate-200
                transition-colors duration-300
                hover:border-white/20 hover:bg-white/[0.08]
              "
            >
              See how it works
            </a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="
              mx-auto mt-10 flex max-w-2xl flex-wrap
              items-center justify-center gap-x-6 gap-y-3
            "
          >
            {capabilities.map((capability) => {
              const Icon = capability.icon
              return (
                <div
                  key={capability.label}
                  className="flex items-center gap-2 text-sm text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <Icon className="h-4 w-4 text-violet-300" />
                  <span>{capability.label}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.9,
            delay: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto mt-16 max-w-6xl"
        >
          <div
            className="
              absolute inset-x-16 -top-10 -z-10 h-40
              rounded-full bg-violet-500/20 blur-[90px]
            "
          />
          <div className="glass-panel overflow-hidden rounded-[2rem] p-2">
            <div
              className="
                relative overflow-hidden rounded-[1.55rem]
                border border-white/[0.06] bg-[#080c19]
                px-5 py-7 sm:px-8 sm:py-9
              "
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0 opacity-30
                  [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
                  [background-size:36px_36px]
                "
              />
              <div className="relative grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Target,
                    title: 'Readiness engine',
                    text: 'Multi-dimensional evaluation based on actual startup inputs.',
                  },
                  {
                    icon: FileSearch,
                    title: 'Pitch intelligence',
                    text: 'Qualitative analysis powered through IBM Granite.',
                  },
                  {
                    icon: BrainCircuit,
                    title: 'Adaptive matching',
                    text: 'Transparent compatibility scoring against investor preferences.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.article
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.85 + index * 0.12,
                        duration: 0.55,
                      }}
                      whileHover={{ y: -5 }}
                      className="
                        rounded-2xl border border-white/[0.07]
                        bg-white/[0.035] p-5 text-left
                        transition-colors duration-300
                        hover:border-violet-400/20 hover:bg-white/[0.055]
                      "
                    >
                      <div
                        className="
                          mb-5 flex h-11 w-11 items-center justify-center
                          rounded-xl border border-white/[0.08]
                          bg-gradient-to-br from-violet-500/20 to-cyan-400/10
                        "
                      >
                        <Icon className="h-5 w-5 text-violet-200" />
                      </div>
                      <h2 className="text-base font-semibold text-white">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.text}
                      </p>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
export default HeroSection
