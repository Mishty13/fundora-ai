import { supabase } from '../lib/supabase'

const STARTUP_FIELDS = `
  id,
  founder_id,
  name,
  tagline,
  description,
  industry,
  sub_industry,
  stage,
  founded_year,
  headquarters_country,
  headquarters_city,
  website_url,
  team_size,
  full_time_founders,
  revenue_status,
  annual_revenue_usd,
  funding_status,
  total_funding_raised_usd,
  target_raise_usd,
  minimum_investment_usd,
  target_market,
  business_model,
  problem_statement,
  solution_statement,
  competitive_advantage,
  traction_summary,
  customer_count,
  onboarding_completed,
  created_at,
  updated_at
`

const normalizeOptionalText = (value) => {
  const normalized = value?.trim()

  return normalized || null
}

const normalizeOptionalNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : null
}

const buildStartupPayload = (startupData) => ({
  name: startupData.name.trim(),
  tagline: normalizeOptionalText(startupData.tagline),
  description: startupData.description.trim(),
  industry: startupData.industry.trim(),
  sub_industry: normalizeOptionalText(startupData.subIndustry),
  stage: startupData.stage,
  founded_year: normalizeOptionalNumber(startupData.foundedYear),
  headquarters_country: startupData.headquartersCountry.trim(),
  headquarters_city: normalizeOptionalText(
    startupData.headquartersCity
  ),
  website_url: normalizeOptionalText(startupData.websiteUrl),
  team_size: Number(startupData.teamSize),
  full_time_founders: Number(startupData.fullTimeFounders),
  revenue_status: startupData.revenueStatus,
  annual_revenue_usd:
    startupData.revenueStatus === 'pre_revenue'
      ? null
      : normalizeOptionalNumber(startupData.annualRevenueUsd),
  funding_status: startupData.fundingStatus,
  total_funding_raised_usd:
    normalizeOptionalNumber(startupData.totalFundingRaisedUsd) ?? 0,
  target_raise_usd: normalizeOptionalNumber(startupData.targetRaiseUsd),
  minimum_investment_usd: normalizeOptionalNumber(
    startupData.minimumInvestmentUsd
  ),
  target_market: startupData.targetMarket.trim(),
  business_model: startupData.businessModel.trim(),
  problem_statement: startupData.problemStatement.trim(),
  solution_statement: startupData.solutionStatement.trim(),
  competitive_advantage: startupData.competitiveAdvantage.trim(),
  traction_summary: normalizeOptionalText(startupData.tractionSummary),
  customer_count: normalizeOptionalNumber(startupData.customerCount),
})

export const startupService = {
  async getMyStartup(userId) {
    if (!userId) {
      throw new Error('An authenticated user ID is required.')
    }

    const { data, error } = await supabase
      .from('startups')
      .select(STARTUP_FIELDS)
      .eq('founder_id', userId)
      .maybeSingle()

    if (error) {
      throw error
    }

    return data
  },

  async createStartup(userId, startupData) {
    if (!userId) {
      throw new Error('An authenticated user ID is required.')
    }

    const payload = {
      founder_id: userId,
      ...buildStartupPayload(startupData),
      onboarding_completed: true,
    }

    const { data, error } = await supabase
      .from('startups')
      .insert(payload)
      .select(STARTUP_FIELDS)
      .single()

    if (error) {
      throw error
    }

    return data
  },

  async updateStartup(startupId, startupData) {
    if (!startupId) {
      throw new Error('A startup ID is required.')
    }

    const payload = buildStartupPayload(startupData)

    const { data, error } = await supabase
      .from('startups')
      .update(payload)
      .eq('id', startupId)
      .select(STARTUP_FIELDS)
      .single()

    if (error) {
      throw error
    }

    return data
  },
}