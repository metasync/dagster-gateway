import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GatewayAuthProvider } from '@/auth/GatewayAuthProvider'
import { useGatewayConfig } from '@/hooks/useGatewayConfig'
import {
  useDemoGatewaySession,
  useOidcGatewaySession,
} from '@/hooks/useGatewaySession'
import type { GatewayRegistry } from '@/types/gateway'
import Home from '@/pages/Home'
import { Logout } from '@/pages/Logout'
import { OidcCallback } from '@/pages/OidcCallback'

function LoadingScreen() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <section className="w-full rounded-[32px] border border-white/10 bg-slate-950/78 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Bootstrapping
        </p>
        <h1 className="mt-3 font-display text-4xl text-white">
          Loading the gateway registry.
        </h1>
      </section>
    </main>
  )
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <section className="w-full rounded-[32px] border border-rose-400/20 bg-slate-950/78 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.28em] text-rose-300">
          Configuration error
        </p>
        <h1 className="mt-3 font-display text-4xl text-white">
          The gateway registry could not be loaded.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">{message}</p>
      </section>
    </main>
  )
}

function DemoGatewayApp({ registry }: { registry: GatewayRegistry }) {
  const session = useDemoGatewaySession(registry)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              authMode="demo"
              demoUsers={session.demoUsers}
              onDemoSelect={session.signInAsDemoUser}
              registry={registry}
              session={session}
            />
          }
        />
        <Route path="/logout" element={<Logout onLogout={session.signOut} />} />
      </Routes>
    </BrowserRouter>
  )
}

function OidcGatewayRoutes({ registry }: { registry: GatewayRegistry }) {
  const session = useOidcGatewaySession()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home authMode="oidc" registry={registry} session={session} />}
        />
        <Route path="/oidc/callback" element={<OidcCallback />} />
        <Route path="/logout" element={<Logout onLogout={session.signOut} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  const { authMode, configError, isLoading, registry } = useGatewayConfig()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!registry || configError) {
    return <ErrorScreen message={configError ?? 'Unknown registry error.'} />
  }

  if (authMode === 'oidc') {
    return (
      <GatewayAuthProvider registry={registry}>
        <OidcGatewayRoutes registry={registry} />
      </GatewayAuthProvider>
    )
  }

  return <DemoGatewayApp registry={registry} />
}
