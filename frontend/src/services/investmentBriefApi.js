import { supabase } from '../lib/supabase'


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/v1'


export async function generateInvestmentBrief(matchId) {
  const sessionResult = await supabase.auth.getSession()

  if (sessionResult.error) {
    throw new Error(
      'Unable to verify your login session.'
    )
  }

  const session = sessionResult.data.session

  if (!session?.access_token) {
    throw new Error(
      'Please log in to generate an AI investment brief.'
    )
  }

  const response = await fetch(
    `${API_BASE_URL}/investment-brief/${matchId}/generate`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result?.detail ||
        'Unable to generate the AI investment brief.'
    )
  }

  return result
}