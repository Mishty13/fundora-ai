import { motion } from 'motion/react'
import {
  Filter,
  Layers3,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react'
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from '../../utils/animations'
const features = [
  {
    icon: SearchCheck,
    title: 'Relevant startup discovery',
    description:
      'Surface startups according to actual investment preferences and compatibility criteria.',
  },
  {
    icon: Filter,
    title: 'Preference-aware matching',
    description:
      'Consider industry, stage, ticket size, geography, business model, traction, and other defined investment preferences.',
  },
  {
    icon: Layers3,
    title: 'Ranked compatibility',
    description:
      'Review startups through transparent compatibility scores rather than an unexplained directory order.',
  },
  {
    icon: ShieldCheck,
    title: 'Explainable reasoning',
    description:
      'Understand the positive alignments, constraints, and compatibility gaps behind every generated match.',
  },
]
function InvestorFeatures() {
  return (
    <section
      id="investors"
      className="section-spacing relative scroll-mt-24 overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 top-1/4 -z-10
          h-[30rem] w-[30rem] rounded-full
          bg-cyan-400/[0.055] blur-[130px]
        "
      />
      <div className="section-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            For investors
          </span>
          <h2
            className="
              mt-4 text-4xl font-bold tracking-[-0.045em]
              text-white sm:text-5xl
            "
          >
            Find stronger alignment,
            <span className="text-gradient"> with reasons you can inspect.</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
            Fundora is designed to help investors discover relevant startups
            against explicitly defined investment preferences and transparent
            compatibility logic.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 md:grid-cols-2"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="
                  flex gap-5 rounded-2xl border border-white/[0.08]
                  bg-white/[0.03] p-6
                  transition-colors duration-300
                  hover:border-cyan-400/20 hover:bg-white/[0.045]
                "
              >
                <div
                  className="
                    flex h-12 w-12 shrink-0 items-center justify-center
                    rounded-xl border border-cyan-400/15
                    bg-cyan-400/[0.06]
                  "
                >
                  <Icon className="h-5 w-5 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
export default InvestorFeatures
