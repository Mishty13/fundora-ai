import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Lightbulb,
  LoaderCircle,
  MapPin,
  Rocket,
  Save,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react'

import Logo from '../../components/common/Logo'
import PageLoader from '../../components/common/PageLoader'
import useAuth from '../../hooks/useAuth'
import { startupService } from '../../services/startupService'
import { ROUTES } from '../../config/app'

const STEPS = [
  {
    id: 'basics',
    title: 'Startup basics',
    shortTitle: 'Basics',
    description: 'Tell us who you are and where you operate.',
    icon: Building2,
  },
  {
    id: 'business',
    title: 'Business & market',
    shortTitle: 'Business',
    description: 'Explain the problem, solution, and market opportunity.',
    icon: Target,
  },
  {
    id: 'traction',
    title: 'Team & traction',
    shortTitle: 'Traction',
    description: 'Share your team composition and current progress.',
    icon: TrendingUp,
  },
  {
    id: 'funding',
    title: 'Funding details',
    shortTitle: 'Funding',
    description: 'Tell us about revenue, funding history, and your raise.',
    icon: CircleDollarSign,
  },
  {
    id: 'review',
    title: 'Review & submit',
    shortTitle: 'Review',
    description: 'Review your real startup information before saving.',
    icon: CheckCircle2,
  },
]

const STARTUP_STAGES = [
  { value: 'idea', label: 'Idea' },
  { value: 'pre_seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c_plus', label: 'Series C+' },
  { value: 'growth', label: 'Growth' },
]

const REVENUE_STATUSES = [
  { value: 'pre_revenue', label: 'Pre-revenue' },
  {
    value: 'revenue_generating',
    label: 'Revenue generating',
  },
]

const FUNDING_STATUSES = [
  { value: 'bootstrapped', label: 'Bootstrapped' },
  { value: 'grant_funded', label: 'Grant funded' },
  { value: 'angel_funded', label: 'Angel funded' },
  { value: 'vc_funded', label: 'VC funded' },
  { value: 'other', label: 'Other' },
]

const INITIAL_FORM_DATA = {
  name: '',
  tagline: '',
  description: '',
  industry: '',
  subIndustry: '',
  stage: '',
  foundedYear: '',
  headquartersCountry: '',
  headquartersCity: '',
  websiteUrl: '',

  targetMarket: '',
  businessModel: '',
  problemStatement: '',
  solutionStatement: '',
  competitiveAdvantage: '',

  teamSize: '',
  fullTimeFounders: '',
  tractionSummary: '',
  customerCount: '',

  revenueStatus: '',
  annualRevenueUsd: '',
  fundingStatus: '',
  totalFundingRaisedUsd: '',
  targetRaiseUsd: '',
  minimumInvestmentUsd: '',
}

const inputClassName = `
  w-full rounded-xl border border-white/[0.09]
  bg-white/[0.035] px-4 py-3 text-sm text-white
  outline-none placeholder:text-slate-600
  transition-colors
  focus:border-violet-400/40 focus:bg-white/[0.05]
`

const labelClassName =
  'mb-2 block text-sm font-medium text-slate-300'

const getCurrentYear = () => new Date().getFullYear()

const databaseToFormData = (startup) => ({
  name: startup.name ?? '',
  tagline: startup.tagline ?? '',
  description: startup.description ?? '',
  industry: startup.industry ?? '',
  subIndustry: startup.sub_industry ?? '',
  stage: startup.stage ?? '',
  foundedYear: startup.founded_year?.toString() ?? '',
  headquartersCountry: startup.headquarters_country ?? '',
  headquartersCity: startup.headquarters_city ?? '',
  websiteUrl: startup.website_url ?? '',

  targetMarket: startup.target_market ?? '',
  businessModel: startup.business_model ?? '',
  problemStatement: startup.problem_statement ?? '',
  solutionStatement: startup.solution_statement ?? '',
  competitiveAdvantage: startup.competitive_advantage ?? '',

  teamSize: startup.team_size?.toString() ?? '',
  fullTimeFounders: startup.full_time_founders?.toString() ?? '',
  tractionSummary: startup.traction_summary ?? '',
  customerCount: startup.customer_count?.toString() ?? '',

  revenueStatus: startup.revenue_status ?? '',
  annualRevenueUsd: startup.annual_revenue_usd?.toString() ?? '',
  fundingStatus: startup.funding_status ?? '',
  totalFundingRaisedUsd:
    startup.total_funding_raised_usd?.toString() ?? '',
  targetRaiseUsd: startup.target_raise_usd?.toString() ?? '',
  minimumInvestmentUsd:
    startup.minimum_investment_usd?.toString() ?? '',
})

