import { motion } from 'motion/react'
import {
  ArrowUpRight,
  FileSearch,
  Gauge,
  Map,
  Target,
} from 'lucide-react'
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from '../../utils/animations'
const features = [
  {
    icon: Gauge,
    title: 'Funding Readiness Score',
    description:
      'Evaluate market, traction, team, financial health, product readiness, scalability, and pitch quality from actual startup data.',
  },
  {
    icon: FileSearch,
    title: 'AI Pitch Intelligence',
    description:
      'Identify strengths, weaknesses, risks, clarity gaps, and missing information through genuine IBM Granite analysis.',
  },
  {
    icon: Target,
    title: 'Explainable Investor Matching',
    description:
      'See ranked compatibility based on investor preferences, startup stage, industry, funding requirements, geography, and more.',
  },
  {
    icon: Map,
    title: 'Prioritized Improvement Roadmap',
    description:
      'Turn readiness gaps and pitch analysis into focused actions designed around the startup’s actual profile.',
  },
]
function FounderFeatures() {
  return (
    <section id="founders" className="section-spacing relative scroll-mt-24">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute left-0 top-1/3 -z-10
          h-96 w-96 rounded-full bg-violet-500/[0.06] blur-[120px]
        "
      />
      <div className="section-container">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:sticky lg:top-32"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              For founders
            </span>
            <h2
              className="
                mt-4 text-4xl font-bold tracking-[-0.045em]
                text-white sm:text-5xl
              "
            >
              Know where you stand.
              <span className="text-gradient"> Know what to improve.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
              Fundora brings readiness scoring, pitch intelligence, matching,
              and improvement planning into one connected founder workflow.
            </p>
            <div
              className="
                mt-8 inline-flex items-center gap-2 rounded-full
                border border-cyan-400/15 bg-cyan-400/[0.05]
                px-4 py-2 text-sm font-medium text-cyan-200
              "
            >
              Built around real startup inputs
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-4 sm:grid-cols-2"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="
                    group min-h-64 rounded-2xl border border-white/[0.08]
                    bg-gradient-to-b from-white/[0.045] to-white/[0.02]
                    p-6 transition-colors duration-300
                    hover:border-violet-400/20
                  "
                >
                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-xl border border-white/[0.08]
                      bg-white/[0.045]
                      transition-colors duration-300
                      group-hover:border-violet-400/20
                      group-hover:bg-violet-400/[0.08]
                    "
                  >
                    <Icon className="h-5 w-5 text-violet-200" />
                  </div>
                  <h3 className="mt-7 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
export default FounderFeatures
