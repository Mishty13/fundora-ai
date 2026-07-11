import { apiRequest } from './apiClient'

async function getLatestRoadmap() {
  return apiRequest('/roadmap/latest')
}

async function generateRoadmap() {
  return apiRequest('/roadmap/generate', {
    method: 'POST',
  })
}

export const roadmapService = {
  getLatestRoadmap,
  generateRoadmap,
}