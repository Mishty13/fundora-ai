import { apiRequest } from './apiClient'

async function getProfile() {
  return apiRequest('/investor/profile')
}

async function saveProfile(profileData) {
  return apiRequest('/investor/profile', {
    method: 'PUT',
    body: profileData,
  })
}

export const investorService = {
  getProfile,
  saveProfile,
}