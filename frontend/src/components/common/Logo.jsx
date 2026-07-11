import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

import { APP_CONFIG, ROUTES } from '../../config/app'

function Logo({ compact = false, className = '' }) {
  return (
    <Link
      to={ROUTES.HOME}
      aria-label={`${APP_CONFIG.name} home`}
      className={`focus-ring inline-flex items-center gap-2.5 rounded-lg ${className}`}
    >
      <span
        className="
          relative flex h-10 w-10 shrink-0 items-center justify-center
          overflow-hidden rounded-xl
          bg-gradient-to-br from-violet-500 via-violet-600 to-cyan-500
          shadow-[0_10px_35px_rgba(124,58,237,0.3)]
        "
        aria-hidden="true"
      >
        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
        <span className="absolute inset-0 bg-white/10" />
      </span>

      {!compact && (
        <span className="text-lg font-bold tracking-[-0.03em] text-white">
          Fundora
          <span className="ml-1 text-gradient">AI</span>
        </span>
      )}
    </Link>
  )
}

export default Logo