import { motion } from 'motion/react'
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  LineChart,
  UserRound,
} from 'lucide-react'
import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from '../../utils/animations'
const steps = [
  {
    number: '01',
    icon: UserRound,
    title: 'Build your startup profile',
    description:
      'Provide your actual startup details, stage, traction, team, financial context, product maturity, and funding goals.',
  },
  {
    number: '02',
    icon: LineChart,
    title: 'Measure funding readiness',
    description:
      'Fundora evaluates multiple dimensions through a transparent scoring engine built from your submitted data.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Analyze your pitch',
    description:
      'Your pitch is examined for strengths, weaknesses, risks, clarity, and missing information through IBM Granite.',
  },
  {
    number: '04',
    icon: BrainCircuit,
    title: 'Discover explainable matches',
    description:
      'Investor compatibility is ranked against real investor preferences with clear reasons behind every match.',
  },
]
function HowItWorks() {
  return (
    <section id="how-it-works" className="section-spacing relative scroll-mt-24">
      <div className="section-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            How it works
          </span>
          <h2
            className="
              mt-4 text-4xl font-bold tracking-[-0.045em]
              text-white sm:text-5xl
            "
          >
            From startup data to
            <span className="text-gradient"> funding clarity.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            A connected intelligence workflow designed to turn genuine startup
            information into actionable funding insight.
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.article
                key={step.number}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="
                  group relative overflow-hidden rounded-2xl
                  border border-white/[0.08] bg-white/[0.035]
                  p-6 transition-colors duration-300
                  hover:border-violet-400/20 hover:bg-white/[0.05]
                "
              >
                <div
                  className="
                    absolute right-4 top-3 text-5xl font-black
                    tracking-[-0.08em] text-white/[0.035]
                  "
                  aria-hidden="true"
                >
                  {step.number}
                </div>
                <div
                  className="
                    flex h-12 w-12 items-center justify-center rounded-xl
                    border border-violet-400/15
                    bg-gradient-to-br from-violet-500/15 to-cyan-400/[0.08]
                  "
                >
                  <Icon className="h-5 w-5 text-violet-200" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight
                    className="
                      absolute -right-3 top-1/2 hidden h-6 w-6
                      -translate-y-1/2 text-violet-400/40 lg:block
                    "
                    aria-hidden="true"
                  />
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
export default HowItWorks
