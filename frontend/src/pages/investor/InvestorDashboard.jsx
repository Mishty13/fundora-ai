import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Compass,
  Globe2,
  LogOut,
  Pencil,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import  useAuth  from '../../hooks/useAuth'
import { investorService } from '../../services/investorService'

const INVESTOR_TYPE_LABELS = {
  angel: 'Angel Investor',
  venture_capital: 'Venture Capital',
  corporate_vc: 'Corporate VC',
  accelerator: 'Accelerator',
  family_office: 'Family Office',
  other: 'Other',
}

function formatCurrency(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not set'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

function PreferenceTags({ items, emptyLabel }) {
  if (!items?.length) {
    return (
      <p className="text-sm text-slate-600">
        {emptyLabel}
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="
            rounded-full border border-violet-400/15
            bg-violet-400/[0.06] px-3 py-1.5
            text-xs font-medium text-violet-200
          "
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function InvestorDashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const investorProfile =
          await investorService.getProfile()

        if (!active) {
          return
        }

        if (!investorProfile) {
          navigate(ROUTES.INVESTOR.PROFILE, {
            replace: true,
          })
          return
        }

        setProfile(investorProfile)
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your investor dashboard.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [navigate])

  const handleSignOut = async () => {
    setSigningOut(true)
    setError('')

    try {
      await signOut()
      navigate(ROUTES.HOME, {
        replace: true,
      })
    } catch (signOutError) {
      setError(
        signOutError?.message ||
          'We could not sign you out.'
      )
      setSigningOut(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading investor dashboard" />
  }

  if (!profile) {
    return null
  }

  return (
    <main
      className="
        relative min-h-screen overflow-hidden
        bg-surface-950
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-40 top-20
          h-[30rem] w-[30rem] rounded-full
          bg-violet-500/[0.07] blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 bottom-0
          h-[28rem] w-[28rem] rounded-full
          bg-cyan-400/[0.05] blur-[150px]
        "
      />

      <header
        className="
          relative z-20 border-b border-white/[0.06]
          bg-slate-950/70 backdrop-blur-xl
        "
      >
        <div
          className="
            section-container flex min-h-20
            items-center justify-between gap-4
          "
        >
          <Link
            to={ROUTES.HOME}
            className="
              focus-ring flex items-center gap-2
              text-lg font-bold text-white
            "
          >
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl border border-violet-400/20
                bg-violet-400/[0.08]
              "
            >
              <Sparkles
                className="h-4 w-4 text-violet-300"
              />
            </div>

            Fundora AI
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.INVESTOR.PROFILE}
              className="
                focus-ring hidden items-center gap-2
                rounded-xl border border-white/[0.08]
                bg-white/[0.035] px-4 py-2.5
                text-sm font-semibold text-slate-300
                transition-colors hover:bg-white/[0.06]
                hover:text-white sm:inline-flex
              "
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="
                focus-ring inline-flex items-center gap-2
                rounded-xl border border-white/[0.08]
                bg-white/[0.035] px-4 py-2.5
                text-sm font-semibold text-slate-400
                transition-colors hover:bg-white/[0.06]
                hover:text-white disabled:opacity-60
              "
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? 'Signing out' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <div
        className="
          section-container relative py-10 lg:py-14
        "
      >
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {error && (
            <div
              role="alert"
              className="
                mb-7 flex items-start gap-3 rounded-xl
                border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
            >
              <AlertCircle
                className="
                  mt-0.5 h-4 w-4 shrink-0
                "
              />
              <span>{error}</span>
            </div>
          )}

          <div
            className="
              flex flex-col gap-6 lg:flex-row
              lg:items-end lg:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex items-center gap-2
                  rounded-full border
                  border-violet-400/15
                  bg-violet-400/[0.06]
                  px-3 py-1.5
                "
              >
                <BriefcaseBusiness
                  className="
                    h-3.5 w-3.5 text-violet-300
                  "
                />

                <span
                  className="
                    text-xs font-semibold
                    text-violet-200
                  "
                >
                  Investor workspace
                </span>
              </div>

              <h1
                className="
                  mt-5 text-4xl font-bold
                  tracking-[-0.05em] text-white
                  sm:text-5xl
                "
              >
                Welcome, {profile.investor_name}.
              </h1>

              <p
                className="
                  mt-4 max-w-2xl text-base
                  leading-7 text-slate-400
                "
              >
                Review your investment thesis and prepare
                to discover startups ranked against your
                genuine preferences.
              </p>
            </div>

            <Link
              to={ROUTES.INVESTOR.PROFILE}
              className="
                focus-ring inline-flex items-center
                justify-center gap-2 rounded-xl
                border border-white/[0.08]
                bg-white/[0.04] px-5 py-3
                text-sm font-semibold text-slate-300
                transition-colors hover:bg-white/[0.07]
                hover:text-white sm:hidden
              "
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Link>
          </div>

          <section
            className="
              mt-9 grid gap-4 sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <div
              className="
                glass-panel rounded-2xl p-5
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-xl
                  border border-violet-400/15
                  bg-violet-400/[0.07]
                "
              >
                <UserRound
                  className="
                    h-4 w-4 text-violet-300
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-xs font-medium
                  text-slate-600
                "
              >
                Investor type
              </p>

              <p
                className="
                  mt-1 text-lg font-bold text-white
                "
              >
                {INVESTOR_TYPE_LABELS[
                  profile.investor_type
                ] || profile.investor_type}
              </p>
            </div>

            <div
              className="
                glass-panel rounded-2xl p-5
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-xl
                  border border-cyan-400/15
                  bg-cyan-400/[0.06]
                "
              >
                <Target
                  className="
                    h-4 w-4 text-cyan-300
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-xs font-medium
                  text-slate-600
                "
              >
                Preferred sectors
              </p>

              <p
                className="
                  mt-1 text-2xl font-bold text-white
                "
              >
                {profile.preferred_sectors?.length || 0}
              </p>
            </div>

            <div
              className="
                glass-panel rounded-2xl p-5
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-xl
                  border border-emerald-400/15
                  bg-emerald-400/[0.06]
                "
              >
                <CircleDollarSign
                  className="
                    h-4 w-4 text-emerald-300
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-xs font-medium
                  text-slate-600
                "
              >
                Maximum cheque
              </p>

              <p
                className="
                  mt-1 text-lg font-bold text-white
                "
              >
                {formatCurrency(
                  profile.maximum_cheque_size
                )}
              </p>
            </div>

            <div
              className="
                glass-panel rounded-2xl p-5
              "
            >
              <div
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-xl
                  border border-amber-400/15
                  bg-amber-400/[0.06]
                "
              >
                <TrendingUp
                  className="
                    h-4 w-4 text-amber-300
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-xs font-medium
                  text-slate-600
                "
              >
                Minimum readiness
              </p>

              <p
                className="
                  mt-1 text-2xl font-bold text-white
                "
              >
                {Number(
                  profile.minimum_readiness_score
                ).toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
                /100
              </p>
            </div>
          </section>

          <div
            className="
              mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]
            "
          >
            <section
              className="
                glass-panel rounded-[2rem] p-7 sm:p-8
              "
            >
              <div
                className="
                  flex items-start justify-between gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-sm font-semibold
                      text-violet-300
                    "
                  >
                    Investment thesis
                  </p>

                  <h2
                    className="
                      mt-2 text-2xl font-bold
                      tracking-[-0.035em] text-white
                    "
                  >
                    Your matching preferences
                  </h2>
                </div>

                <Compass
                  className="
                    h-5 w-5 text-slate-600
                  "
                />
              </div>

              <div className="mt-7 space-y-7">
                <div>
                  <div
                    className="
                      mb-3 flex items-center gap-2
                    "
                  >
                    <Target
                      className="
                        h-4 w-4 text-violet-300
                      "
                    />

                    <p
                      className="
                        text-sm font-semibold
                        text-slate-300
                      "
                    >
                      Sectors
                    </p>
                  </div>

                  <PreferenceTags
                    items={profile.preferred_sectors}
                    emptyLabel="No sectors selected."
                  />
                </div>

                <div>
                  <div
                    className="
                      mb-3 flex items-center gap-2
                    "
                  >
                    <Rocket
                      className="
                        h-4 w-4 text-cyan-300
                      "
                    />

                    <p
                      className="
                        text-sm font-semibold
                        text-slate-300
                      "
                    >
                      Startup stages
                    </p>
                  </div>

                  <PreferenceTags
                    items={profile.preferred_stages}
                    emptyLabel="No stages selected."
                  />
                </div>

                <div>
                  <div
                    className="
                      mb-3 flex items-center gap-2
                    "
                  >
                    <Globe2
                      className="
                        h-4 w-4 text-emerald-300
                      "
                    />

                    <p
                      className="
                        text-sm font-semibold
                        text-slate-300
                      "
                    >
                      Geographies
                    </p>
                  </div>

                  <PreferenceTags
                    items={
                      profile.preferred_geographies
                    }
                    emptyLabel="No geographies selected."
                  />
                </div>
              </div>
            </section>

            <section
              className="
                glass-panel rounded-[2rem] p-7 sm:p-8
              "
            >
              <div
                className="
                  flex h-12 w-12 items-center
                  justify-center rounded-2xl
                  border border-cyan-400/15
                  bg-cyan-400/[0.06]
                "
              >
                <Building2
                  className="
                    h-5 w-5 text-cyan-300
                  "
                />
              </div>

              <p
                className="
                  mt-6 text-sm font-semibold
                  text-cyan-300
                "
              >
                Startup discovery
              </p>

              <h2
                className="
                  mt-2 text-2xl font-bold
                  tracking-[-0.035em] text-white
                "
              >
                Explainable matches are coming next.
              </h2>

              <p
                className="
                  mt-4 text-sm leading-6 text-slate-500
                "
              >
                Fundora will rank eligible startups using
                your real sector, stage, geography, cheque
                size, readiness and traction preferences.
                Every score will include transparent reasons.
              </p>

              <div
                className="
                  mt-6 rounded-xl border
                  border-white/[0.07]
                  bg-white/[0.025] p-4
                "
              >
                <p
                  className="
                    text-xs font-semibold uppercase
                    tracking-[0.16em] text-slate-600
                  "
                >
                  Current status
                </p>

                <p
                  className="
                    mt-2 text-sm font-medium
                    text-slate-300
                  "
                >
                  Matching engine not generated yet
                </p>
              </div>

             <Link
              to={ROUTES.INVESTOR.STARTUP_MATCHES}
              className="
                focus-ring mt-6 inline-flex w-full
                items-center justify-center gap-2
                rounded-xl bg-gradient-to-r
                from-violet-600 to-cyan-500
                px-5 py-3 text-sm font-semibold
                text-white transition-opacity
                hover:opacity-95
              "
           >
              View startup matches
              <ArrowRight className="h-4 w-4" />
            </Link>
            </section>
          </div>

          {(profile.organization_name || profile.bio) && (
            <section
              className="
                glass-panel mt-6 rounded-[2rem]
                p-7 sm:p-8
              "
            >
              <p
                className="
                  text-sm font-semibold text-violet-300
                "
              >
                Investor overview
              </p>

              {profile.organization_name && (
                <div
                  className="
                    mt-4 flex items-center gap-2
                  "
                >
                  <Building2
                    className="
                      h-4 w-4 text-slate-500
                    "
                  />

                  <p
                    className="
                      font-semibold text-slate-300
                    "
                  >
                    {profile.organization_name}
                  </p>
                </div>
              )}

              {profile.bio && (
                <p
                  className="
                    mt-4 max-w-3xl text-sm
                    leading-7 text-slate-500
                  "
                >
                  {profile.bio}
                </p>
              )}
            </section>
          )}
        </motion.section>
      </div>
    </main>
  )
}

export default InvestorDashboard