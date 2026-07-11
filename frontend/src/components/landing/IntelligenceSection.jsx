import { motion } from 'motion/react'
import {
  BrainCircuit,
  Database,
  GitBranch,
  LockKeyhole,
  Sparkles,
} from 'lucide-react'
import { fadeUp, viewportOnce } from '../../utils/animations'
const layers = [
  {
    icon: Database,
    title: 'Real startup and investor data',
    description:
      'Profiles, preferences, documents, and user-provided business information form the factual input layer.',
  },
  {
    icon: GitBranch,
    title: 'Transparent scoring algorithms',
    description:
      'Funding readiness and compatibility logic calculate structured results from genuine inputs.',
  },
  {
    icon: BrainCircuit,
    title: 'IBM Granite intelligence',
    description:
      'Qualitative pitch analysis and contextual recommendations are generated through the integrated AI layer.',
  },
]
function IntelligenceSection() {
  return (
    <section
      id="intelligence"
      className="section-spacing relative scroll-mt-24"
    >
      <div className="section-container">
        <div
          className="
            relative overflow-hidden rounded-[2rem]
            border border-white/[0.08]
            bg-gradient-to-br from-violet-500/[0.07]
            via-white/[0.025] to-cyan-400/[0.055]
            p-6 sm:p-10 lg:p-14
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 opacity-30
              [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]
              [background-size:28px_28px]
            "
          />
          <div className="relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div
                className="
                  mb-6 flex h-14 w-14 items-center justify-center
                  rounded-2xl border border-violet-400/20
                  bg-violet-400/[0.08]
                "
              >
                <Sparkles className="h-6 w-6 text-violet-200" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
                Intelligence architecture
              </span>
              <h2
                className="
                  mt-4 text-4xl font-bold tracking-[-0.045em]
                  text-white sm:text-5xl
                "
              >
                AI where it adds value.
                <span className="text-gradient"> Logic where it matters.</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-400">
                Fundora separates deterministic scoring from qualitative AI
                analysis. Structured scores remain traceable to defined logic,
                while IBM Granite handles deeper language-based intelligence.
              </p>
              <div
                className="
                  mt-7 inline-flex items-center gap-2 rounded-full
                  border border-white/[0.08] bg-black/20
                  px-4 py-2 text-sm text-slate-300
                "
              >
                <LockKeyhole className="h-4 w-4 text-cyan-300" />
                No fabricated scores or simulated AI outputs
              </div>
            </motion.div>
            <div className="space-y-3">
              {layers.map((layer, index) => {
                const Icon = layer.icon
                return (
                  <motion.article
                    key={layer.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ x: 5 }}
                    className="
                      flex gap-4 rounded-2xl border border-white/[0.08]
                      bg-slate-950/50 p-5 backdrop-blur-xl
                      transition-colors duration-300
                      hover:border-violet-400/20
                    "
                  >
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-xl bg-gradient-to-br
                        from-violet-500/15 to-cyan-400/10
                      "
                    >
                      <Icon className="h-5 w-5 text-violet-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {layer.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-400">
                        {layer.description}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default IntelligenceSection
