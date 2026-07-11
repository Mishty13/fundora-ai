import { useEffect, useState } from 'react'
import { CheckCircle2, LoaderCircle, Server, XCircle } from 'lucide-react'

import { healthService } from '../../services/healthService'

const STATUS = Object.freeze({
  CHECKING: 'checking',
  ONLINE: 'online',
  OFFLINE: 'offline',
})

function BackendStatus() {
  const [status, setStatus] = useState(STATUS.CHECKING)

  useEffect(() => {
    let active = true

    const checkBackend = async () => {
      try {
        await healthService.check()

        if (active) {
          setStatus(STATUS.ONLINE)
        }
      } catch {
        if (active) {
          setStatus(STATUS.OFFLINE)
        }
      }
    }

    checkBackend()

    return () => {
      active = false
    }
  }, [])

  const statusConfig = {
    [STATUS.CHECKING]: {
      icon: LoaderCircle,
      label: 'Checking platform status',
      className: 'text-slate-400',
      iconClassName: 'animate-spin text-slate-400',
    },
    [STATUS.ONLINE]: {
      icon: CheckCircle2,
      label: 'Platform operational',
      className: 'text-emerald-300',
      iconClassName: 'text-emerald-400',
    },
    [STATUS.OFFLINE]: {
      icon: XCircle,
      label: 'Platform unavailable',
      className: 'text-rose-300',
      iconClassName: 'text-rose-400',
    },
  }

  const currentStatus = statusConfig[status]
  const StatusIcon = currentStatus.icon

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full
        border border-white/[0.08] bg-white/[0.035]
        px-3 py-1.5 text-xs font-medium
        ${currentStatus.className}
      `}
      role="status"
      aria-live="polite"
    >
      <Server className="h-3.5 w-3.5 text-slate-500" />
      <StatusIcon className={`h-3.5 w-3.5 ${currentStatus.iconClassName}`} />
      <span>{currentStatus.label}</span>
    </div>
  )
}

export default BackendStatus