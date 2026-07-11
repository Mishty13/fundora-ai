import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-[0_12px_40px_rgba(124,58,237,0.28)] hover:shadow-[0_16px_50px_rgba(6,182,212,0.3)]',

  secondary:
    'border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.1]',

  ghost:
    'text-slate-300 hover:bg-white/[0.06] hover:text-white',
}

const baseClasses = `
  inline-flex items-center justify-center gap-2
  rounded-xl px-5 py-3
  text-sm font-semibold
  transition-colors duration-300
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-violet-400
  focus-visible:ring-offset-2
  focus-visible:ring-offset-slate-950
  disabled:cursor-not-allowed
  disabled:opacity-50
`

function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  to,
  ...props
}) {
  const classes = `${baseClasses} ${variants[variant]} ${className}`

  if (to) {
    return (
      <MotionLink
        to={to}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={classes}
        {...props}
      >
        {children}
      </MotionLink>
    )
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button