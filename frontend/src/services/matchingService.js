import { apiRequest } from './apiClient'

async function generateMatches() {
  return apiRequest('/matching/generate', {
    method: 'POST',
  })
}

async function getStartupMatches() {
  return apiRequest('/matching/investor/startups')
}

async function getInvestorMatches() {
  return apiRequest('/matching/founder/investors')
}

export const matchingService = {
  generateMatches,
  getStartupMatches,
  getInvestorMatches,
}