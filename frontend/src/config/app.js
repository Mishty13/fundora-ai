export const APP_CONFIG = {
  name: 'Fundora AI',
  shortName: 'Fundora',
  tagline: 'Funding intelligence that moves startups forward.',
  description:
    'AI-powered funding readiness analysis, pitch intelligence, and explainable investor matching for startups and investors.',
  version: '1.0.0',
}

export const USER_ROLES = Object.freeze({
  FOUNDER: 'founder',
  INVESTOR: 'investor',
})

export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  AUTH_CALLBACK: '/auth/callback',

  FOUNDER: {
    DASHBOARD: '/founder/dashboard',
    STARTUP_PROFILE: '/founder/startup-profile',
    READINESS: '/founder/readiness',
    PITCH_ANALYSIS: '/founder/pitch-analysis',
    INVESTOR_MATCHES: '/founder/investor-matches',
    ROADMAP: '/founder/roadmap',
    AI_ADVISOR: '/founder/ai-advisor',
  },

  INVESTOR: {
    DASHBOARD: '/investor/dashboard',
    PROFILE: '/investor/profile',
    STARTUP_MATCHES: '/investor/startup-matches',
    INVESTOR_MATCHES: '/founder/investor-matches',
  },
})