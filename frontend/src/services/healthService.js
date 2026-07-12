import { apiClient } from '../lib/apiClient'

export const healthService = {
  check() {
    return apiClient.get('/health')
  },
}