export type Environment = 'snd' | 'prd'
export type GatewayAuthMode = 'demo' | 'oidc'

export interface GatewayPlatform {
  id: string
  name: string
  team: string
  environment: Environment
  url: string
  requiredGroups: string[]
  description?: string
}

export interface DemoUserProfile {
  id: string
  name: string
  username: string
  email: string
  groups: string[]
}

export interface GatewayRegistry {
  environment: Environment
  displayName: string
  issuer: string
  clientId: string
  authMode?: GatewayAuthMode
  postLogoutRedirectUri: string
  platforms: GatewayPlatform[]
  demoUsers?: DemoUserProfile[]
}

export interface GatewayUserProfile {
  sub: string
  preferred_username?: string
  email?: string
  name?: string
  groups: string[]
}

export interface GatewaySessionState {
  isAuthenticated: boolean
  isLoading: boolean
  isDemo: boolean
  groups: string[]
  profile: GatewayUserProfile | null
  error: string | null
  signIn: () => void
  signOut: () => void
}
