const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL && import.meta.env.PROD) {
  throw new Error(
    'VITE_API_BASE_URL is required in the production environment.'
  )
}

const buildUrl = (endpoint) => {
  const baseUrl = API_BASE_URL || 'http://localhost:8000'

  return `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
}

const request = async (endpoint, options = {}) => {
  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const error = new Error(
      data?.detail || data?.message || 'Something went wrong.'
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'GET',
    })
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'DELETE',
    })
  },
}