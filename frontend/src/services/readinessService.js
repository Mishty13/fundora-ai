import { apiRequest } from './apiClient'

export const readinessService = {
  async createAssessment() {
    return apiRequest('/readiness/assess', {
      method: 'POST',
    })
  },

  async getLatestAssessment() {
    return apiRequest('/readiness/latest')
  },
}