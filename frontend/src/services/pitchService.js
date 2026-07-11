import { supabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error(
    'Missing VITE_API_BASE_URL environment variable.'
  )
}

async function getAccessToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw new Error(
      error.message || 'Unable to read the current session.'
    )
  }

  if (!session?.access_token) {
    throw new Error(
      'Your session has expired. Please sign in again.'
    )
  }

  return session.access_token
}

async function parseErrorResponse(response) {
  try {
    const data = await response.json()

    if (typeof data?.detail === 'string') {
      return data.detail
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item) => item?.msg)
        .filter(Boolean)
        .join(', ')
    }

    return 'The request could not be completed.'
  } catch {
    return 'The request could not be completed.'
  }
}

async function authenticatedFetch(endpoint, options = {}) {
  const accessToken = await getAccessToken()

  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    })
  } catch {
    throw new Error(
      'Unable to connect to the Fundora AI server.'
    )
  }

  if (!response.ok) {
    const message = await parseErrorResponse(response)
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function getLatestAnalysis() {
  return authenticatedFetch('/pitch/latest')
}

async function uploadPitchDeck(file) {
  if (!file) {
    throw new Error('Please select a pitch deck to upload.')
  }

  const formData = new FormData()
  formData.append('file', file)

  return authenticatedFetch('/pitch/upload', {
    method: 'POST',
    body: formData,
  })
}

export const pitchService = {
  getLatestAnalysis,
  uploadPitchDeck,
}