import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

function PageLoader({ label = 'Loading Fundora AI' }) {
  return (
    <div
      className="
        flex min-h-screen items-center justify-center
        bg-surface-950 px-6
      "
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.08, 1],
          }}
          transition={{
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className="
            mx-auto flex h-14 w-14 items-center justify-center
            rounded-2xl bg-gradient-to-br
            from-violet-500 via-violet-600 to-cyan-500
            shadow-[0_15px_50px_rgba(124,58,237,0.3)]
          "
        >
          <Sparkles className="h-6 w-6 text-white" />
        </motion.div>

        <p className="mt-5 text-sm font-medium text-slate-400">
          {label}
        </p>
      </div>
    </div>
  )
}

export default PageLoader