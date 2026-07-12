import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileSearch,
  FileUp,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  XCircle,
} from 'lucide-react'

import PageLoader from '../../components/common/PageLoader'
import { ROUTES } from '../../config/app'
import { pitchService } from '../../services/pitchService'

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
])

const DIMENSION_CONFIG = [
  {
    key: 'problem_clarity_score',
    label: 'Problem clarity',
  },
  {
    key: 'solution_clarity_score',
    label: 'Solution clarity',
  },
  {
    key: 'market_opportunity_score',
    label: 'Market opportunity',
  },
  {
    key: 'traction_evidence_score',
    label: 'Traction evidence',
  },
  {
    key: 'business_model_score',
    label: 'Business model',
  },
  {
    key: 'team_credibility_score',
    label: 'Team credibility',
  },
  {
    key: 'funding_ask_score',
    label: 'Funding ask',
  },
]

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 KB'
  }

  const megabytes = bytes / (1024 * 1024)

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`
  }

  return `${Math.ceil(bytes / 1024)} KB`
}

function formatScore(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return '—'
  }

  return numericValue.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })
}

function ScoreBar({ label, score }) {
  const numericScore = Number(score)

  const safeScore = Number.isFinite(numericScore)
    ? Math.min(Math.max(numericScore, 0), 100)
    : 0

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">
          {label}
        </p>

        <p className="text-sm font-semibold text-white">
          {formatScore(score)}/100
        </p>
      </div>

      <div
        className="
          mt-2 h-2 overflow-hidden rounded-full
          bg-white/[0.06]
        "
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            h-full rounded-full
            bg-gradient-to-r from-violet-500 to-cyan-400
          "
        />
      </div>
    </div>
  )
}

function InsightCard({
  icon: Icon,
  title,
  items,
  emptyMessage,
}) {
  return (
    <section
      className="
        rounded-2xl border border-white/[0.07]
        bg-white/[0.025] p-6
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-violet-400/15
            bg-violet-400/[0.07]
          "
        >
          <Icon className="h-5 w-5 text-violet-200" />
        </div>

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      {items?.length ? (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <article
              key={`${title}-${index}`}
              className="
                rounded-xl border border-white/[0.06]
                bg-white/[0.02] p-4
              "
            >
              <p className="font-medium text-slate-200">
                {item.title || `Insight ${index + 1}`}
              </p>

              {item.description && (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              )}

              {item.impact && (
                <p className="mt-3 text-xs leading-5 text-amber-300/80">
                  Impact: {item.impact}
                </p>
              )}

              {item.action && (
                <p className="mt-3 text-xs leading-5 text-cyan-300/80">
                  Action: {item.action}
                </p>
              )}

              {item.priority && (
                <span
                  className="
                    mt-3 inline-flex rounded-full border
                    border-white/[0.07] bg-white/[0.035]
                    px-2.5 py-1 text-xs font-medium
                    capitalize text-slate-400
                  "
                >
                  {item.priority} priority
                </span>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-600">
          {emptyMessage}
        </p>
      )}
    </section>
  )
}

function PitchAnalysisPage() {
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadLatestAnalysis = async () => {
      try {
        const latestAnalysis =
          await pitchService.getLatestAnalysis()

        if (active) {
          setAnalysis(latestAnalysis)
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.message ||
              'We could not load your latest pitch analysis.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadLatestAnalysis()

    return () => {
      active = false
    }
  }, [])

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a pitch deck.'
    }

    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return 'Only PDF and PPTX pitch decks are supported.'
    }

    if (file.size <= 0) {
      return 'The selected file is empty.'
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'Pitch decks must not exceed 20 MB.'
    }

    return ''
  }

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0] ?? null
    const validationError = validateFile(file)

    if (validationError) {
      setSelectedFile(null)
      setError(validationError)
      return
    }

    setSelectedFile(file)
    setError('')
  }

  const handleUpload = async () => {
    const validationError = validateFile(selectedFile)

    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError('')

    try {
      const uploadedAnalysis =
        await pitchService.uploadPitchDeck(selectedFile)

      setAnalysis(uploadedAnalysis)
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (uploadError) {
      setError(
        uploadError?.message ||
          'We could not upload your pitch deck.'
      )
    } finally {
      setUploading(false)
    }
  }

  const chooseAnotherDeck = () => {
    setSelectedFile(null)
    setError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    fileInputRef.current?.click()
  }

  const renderSelectedFileUpload = () => {
    if (!selectedFile) {
      return null
    }

    return (
      <div
        className="
          mt-5 rounded-xl border
          border-violet-400/15
          bg-violet-400/[0.05] p-4
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <FileUp className="h-5 w-5 shrink-0 text-violet-200" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="
            focus-ring mt-4 inline-flex items-center
            gap-2 rounded-lg bg-violet-600
            px-4 py-2.5 text-sm font-semibold
            text-white transition-opacity
            hover:opacity-95
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {uploading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Analyzing pitch deck...
            </>
          ) : (
            <>
              <FileUp className="h-4 w-4" />
              Upload and analyze
            </>
          )}
        </button>
      </div>
    )
  }

  if (loading) {
    return <PageLoader label="Loading pitch intelligence" />
  }

  const isCompleted =
    analysis?.analysis_status === 'completed'

  const isPending =
    analysis &&
    ['pending', 'processing'].includes(
      analysis.analysis_status
    )

  const isFailed =
    analysis?.analysis_status === 'failed'

  return (
    <main
      className="
        relative min-h-screen overflow-hidden bg-surface-950
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
            to={ROUTES.FOUNDER.DASHBOARD}
            className="
              focus-ring inline-flex items-center gap-2
              text-sm font-medium text-slate-400
              transition-colors hover:text-white
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Founder dashboard
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
              <FileSearch className="h-7 w-7 text-violet-200" />
            </div>

            <p className="mt-6 text-sm font-semibold text-violet-300">
              Pitch Intelligence
            </p>

            <h1
              className="
                mt-2 text-4xl font-bold tracking-[-0.05em]
                text-white sm:text-5xl
              "
            >
              Investor-focused pitch analysis.
            </h1>

            <p
              className="
                mx-auto mt-5 max-w-2xl text-base
                leading-7 text-slate-400
              "
            >
              Fundora evaluates genuine pitch content across seven
              measurable dimensions while keeping your original
              deck privately stored.
            </p>
          </div>

          {error && (
            <div
              className="
                mx-auto mt-7 flex max-w-3xl items-start gap-3
                rounded-xl border border-rose-400/20
                bg-rose-400/[0.07] px-4 py-3
                text-sm text-rose-200
              "
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!analysis && (
            <section
              className="
                glass-panel mx-auto mt-9 max-w-3xl
                rounded-[2rem] p-7 sm:p-10
              "
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  Upload your first pitch deck
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Select a text-based PDF or PowerPoint presentation
                  under 20 MB.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.pptx"
                onChange={handleFileSelection}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  focus-ring mt-7 flex w-full flex-col
                  items-center justify-center rounded-2xl
                  border border-dashed border-white/[0.12]
                  bg-white/[0.025] px-6 py-10
                  text-center transition-colors
                  hover:border-violet-400/30
                  hover:bg-violet-400/[0.035]
                "
              >
                <UploadCloud className="h-7 w-7 text-cyan-200" />

                <p className="mt-4 font-semibold text-white">
                  Choose pitch deck
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  PDF or PPTX · Maximum 20 MB
                </p>
              </button>

              {renderSelectedFileUpload()}
            </section>
          )}

          {isPending && (
            <section
              className="
                glass-panel mx-auto mt-9 max-w-3xl
                rounded-[2rem] p-7 sm:p-9
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-12 w-12 shrink-0 items-center
                    justify-center rounded-xl border
                    border-amber-400/20 bg-amber-400/[0.07]
                  "
                >
                  <LoaderCircle className="h-5 w-5 text-amber-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-300">
                    Analysis pending
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Your pitch deck is ready for intelligence analysis.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    The deck has been securely uploaded and its
                    genuine readable content has been extracted.
                    AI analysis is being processed through Fundora's
                    intelligence pipeline.
                  </p>

                  <div
                    className="
                      mt-5 rounded-xl border border-white/[0.06]
                      bg-white/[0.025] p-4
                    "
                  >
                    <p className="truncate text-sm font-medium text-slate-300">
                      {analysis.file_name}
                    </p>

                    <div
                      className="
                        mt-3 flex flex-wrap gap-x-5 gap-y-2
                        text-xs text-slate-600
                      "
                    >
                      <span>
                        Extraction: {analysis.extraction_status}
                      </span>

                      <span>
                        Analysis: {analysis.analysis_status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={chooseAnotherDeck}
                    className="
                      focus-ring mt-5 inline-flex items-center
                      gap-2 rounded-xl border
                      border-white/[0.08] bg-white/[0.035]
                      px-4 py-2.5 text-sm font-semibold
                      text-slate-300 transition-colors
                      hover:bg-white/[0.06] hover:text-white
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                    Upload another deck
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.pptx"
                    onChange={handleFileSelection}
                    className="hidden"
                  />

                  {renderSelectedFileUpload()}
                </div>
              </div>
            </section>
          )}

          {isFailed && (
            <section
              className="
                mx-auto mt-9 max-w-3xl rounded-[2rem]
                border border-rose-400/20
                bg-rose-400/[0.05] p-7 sm:p-9
              "
            >
              <div className="flex items-start gap-4">
                <XCircle className="h-7 w-7 shrink-0 text-rose-300" />

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-white">
                    Analysis could not be completed
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {analysis.failure_reason ||
                      'The pitch analysis failed before a valid result could be produced.'}
                  </p>

                  <button
                    type="button"
                    onClick={chooseAnotherDeck}
                    className="
                      focus-ring mt-5 inline-flex items-center
                      gap-2 rounded-xl border
                      border-white/[0.08] bg-white/[0.035]
                      px-4 py-2.5 text-sm font-semibold
                      text-slate-300 transition-colors
                      hover:bg-white/[0.06] hover:text-white
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try another pitch deck
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.pptx"
                    onChange={handleFileSelection}
                    className="hidden"
                  />

                  {renderSelectedFileUpload()}
                </div>
              </div>
            </section>
          )}

          {isCompleted && (
            <>
              <section
                className="
                  glass-panel mt-9 overflow-hidden
                  rounded-[2rem] p-7 sm:p-9
                "
              >
                <div
                  className="
                    grid gap-8 lg:grid-cols-[0.65fr_1.35fr]
                  "
                >
                  <div
                    className="
                      flex flex-col items-center justify-center
                      rounded-2xl border border-violet-400/15
                      bg-violet-400/[0.05] p-7 text-center
                    "
                  >
                    <BarChart3 className="h-7 w-7 text-violet-200" />

                    <p className="mt-4 text-sm font-medium text-slate-500">
                      Overall pitch score
                    </p>

                    <p
                      className="
                        mt-2 text-6xl font-bold
                        tracking-[-0.06em] text-white
                      "
                    >
                      {formatScore(analysis.overall_score)}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      out of 100
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-violet-300">
                      Seven-dimension analysis
                    </p>

                    <h2
                      className="
                        mt-2 text-2xl font-bold
                        tracking-[-0.035em] text-white
                      "
                    >
                      Investor readiness of your pitch
                    </h2>

                    <div className="mt-6 space-y-5">
                      {DIMENSION_CONFIG.map((dimension) => (
                        <ScoreBar
                          key={dimension.key}
                          label={dimension.label}
                          score={analysis[dimension.key]}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div
                className="
                  mt-6 grid gap-5 lg:grid-cols-3
                "
              >
                <InsightCard
                  icon={CheckCircle2}
                  title="Strengths"
                  items={analysis.strengths}
                  emptyMessage="No validated strengths were returned."
                />

                <InsightCard
                  icon={Target}
                  title="Weaknesses"
                  items={analysis.weaknesses}
                  emptyMessage="No validated weaknesses were returned."
                />

                <InsightCard
                  icon={Lightbulb}
                  title="Recommendations"
                  items={analysis.recommendations}
                  emptyMessage="No recommendations were returned."
                />
              </div>

              <section
                className="
                  mx-auto mt-7 max-w-3xl rounded-2xl
                  border border-violet-400/15
                  bg-violet-400/[0.04] p-6
                "
              >
                <div
                  className="
                    flex flex-col gap-5
                    sm:flex-row sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <p className="font-semibold text-white">
                      Want to analyze another pitch?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Upload another PDF or PPTX deck to generate
                      a fresh seven-dimension investor analysis.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={chooseAnotherDeck}
                    className="
                      focus-ring inline-flex shrink-0 items-center
                      justify-center gap-2 rounded-xl
                      bg-gradient-to-r from-violet-600
                      to-cyan-500 px-5 py-3
                      text-sm font-semibold text-white
                      transition-opacity hover:opacity-95
                    "
                  >
                    <RefreshCw className="h-4 w-4" />
                    Analyze another deck
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.pptx"
                  onChange={handleFileSelection}
                  className="hidden"
                />

                {renderSelectedFileUpload()}
              </section>
            </>
          )}

          <section
            className="
              mx-auto mt-8 grid max-w-3xl gap-3
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-xl border border-white/[0.06]
                bg-white/[0.02] p-4
              "
            >
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-violet-300" />

                <p className="text-sm font-semibold text-slate-300">
                  Private storage
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Your original pitch deck remains in a private
                storage bucket rather than a public file directory.
              </p>
            </div>

            <div
              className="
                rounded-xl border border-white/[0.06]
                bg-white/[0.02] p-4
              "
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />

                <p className="text-sm font-semibold text-slate-300">
                  Validated intelligence
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Model output must pass strict backend schema
                validation before it can become a Fundora result.
              </p>
            </div>
          </section>
        </motion.section>
      </div>
    </main>
  )
}

export default PitchAnalysisPage