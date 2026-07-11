import {
    LayoutDashboard,
    Rocket,
    Gauge,
    FileSearch,
    Users,
    Route,
    UserRound,
    Search,
  } from 'lucide-react'
  
  import { ROUTES } from './app'
  
  export const founderNavigation = [
    {
      label: 'Dashboard',
      path: ROUTES.FOUNDER.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: 'Startup Profile',
      path: ROUTES.FOUNDER.STARTUP_PROFILE,
      icon: Rocket,
    },
    {
      label: 'Funding Readiness',
      path: ROUTES.FOUNDER.READINESS,
      icon: Gauge,
    },
    {
      label: 'Pitch Analysis',
      path: ROUTES.FOUNDER.PITCH_ANALYSIS,
      icon: FileSearch,
    },
    {
      label: 'Investor Matches',
      path: ROUTES.FOUNDER.INVESTOR_MATCHES,
      icon: Users,
    },
    {
      label: 'Improvement Roadmap',
      path: ROUTES.FOUNDER.ROADMAP,
      icon: Route,
    },
  ]
  
  export const investorNavigation = [
    {
      label: 'Dashboard',
      path: ROUTES.INVESTOR.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: 'Investor Profile',
      path: ROUTES.INVESTOR.PROFILE,
      icon: UserRound,
    },
    {
      label: 'Startup Matches',
      path: ROUTES.INVESTOR.STARTUP_MATCHES,
      icon: Search,
    },
  ]