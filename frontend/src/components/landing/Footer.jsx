import Logo from '../common/Logo'
import BackendStatus from '../common/BackendStatus'
import { APP_CONFIG } from '../../config/app'
const productLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For founders', href: '#founders' },
  { label: 'For investors', href: '#investors' },
  { label: 'Intelligence', href: '#intelligence' },
]
function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.07]">
      <div
        className="
          section-container flex flex-col gap-8 py-10
          md:flex-row md:items-center md:justify-between
        "
      >
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            {APP_CONFIG.description}
          </p>
          <div className="mt-4">
             <BackendStatus />
          </div>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-3"
          aria-label="Footer navigation"
        >
          {productLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                text-sm text-slate-500 transition-colors
                hover:text-slate-200
              "
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/[0.05]">
        <div
          className="
            section-container flex flex-col gap-2 py-5
            text-xs text-slate-600 sm:flex-row
            sm:items-center sm:justify-between
          "
        >
          <p>
            © {currentYear} {APP_CONFIG.name}. All rights reserved.
          </p>
          <p>
            Built for transparent, explainable funding intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
