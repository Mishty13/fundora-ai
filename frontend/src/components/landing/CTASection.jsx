import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import { ROUTES } from '../../config/app'
import { fadeUp, viewportOnce } from '../../utils/animations'
function CTASection() {
  return (
    <section className="section-spacing">
      <div className="section-container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="
            relative overflow-hidden rounded-[2rem]
            border border-violet-400/15
            bg-gradient-to-br from-violet-600/15
            via-white/[0.035] to-cyan-400/[0.08]
            px-6 py-16 text-center sm:px-10 sm:py-20
          "
        >
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="
              pointer-events-none absolute left-1/2 top-1/2 -z-10
              h-80 w-80 -translate-x-1/2 -translate-y-1/2
              rounded-full bg-violet-500/20 blur-[100px]
            "
          />
          <div
            className="
              mx-auto flex h-12 w-12 items-center justify-center
              rounded-2xl border border-white/[0.1] bg-white/[0.06]
            "
          >
            <Sparkles className="h-5 w-5 text-cyan-200" />
          </div>
          <h2
            className="
              mx-auto mt-6 max-w-3xl text-4xl font-bold
              tracking-[-0.045em] text-white sm:text-5xl
            "
          >
            Turn startup information into
            <span className="text-gradient"> funding intelligence.</span>
          </h2>
          <p
            className="
              mx-auto mt-5 max-w-2xl text-base leading-8
              text-slate-400 sm:text-lg
            "
          >
            Create your profile, evaluate readiness, analyze your pitch, and
            discover investor alignment through one connected platform.
          </p>
          <div className="mt-9 flex justify-center">
            <Button
              to={ROUTES.SIGNUP}
              className="px-7 py-3.5 text-base"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
export default CTASection
