import type { PropsWithChildren } from 'react'
import { AuthProvider } from 'react-oidc-context'
import type { GatewayRegistry } from '@/types/gateway'

interface GatewayAuthProviderProps extends PropsWithChildren {
  registry: GatewayRegistry
}

export function GatewayAuthProvider({
  children,
  registry,
}: GatewayAuthProviderProps) {
  const issuerBaseUrl = registry.issuer.replace(/\/$/, '')

  return (
    <AuthProvider
      authority={registry.issuer}
      client_id={registry.clientId}
      redirect_uri={`${window.location.origin}/oidc/callback`}
      post_logout_redirect_uri={registry.postLogoutRedirectUri}
      metadataSeed={{
        authorization_endpoint: `${issuerBaseUrl}/protocol/openid-connect/auth`,
        token_endpoint: `${issuerBaseUrl}/protocol/openid-connect/token`,
        userinfo_endpoint: `${issuerBaseUrl}/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${issuerBaseUrl}/protocol/openid-connect/logout`,
        jwks_uri: `${issuerBaseUrl}/protocol/openid-connect/certs`,
      }}
      response_type="code"
      scope="openid"
      automaticSilentRenew={false}
      loadUserInfo
      onSigninCallback={(user) => {
        const targetPath =
          typeof user?.state === 'object' && user?.state !== null && 'returnTo' in user.state
            ? String(user.state.returnTo)
            : '/'

        window.history.replaceState({}, document.title, targetPath)
      }}
    >
      {children}
    </AuthProvider>
  )
}
