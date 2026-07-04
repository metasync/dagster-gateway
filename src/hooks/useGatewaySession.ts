import { useMemo } from 'react'
import { useAuth } from 'react-oidc-context'
import type {
  DemoUserProfile,
  GatewayRegistry,
  GatewaySessionState,
} from '@/types/gateway'
import { useGatewayStore } from '@/store/gatewayStore'
import { normalizeGroups, toGatewayUserProfile } from '@/utils/gateway'

export function useDemoGatewaySession(
  registry: GatewayRegistry,
): GatewaySessionState & {
  demoUsers: DemoUserProfile[]
  signInAsDemoUser: (user: DemoUserProfile) => void
} {
  const { demoProfile, setDemoProfile } = useGatewayStore()

  return useMemo(
    () => {
      const demoUsers = registry.demoUsers ?? []

      return {
        isAuthenticated: demoProfile !== null,
        isLoading: false,
        isDemo: true,
        groups: demoProfile?.groups ?? [],
        profile: demoProfile,
        error: null,
        demoUsers,
        signIn: () => {
          if (demoUsers[0]) {
            setDemoProfile(toGatewayUserProfile(demoUsers[0]))
          }
        },
        signOut: () => setDemoProfile(null),
        signInAsDemoUser: (user: DemoUserProfile) =>
          setDemoProfile(toGatewayUserProfile(user)),
      }
    },
    [demoProfile, registry.demoUsers, setDemoProfile],
  )
}

export function useOidcGatewaySession(): GatewaySessionState {
  const auth = useAuth()

  return useMemo(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      isDemo: false,
      groups: normalizeGroups(auth.user?.profile.groups),
      profile: auth.user
        ? toGatewayUserProfile({
            sub: auth.user.profile.sub,
            preferred_username: auth.user.profile.preferred_username,
            email: auth.user.profile.email,
            name: auth.user.profile.name,
            groups: normalizeGroups(auth.user.profile.groups),
          })
        : null,
      error: auth.error?.message ?? null,
      signIn: () =>
        void auth.signinRedirect({
          state: { returnTo: '/' },
        }),
      signOut: () => {
        void auth.signoutRedirect()
      },
    }),
    [auth],
  )
}
