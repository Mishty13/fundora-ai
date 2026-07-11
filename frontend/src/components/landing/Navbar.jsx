import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Logo from '../common/Logo'
import Button from '../common/Button'
import { ROUTES } from '../../config/app'
const navigation = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For founders', href: '#founders' },
  { label: 'For investors', href: '#investors' },
  { label: 'Intelligence', href: '#intelligence' },
]
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="
          mx-auto flex max-w-7xl items-center justify-between
          rounded-2xl border border-white/[0.08]
          bg-slate-950/70 px-4 py-3
          shadow-[0_20px_70px_rgba(0,0,0,0.28)]
          backdrop-blur-2xl sm:px-5
        "
        aria-label="Primary navigation"
      >
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="
                rounded-lg px-4 py-2 text-sm font-medium text-slate-400
                transition-colors duration-200
                hover:bg-white/[0.05] hover:text-white
                focus-ring
              "
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button to={ROUTES.LOGIN} variant="ghost" className="px-4 py-2.5">
            Log in
          </Button>
          <Button to={ROUTES.SIGNUP} className="px-4 py-2.5">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="
            focus-ring rounded-lg p-2 text-slate-300
            transition-colors hover:bg-white/[0.06] hover:text-white
            sm:hidden
          "
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="
              mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl
              border border-white/[0.08] bg-slate-950/95 p-3
              shadow-2xl backdrop-blur-2xl sm:hidden
            "
          >
            <div className="flex flex-col">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="
                    rounded-xl px-4 py-3 text-sm font-medium text-slate-300
                    transition-colors hover:bg-white/[0.06] hover:text-white
                  "
                >
                  {item.label}
                </a>
              ))}
              <div className="my-2 h-px bg-white/[0.08]" />
              <Button
                to={ROUTES.LOGIN}
                variant="secondary"
                className="mb-2 w-full"
              >
                Log in
              </Button>
              <Button to={ROUTES.SIGNUP} className="w-full">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
export default Navbar