const formatUsd = (value) => {
  if (value === '' || value === null || value === undefined) {
    return 'Not provided'
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return 'Not provided'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
  max,
  step,
  icon: Icon,
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClassName}>
        {label}
        {required && <span className="ml-1 text-violet-300">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            className="
              pointer-events-none absolute left-3.5 top-1/2
              h-4 w-4 -translate-y-1/2 text-slate-500
            "
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`${inputClassName} ${Icon ? 'pl-10' : ''}`}
        />
      </div>
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClassName}>
        {label}
        {required && <span className="ml-1 text-violet-300">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={inputClassName}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-950 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 5,
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClassName}>
        {label}
        {required && <span className="ml-1 text-violet-300">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`${inputClassName} resize-y`}
      />
    </div>
  )
}

function ReviewItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 break-words text-sm leading-6 text-slate-200">
        {value || 'Not provided'}
      </p>
    </div>
  )
}

function StartupProfile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [existingStartup, setExistingStartup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const currentStepData = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  const isEditing = Boolean(existingStartup)

  useEffect(() => {
    let active = true

    const loadStartup = async () => {
      if (!user?.id) {
        return
      }

      try {
        const startup = await startupService.getMyStartup(user.id)

        if (!active) {
          return
        }

        if (startup) {
          setExistingStartup(startup)
          setFormData(databaseToFormData(startup))
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your startup profile.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadStartup()

    return () => {
      active = false
    }
  }, [user?.id])

  const updateField = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (error) {
      setError('')
    }

    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const validateStep = (stepIndex) => {
    if (stepIndex === 0) {
      if (formData.name.trim().length < 2) {
        return 'Please enter a valid startup name.'
      }

      if (formData.description.trim().length < 20) {
        return 'Startup description must contain at least 20 characters.'
      }

      if (!formData.industry.trim()) {
        return 'Please enter your startup industry.'
      }

      if (!formData.stage) {
        return 'Please select your startup stage.'
      }

      if (!formData.headquartersCountry.trim()) {
        return 'Please enter your headquarters country.'
      }

      if (
        formData.foundedYear &&
        (
          Number(formData.foundedYear) < 1900 ||
          Number(formData.foundedYear) > getCurrentYear()
        )
      ) {
        return `Founded year must be between 1900 and ${getCurrentYear()}.`
      }
    }

    if (stepIndex === 1) {
      if (!formData.targetMarket.trim()) {
        return 'Please describe your target market.'
      }

      if (!formData.businessModel.trim()) {
        return 'Please describe your business model.'
      }

      if (!formData.problemStatement.trim()) {
        return 'Please provide the problem statement.'
      }

      if (!formData.solutionStatement.trim()) {
        return 'Please provide the solution statement.'
      }

      if (!formData.competitiveAdvantage.trim()) {
        return 'Please describe your competitive advantage.'
      }
    }

    if (stepIndex === 2) {
      const teamSize = Number(formData.teamSize)
      const fullTimeFounders = Number(formData.fullTimeFounders)

      if (!Number.isInteger(teamSize) || teamSize < 1) {
        return 'Team size must be at least 1.'
      }

      if (!Number.isInteger(fullTimeFounders) || fullTimeFounders < 1) {
        return 'Full-time founders must be at least 1.'
      }

      if (fullTimeFounders > teamSize) {
        return 'Full-time founders cannot exceed total team size.'
      }

      if (
        formData.customerCount !== '' &&
        (
          !Number.isInteger(Number(formData.customerCount)) ||
          Number(formData.customerCount) < 0
        )
      ) {
        return 'Customer count must be zero or a positive whole number.'
      }
    }

    if (stepIndex === 3) {
      if (!formData.revenueStatus) {
        return 'Please select your revenue status.'
      }

      if (
        formData.revenueStatus === 'revenue_generating' &&
        (
          formData.annualRevenueUsd === '' ||
          Number(formData.annualRevenueUsd) < 0
        )
      ) {
        return 'Please enter valid annual revenue.'
      }

      if (!formData.fundingStatus) {
        return 'Please select your funding status.'
      }

      const numericFields = [
        ['totalFundingRaisedUsd', 'Total funding raised'],
        ['targetRaiseUsd', 'Target raise'],
        ['minimumInvestmentUsd', 'Minimum investment'],
      ]

      for (const [field, label] of numericFields) {
        if (
          formData[field] !== '' &&
          (
            !Number.isFinite(Number(formData[field])) ||
            Number(formData[field]) < 0
          )
        ) {
          return `${label} must be a valid non-negative number.`
        }
      }

      if (
        formData.targetRaiseUsd !== '' &&
        Number(formData.targetRaiseUsd) <= 0
      ) {
        return 'Target raise must be greater than zero.'
      }

      if (
        formData.minimumInvestmentUsd !== '' &&
        Number(formData.minimumInvestmentUsd) <= 0
      ) {
        return 'Minimum investment must be greater than zero.'
      }

      if (
        formData.targetRaiseUsd !== '' &&
        formData.minimumInvestmentUsd !== '' &&
        Number(formData.minimumInvestmentUsd) >
          Number(formData.targetRaiseUsd)
      ) {
        return 'Minimum investment cannot exceed the target raise.'
      }
    }

    return ''
  }

  const validateAllSteps = () => {
    for (let index = 0; index < STEPS.length - 1; index += 1) {
      const validationError = validateStep(index)

      if (validationError) {
        setCurrentStep(index)
        return validationError
      }
    }

    return ''
  }

  const handleNext = () => {
    const validationError = validateStep(currentStep)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setCurrentStep((current) =>
      Math.min(current + 1, STEPS.length - 1)
    )
  }

  const handlePrevious = () => {
    setError('')
    setCurrentStep((current) => Math.max(current - 1, 0))
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('Your authenticated session is unavailable.')
      return
    }

    const validationError = validateAllSteps()

    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const savedStartup = existingStartup
        ? await startupService.updateStartup(
            existingStartup.id,
            formData
          )
        : await startupService.createStartup(user.id, formData)

      setExistingStartup(savedStartup)
      setFormData(databaseToFormData(savedStartup))
      setSuccessMessage(
        isEditing
          ? 'Your startup profile has been updated successfully.'
          : 'Your startup profile has been created successfully.'
      )
    } catch (submitError) {
      setError(
        submitError?.message ||
          'We could not save your startup profile. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const stageLabel = useMemo(
    () =>
      STARTUP_STAGES.find(
        (stage) => stage.value === formData.stage
      )?.label ?? 'Not provided',
    [formData.stage]
  )

  const revenueLabel = useMemo(
    () =>
      REVENUE_STATUSES.find(
        (status) => status.value === formData.revenueStatus
      )?.label ?? 'Not provided',
    [formData.revenueStatus]
  )

  const fundingLabel = useMemo(
    () =>
      FUNDING_STATUSES.find(
        (status) => status.value === formData.fundingStatus
      )?.label ?? 'Not provided',
    [formData.fundingStatus]
  )

  if (loading) {
    return <PageLoader label="Loading your startup profile" />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-950">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-40 top-20
          h-[30rem] w-[30rem] rounded-full
          bg-violet-500/[0.08] blur-[150px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -right-40 bottom-0
          h-[28rem] w-[28rem] rounded-full
          bg-cyan-400/[0.06] blur-[150px]
        "
      />

      <header
        className="
          relative border-b border-white/[0.06]
          bg-slate-950/60 backdrop-blur-xl
        "
      >
        <div
          className="
            section-container flex min-h-20 items-center
            justify-between gap-4
          "
        >
          <Logo />

          <button
            type="button"
            onClick={() => navigate(ROUTES.FOUNDER.DASHBOARD)}
            className="
              focus-ring inline-flex items-center gap-2
              rounded-lg px-3 py-2 text-sm font-medium
              text-slate-400 transition-colors
              hover:bg-white/[0.05] hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
        </div>
      </header>

      <div className="section-container relative py-10 lg:py-14">
        <section className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="
                inline-flex items-center gap-2 rounded-full
                border border-violet-400/20
                bg-violet-400/[0.07] px-3.5 py-2
                text-sm font-medium text-violet-200
              "
            >
              <Sparkles className="h-4 w-4 text-cyan-300" />
              {isEditing
                ? 'Your real startup profile'
                : 'Founder onboarding'}
            </div>

            <h1
              className="
                mt-5 max-w-3xl text-4xl font-bold
                tracking-[-0.05em] text-white sm:text-5xl
              "
            >
              {isEditing ? 'Manage your ' : 'Build your '}
              <span className="text-gradient">startup intelligence profile.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Your answers become the factual foundation for future readiness
              analysis, pitch intelligence, investor matching, and your
              improvement roadmap.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_1fr]">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="glass-panel rounded-2xl p-4">
                <div className="mb-5 px-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-500">
                      Profile progress
                    </span>

                    <span className="text-xs font-semibold text-violet-300">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35 }}
                      className="
                        h-full rounded-full bg-gradient-to-r
                        from-violet-500 to-cyan-400
                      "
                    />
                  </div>
                </div>

                <nav aria-label="Startup profile steps" className="space-y-1">
                  {STEPS.map((step, index) => {
                    const Icon = step.icon
                    const active = index === currentStep
                    const complete = index < currentStep

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => {
                          if (index <= currentStep) {
                            setCurrentStep(index)
                            setError('')
                          }
                        }}
                        disabled={index > currentStep}
                        className={`
                          flex w-full items-center gap-3 rounded-xl
                          px-3 py-3 text-left transition-colors
                          ${
                            active
                              ? 'bg-violet-400/[0.1] text-white'
                              : complete
                                ? 'text-slate-300 hover:bg-white/[0.04]'
                                : 'cursor-default text-slate-600'
                          }
                        `}
                      >
                        <div
                          className={`
                            flex h-9 w-9 shrink-0 items-center
                            justify-center rounded-lg border
                            ${
                              active
                                ? 'border-violet-400/30 bg-violet-400/[0.12] text-violet-200'
                                : complete
                                  ? 'border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300'
                                  : 'border-white/[0.06] bg-white/[0.025] text-slate-600'
                            }
                          `}
                        >
                          {complete ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {step.shortTitle}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-600">
                            Step {index + 1}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>

            <section className="glass-panel min-w-0 rounded-[2rem] p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl border
                    border-violet-400/20 bg-violet-400/[0.08]
                  "
                >
                  <currentStepData.icon className="h-5 w-5 text-violet-200" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                    Step {currentStep + 1} of {STEPS.length}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-[-0.035em] text-white">
                    {currentStepData.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepData.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8"
                >
                  {currentStep === 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Startup name"
                        name="name"
                        value={formData.name}
                        onChange={updateField}
                        placeholder="Your startup's legal or operating name"
                        required
                        icon={Rocket}
                      />

                      <Field
                        label="Tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={updateField}
                        placeholder="A concise description of what you do"
                        icon={Lightbulb}
                      />

                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Startup description"
                          name="description"
                          value={formData.description}
                          onChange={updateField}
                          placeholder="Describe your startup, product, customers, and current position."
                          required
                        />
                      </div>

                      <Field
                        label="Industry"
                        name="industry"
                        value={formData.industry}
                        onChange={updateField}
                        placeholder="e.g. FinTech, HealthTech, SaaS"
                        required
                        icon={BriefcaseBusiness}
                      />

                      <Field
                        label="Sub-industry"
                        name="subIndustry"
                        value={formData.subIndustry}
                        onChange={updateField}
                        placeholder="e.g. Payments, Diagnostics, CRM"
                      />

                      <SelectField
                        label="Startup stage"
                        name="stage"
                        value={formData.stage}
                        onChange={updateField}
                        options={STARTUP_STAGES}
                        placeholder="Select your current stage"
                        required
                      />

                      <Field
                        label="Founded year"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={updateField}
                        placeholder="e.g. 2025"
                        type="number"
                        min="1900"
                        max={getCurrentYear()}
                      />

                      <Field
                        label="Headquarters country"
                        name="headquartersCountry"
                        value={formData.headquartersCountry}
                        onChange={updateField}
                        placeholder="e.g. India"
                        required
                        icon={Globe2}
                      />

                      <Field
                        label="Headquarters city"
                        name="headquartersCity"
                        value={formData.headquartersCity}
                        onChange={updateField}
                        placeholder="e.g. Bengaluru"
                        icon={MapPin}
                      />

                      <div className="sm:col-span-2">
                        <Field
                          label="Website URL"
                          name="websiteUrl"
                          value={formData.websiteUrl}
                          onChange={updateField}
                          placeholder="https://yourstartup.com"
                          type="url"
                          icon={Globe2}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <TextAreaField
                        label="Problem statement"
                        name="problemStatement"
                        value={formData.problemStatement}
                        onChange={updateField}
                        placeholder="What meaningful problem are you solving, for whom, and why does it matter?"
                        required
                      />

                      <TextAreaField
                        label="Solution statement"
                        name="solutionStatement"
                        value={formData.solutionStatement}
                        onChange={updateField}
                        placeholder="How does your product or service solve that problem?"
                        required
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextAreaField
                          label="Target market"
                          name="targetMarket"
                          value={formData.targetMarket}
                          onChange={updateField}
                          placeholder="Who are your target customers and where are they located?"
                          required
                          rows={6}
                        />

                        <TextAreaField
                          label="Business model"
                          name="businessModel"
                          value={formData.businessModel}
                          onChange={updateField}
                          placeholder="How does or will the startup make money?"
                          required
                          rows={6}
                        />
                      </div>

                      <TextAreaField
                        label="Competitive advantage"
                        name="competitiveAdvantage"
                        value={formData.competitiveAdvantage}
                        onChange={updateField}
                        placeholder="What gives your startup a defensible advantage over alternatives?"
                        required
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Total team size"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={updateField}
                        placeholder="e.g. 8"
                        type="number"
                        min="1"
                        step="1"
                        required
                        icon={UsersRound}
                      />

                      <Field
                        label="Full-time founders"
                        name="fullTimeFounders"
                        value={formData.fullTimeFounders}
                        onChange={updateField}
                        placeholder="e.g. 2"
                        type="number"
                        min="1"
                        step="1"
                        required
                        icon={UsersRound}
                      />

                      <Field
                        label="Customer count"
                        name="customerCount"
                        value={formData.customerCount}
                        onChange={updateField}
                        placeholder="Leave blank if not applicable"
                        type="number"
                        min="0"
                        step="1"
                        icon={TrendingUp}
                      />

                      <div className="sm:col-span-2">
                        <TextAreaField
                          label="Traction summary"
                          name="tractionSummary"
                          value={formData.tractionSummary}
                          onChange={updateField}
                          placeholder="Share genuine traction such as users, pilots, partnerships, growth, retention, revenue milestones, or validated demand."
                          rows={6}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <SelectField
                        label="Revenue status"
                        name="revenueStatus"
                        value={formData.revenueStatus}
                        onChange={updateField}
                        options={REVENUE_STATUSES}
                        placeholder="Select revenue status"
                        required
                      />

                      {formData.revenueStatus ===
                        'revenue_generating' && (
                        <Field
                          label="Annual revenue (USD)"
                          name="annualRevenueUsd"
                          value={formData.annualRevenueUsd}
                          onChange={updateField}
                          placeholder="e.g. 100000"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          icon={BadgeDollarSign}
                        />
                      )}

                      <SelectField
                        label="Funding status"
                        name="fundingStatus"
                        value={formData.fundingStatus}
                        onChange={updateField}
                        options={FUNDING_STATUSES}
                        placeholder="Select funding status"
                        required
                      />

                      <Field
                        label="Total funding raised (USD)"
                        name="totalFundingRaisedUsd"
                        value={formData.totalFundingRaisedUsd}
                        onChange={updateField}
                        placeholder="0 if none"
                        type="number"
                        min="0"
                        step="0.01"
                        icon={CircleDollarSign}
                      />

                      <Field
                        label="Target raise (USD)"
                        name="targetRaiseUsd"
                        value={formData.targetRaiseUsd}
                        onChange={updateField}
                        placeholder="Your current target raise"
                        type="number"
                        min="0.01"
                        step="0.01"
                        icon={Target}
                      />

                      <Field
                        label="Minimum investment (USD)"
                        name="minimumInvestmentUsd"
                        value={formData.minimumInvestmentUsd}
                        onChange={updateField}
                        placeholder="Minimum ticket size, if applicable"
                        type="number"
                        min="0.01"
                        step="0.01"
                        icon={CircleDollarSign}
                      />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-7">
                      <div
                        className="
                          flex items-start gap-3 rounded-xl
                          border border-cyan-400/15
                          bg-cyan-400/[0.05] p-4
                        "
                      >
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                        <p className="text-sm leading-6 text-slate-400">
                          Review your information carefully. Future Fundora AI
                          analysis will use this factual startup profile rather
                          than invented or simulated inputs.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Startup basics
                        </h3>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <ReviewItem label="Startup" value={formData.name} />
                          <ReviewItem label="Stage" value={stageLabel} />
                          <ReviewItem
                            label="Industry"
                            value={
                              formData.subIndustry
                                ? `${formData.industry} · ${formData.subIndustry}`
                                : formData.industry
                            }
                          />
                          <ReviewItem
                            label="Headquarters"
                            value={
                              [
                                formData.headquartersCity,
                                formData.headquartersCountry,
                              ]
                                .filter(Boolean)
                                .join(', ')
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Business intelligence foundation
                        </h3>

                        <div className="mt-3 grid gap-3">
                          <ReviewItem
                            label="Problem"
                            value={formData.problemStatement}
                          />
                          <ReviewItem
                            label="Solution"
                            value={formData.solutionStatement}
                          />
                          <ReviewItem
                            label="Target market"
                            value={formData.targetMarket}
                          />
                          <ReviewItem
                            label="Business model"
                            value={formData.businessModel}
                          />
                          <ReviewItem
                            label="Competitive advantage"
                            value={formData.competitiveAdvantage}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Team, traction & funding
                        </h3>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <ReviewItem
                            label="Team size"
                            value={formData.teamSize}
                          />
                          <ReviewItem
                            label="Full-time founders"
                            value={formData.fullTimeFounders}
                          />
                          <ReviewItem
                            label="Revenue status"
                            value={revenueLabel}
                          />
                          <ReviewItem
                            label="Annual revenue"
                            value={
                              formData.revenueStatus ===
                              'revenue_generating'
                                ? formatUsd(formData.annualRevenueUsd)
                                : 'Pre-revenue'
                            }
                          />
                          <ReviewItem
                            label="Funding status"
                            value={fundingLabel}
                          />
                          <ReviewItem
                            label="Funding raised"
                            value={formatUsd(
                              formData.totalFundingRaisedUsd || 0
                            )}
                          />
                          <ReviewItem
                            label="Target raise"
                            value={formatUsd(formData.targetRaiseUsd)}
                          />
                          <ReviewItem
                            label="Minimum investment"
                            value={formatUsd(
                              formData.minimumInvestmentUsd
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && (
                <div
                  className="
                    mt-6 rounded-xl border border-rose-400/20
                    bg-rose-400/[0.07] px-4 py-3
                    text-sm leading-6 text-rose-200
                  "
                  role="alert"
                >
                  {error}
                </div>
              )}

              {successMessage && (
                <div
                  className="
                    mt-6 flex items-start gap-3 rounded-xl
                    border border-emerald-400/20
                    bg-emerald-400/[0.07] px-4 py-3
                  "
                  role="status"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />

                  <p className="text-sm leading-6 text-emerald-200">
                    {successMessage}
                  </p>
                </div>
              )}

              <div
                className="
                  mt-8 flex flex-col-reverse gap-3 border-t
                  border-white/[0.06] pt-6 sm:flex-row
                  sm:items-center sm:justify-between
                "
              >
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || submitting}
                  className="
                    focus-ring inline-flex items-center justify-center
                    gap-2 rounded-xl border border-white/[0.08]
                    bg-white/[0.035] px-5 py-3 text-sm
                    font-semibold text-slate-300 transition-colors
                    hover:bg-white/[0.06] hover:text-white
                    disabled:cursor-not-allowed disabled:opacity-30
                  "
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-gradient-to-r
                      from-violet-600 to-cyan-500
                      px-5 py-3 text-sm font-semibold text-white
                      shadow-[0_12px_40px_rgba(124,58,237,0.22)]
                      transition-opacity hover:opacity-95
                    "
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-xl bg-gradient-to-r
                      from-violet-600 to-cyan-500
                      px-5 py-3 text-sm font-semibold text-white
                      shadow-[0_12px_40px_rgba(124,58,237,0.22)]
                      transition-opacity hover:opacity-95
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Saving real startup data
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isEditing
                          ? 'Save changes'
                          : 'Create startup profile'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default StartupProfile