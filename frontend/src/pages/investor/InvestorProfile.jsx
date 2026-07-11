import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  LoaderCircle,
  Save,
  Sparkles,
  Target,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import { investorService } from '../../services/investorService'

const INVESTOR_TYPES = [
  {
    value: 'angel',
    label: 'Angel Investor',
  },
  {
    value: 'venture_capital',
    label: 'Venture Capital',
  },
  {
    value: 'corporate_vc',
    label: 'Corporate VC',
  },
  {
    value: 'accelerator',
    label: 'Accelerator',
  },
  {
    value: 'family_office',
    label: 'Family Office',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

const STAGE_OPTIONS = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
]

const SECTOR_OPTIONS = [
  'AI & Machine Learning',
  'FinTech',
  'HealthTech',
  'EdTech',
  'ClimateTech',
  'SaaS',
  'Cybersecurity',
  'E-commerce',
  'DeepTech',
  'AgriTech',
  'Consumer',
  'Other',
]

const GEOGRAPHY_OPTIONS = [
  'India',
  'South Asia',
  'Southeast Asia',
  'United States',
  'Europe',
  'Middle East',
  'Global',
]

const EMPTY_FORM = {
  investor_name: '',
  organization_name: '',
  investor_type: 'angel',
  bio: '',
  preferred_stages: [],
  preferred_sectors: [],
  preferred_geographies: [],
  minimum_cheque_size: '',
  maximum_cheque_size: '',
  minimum_readiness_score: '0',
  requires_revenue: false,
  requires_traction: false,
}

function MultiSelect({
  label,
  description,
  options,
  selected,
  onChange,
}) {
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(
        selected.filter((current) => current !== option)
      )
      return
    }

    onChange([...selected, option])
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-200">
        {label}
      </legend>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option)

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`
                focus-ring rounded-full border px-3 py-2
                text-sm font-medium transition-colors
                ${
                  isSelected
                    ? `
                      border-violet-400/30
                      bg-violet-400/[0.12]
                      text-violet-200
                    `
                    : `
                      border-white/[0.07]
                      bg-white/[0.025]
                      text-slate-500
                      hover:bg-white/[0.05]
                      hover:text-slate-300
                    `
                }
              `}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function InvestorProfile() {
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const profile = await investorService.getProfile()

        if (!active || !profile) {
          return
        }

        setForm({
          investor_name: profile.investor_name || '',
          organization_name:
            profile.organization_name || '',
          investor_type:
            profile.investor_type || 'angel',
          bio: profile.bio || '',
          preferred_stages:
            profile.preferred_stages || [],
          preferred_sectors:
            profile.preferred_sectors || [],
          preferred_geographies:
            profile.preferred_geographies || [],
          minimum_cheque_size:
            profile.minimum_cheque_size ?? '',
          maximum_cheque_size:
            profile.maximum_cheque_size ?? '',
          minimum_readiness_score:
            profile.minimum_readiness_score ?? 0,
          requires_revenue:
            Boolean(profile.requires_revenue),
          requires_traction:
            Boolean(profile.requires_traction),
        })
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your investor profile.'
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
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setError('')
    setSuccess('')
  }

  const validateForm = () => {
    if (form.investor_name.trim().length < 2) {
      return 'Please enter your investor name.'
    }

    if (!form.preferred_stages.length) {
      return 'Select at least one preferred funding stage.'
    }

    if (!form.preferred_sectors.length) {
      return 'Select at least one preferred sector.'
    }

    if (!form.preferred_geographies.length) {
      return 'Select at least one preferred geography.'
    }

    if (
      form.minimum_cheque_size === '' ||
      form.maximum_cheque_size === ''
    ) {
      return 'Please enter your minimum and maximum cheque sizes.'
    }

    const minimumCheque = Number(form.minimum_cheque_size)
    const maximumCheque = Number(form.maximum_cheque_size)

    if (
      !Number.isFinite(minimumCheque) ||
      !Number.isFinite(maximumCheque) ||
      minimumCheque < 0 ||
      maximumCheque < 0
    ) {
      return 'Cheque sizes must be valid positive numbers.'
    }

    if (minimumCheque > maximumCheque) {
      return 'Minimum cheque size cannot exceed maximum cheque size.'
    }

    const minimumReadiness = Number(
      form.minimum_readiness_score
    )

    if (
      !Number.isFinite(minimumReadiness) ||
      minimumReadiness < 0 ||
      minimumReadiness > 100
    ) {
      return 'Minimum readiness score must be between 0 and 100.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      setSuccess('')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const savedProfile =
        await investorService.saveProfile({
          investor_name: form.investor_name.trim(),
          organization_name:
            form.organization_name.trim() || null,
          investor_type: form.investor_type,
          bio: form.bio.trim() || null,
          preferred_stages: form.preferred_stages,
          preferred_sectors: form.preferred_sectors,
          preferred_geographies:
            form.preferred_geographies,
          minimum_cheque_size: Number(
            form.minimum_cheque_size
          ),
          maximum_cheque_size: Number(
            form.maximum_cheque_size
          ),
          minimum_readiness_score: Number(
            form.minimum_readiness_score
          ),
          requires_revenue: form.requires_revenue,
          requires_traction: form.requires_traction,
        })

      setSuccess('Investor profile saved successfully.')

      if (savedProfile.is_profile_complete) {
        window.setTimeout(() => {
          navigate(ROUTES.INVESTOR.DASHBOARD)
        }, 700)
      }
    } catch (saveError) {
      setError(
        saveError?.message ||
          'We could not save your investor profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading investor profile" />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950">
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
            to={ROUTES.INVESTOR.DASHBOARD}
            className="
              focus-ring inline-flex items-center gap-2
              text-sm font-medium text-slate-400
              transition-colors hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Investor dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-300" />

            <span className="text-sm font-semibold text-slate-300">
              Fundora Intelligence
            </span>
          </div>
        </div>
      </header>

      <div className="section-container relative py-10 lg:py-14">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-5xl"
        >
          <div className="text-center">
            <div
              className="
                mx-auto flex h-16 w-16 items-center
                justify-center rounded-2xl border
                border-violet-400/20
                bg-violet-400/[0.08]
              "
            >
              <BriefcaseBusiness className="h-7 w-7 text-violet-200" />
            </div>

            <p className="mt-6 text-sm font-semibold text-violet-300">
              Investor Profile
            </p>

            <h1
              className="
                mt-2 text-4xl font-bold tracking-[-0.05em]
                text-white sm:text-5xl
              "
            >
              Define your investment thesis.
            </h1>

            <p
              className="
                mx-auto mt-5 max-w-2xl text-base
                leading-7 text-slate-400
              "
            >
              Tell Fundora what you invest in. These preferences
              become the foundation of your explainable startup
              matching score.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="
                mx-auto mt-7 flex max-w-4xl items-start gap-3
                rounded-xl border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              className="
                mx-auto mt-7 flex max-w-4xl items-start gap-3
                rounded-xl border border-emerald-400/20
                bg-emerald-400/[0.07] px-4 py-3
                text-sm text-emerald-200
              "
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              glass-panel mx-auto mt-9 max-w-4xl
              rounded-[2rem] p-7 sm:p-9
            "
          >
            <section>
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 text-violet-300" />

                <h2 className="text-xl font-bold text-white">
                  Investor identity
                </h2>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Investor name
                  </span>

                  <input
                    type="text"
                    value={form.investor_name}
                    onChange={(event) =>
                      updateField(
                        'investor_name',
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035] px-4 py-3
                      text-sm text-white outline-none
                      placeholder:text-slate-700
                    "
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Organization
                  </span>

                  <input
                    type="text"
                    value={form.organization_name}
                    onChange={(event) =>
                      updateField(
                        'organization_name',
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035] px-4 py-3
                      text-sm text-white outline-none
                      placeholder:text-slate-700
                    "
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Investor type
                  </span>

                  <select
                    value={form.investor_type}
                    onChange={(event) =>
                      updateField(
                        'investor_type',
                        event.target.value
                      )
                    }
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-slate-900 px-4 py-3
                      text-sm text-white outline-none
                    "
                  >
                    {INVESTOR_TYPES.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Minimum readiness score
                  </span>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.minimum_readiness_score}
                    onChange={(event) =>
                      updateField(
                        'minimum_readiness_score',
                        event.target.value
                      )
                    }
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035] px-4 py-3
                      text-sm text-white outline-none
                    "
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-slate-300">
                  Investment bio
                </span>

                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={(event) =>
                    updateField('bio', event.target.value)
                  }
                  placeholder="Describe your investment focus and thesis..."
                  className="
                    focus-ring mt-2 w-full resize-none
                    rounded-xl border border-white/[0.08]
                    bg-white/[0.035] px-4 py-3
                    text-sm leading-6 text-white outline-none
                    placeholder:text-slate-700
                  "
                />
              </label>
            </section>

            <div className="my-8 h-px bg-white/[0.06]" />

            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-cyan-300" />

                <h2 className="text-xl font-bold text-white">
                  Investment preferences
                </h2>
              </div>

              <MultiSelect
                label="Preferred funding stages"
                description="Choose every startup stage you actively consider."
                options={STAGE_OPTIONS}
                selected={form.preferred_stages}
                onChange={(value) =>
                  updateField('preferred_stages', value)
                }
              />

              <MultiSelect
                label="Preferred sectors"
                description="Select the industries that fit your investment thesis."
                options={SECTOR_OPTIONS}
                selected={form.preferred_sectors}
                onChange={(value) =>
                  updateField('preferred_sectors', value)
                }
              />

              <MultiSelect
                label="Preferred geographies"
                description="Choose where you are open to investing."
                options={GEOGRAPHY_OPTIONS}
                selected={form.preferred_geographies}
                onChange={(value) =>
                  updateField('preferred_geographies', value)
                }
              />
            </section>

            <div className="my-8 h-px bg-white/[0.06]" />

            <section>
              <h2 className="text-xl font-bold text-white">
                Cheque size and requirements
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Minimum cheque size
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={form.minimum_cheque_size}
                    onChange={(event) =>
                      updateField(
                        'minimum_cheque_size',
                        event.target.value
                      )
                    }
                    placeholder="Example: 100000"
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035] px-4 py-3
                      text-sm text-white outline-none
                      placeholder:text-slate-700
                    "
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-slate-300">
                    Maximum cheque size
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={form.maximum_cheque_size}
                    onChange={(event) =>
                      updateField(
                        'maximum_cheque_size',
                        event.target.value
                      )
                    }
                    placeholder="Example: 1000000"
                    className="
                      focus-ring mt-2 w-full rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.035] px-4 py-3
                      text-sm text-white outline-none
                      placeholder:text-slate-700
                    "
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <label
                  className="
                    flex cursor-pointer items-start gap-3
                    rounded-xl border border-white/[0.07]
                    bg-white/[0.025] p-4
                  "
                >
                  <input
                    type="checkbox"
                    checked={form.requires_revenue}
                    onChange={(event) =>
                      updateField(
                        'requires_revenue',
                        event.target.checked
                      )
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Revenue required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Only prioritize startups already generating
                      revenue.
                    </p>
                  </div>
                </label>

                <label
                  className="
                    flex cursor-pointer items-start gap-3
                    rounded-xl border border-white/[0.07]
                    bg-white/[0.025] p-4
                  "
                >
                  <input
                    type="checkbox"
                    checked={form.requires_traction}
                    onChange={(event) =>
                      updateField(
                        'requires_traction',
                        event.target.checked
                      )
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-300">
                      Traction required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Prioritize startups with measurable market
                      validation.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={saving}
              className="
                focus-ring mt-9 inline-flex w-full items-center
                justify-center gap-2 rounded-xl
                bg-gradient-to-r from-violet-600 to-cyan-500
                px-6 py-3.5 text-sm font-semibold text-white
                transition-opacity hover:opacity-95
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {saving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving investor profile
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save investment preferences
                </>
              )}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  )
}

export default InvestorProfile