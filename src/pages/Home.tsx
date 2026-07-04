import { useMemo, useState } from 'react'
import { LogOut, Orbit, Shield } from 'lucide-react'
import type {
  DemoUserProfile,
  GatewayAuthMode,
  GatewayRegistry,
  GatewaySessionState,
} from '@/types/gateway'
import { AccessExplainer } from '@/components/AccessExplainer'
import { IdentityPanel } from '@/components/IdentityPanel'
import { PlatformGrid } from '@/components/PlatformGrid'
import { SignInPanel } from '@/components/SignInPanel'
import {
  filterAuthorizedPlatforms,
  isAllowedPlatformUrl,
} from '@/utils/gateway'

interface HomeProps {
  authMode: GatewayAuthMode
  demoUsers?: DemoUserProfile[]
  onDemoSelect?: (user: DemoUserProfile) => void
  registry: GatewayRegistry
  session: GatewaySessionState
}

export default function Home({
  authMode,
  demoUsers = [],
  onDemoSelect,
  registry,
  session,
}: HomeProps) {
  const [launchError, setLaunchError] = useState<string | null>(null)
  const environmentDescriptor =
    registry.environment === 'prd' ? 'production' : 'sandbox'

  const authorizedPlatforms = useMemo(
    () => filterAuthorizedPlatforms(registry.platforms, session.groups),
    [registry.platforms, session.groups],
  )

  function handleLaunch(targetUrl: string) {
    if (!isAllowedPlatformUrl(targetUrl, registry.platforms)) {
      setLaunchError('Blocked redirect target: the destination is not in the registry.')
      return
    }

    setLaunchError(null)
    window.location.assign(targetUrl)
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8 text-slate-100">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#08111f_48%,_#020617_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-300">
              <Orbit className="h-3.5 w-3.5 text-cyan-200" />
              {registry.environment} gateway / {authMode}
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] text-white md:text-7xl">
              {registry.displayName}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {registry.displayName} access starts here. This gateway keeps the
              first-stop experience simple: authenticate once, inspect the current
              groups claim, and launch only the platform routes that the registry
              explicitly allows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              Issuer pinned to {environmentDescriptor} realm
            </div>
            {session.isAuthenticated ? (
              <button
                type="button"
                onClick={session.signOut}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/30 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : null}
          </div>
        </header>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {!session.isAuthenticated ? (
              <SignInPanel
                authMode={authMode}
                demoUsers={demoUsers}
                environmentDescriptor={environmentDescriptor}
                onDemoSelect={onDemoSelect}
                session={session}
              />
            ) : null}

            <AccessExplainer environmentDescriptor={environmentDescriptor} />

            {session.isAuthenticated ? (
              <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Authorized Destinations
                    </p>
                    <h2 className="font-display text-3xl text-white">
                      Platform routes matched by your token.
                    </h2>
                  </div>
                </div>

                {launchError ? (
                  <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {launchError}
                  </p>
                ) : null}

                <div className="mt-6">
                  <PlatformGrid
                    environmentDescriptor={environmentDescriptor}
                    groups={session.groups}
                    onLaunch={handleLaunch}
                    platforms={authorizedPlatforms}
                  />
                </div>
              </section>
            ) : null}
          </div>

          <div className="space-y-6">
            <IdentityPanel
              environmentLabel={registry.displayName}
              issuer={registry.issuer}
              session={session}
            />

            <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Registry Notes
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  The current registry ships as a static config bundle. Platform
                  entries remain environment-scoped and are filtered client-side by the
                  `groups` claim.
                </p>
                <p>
                  Single-platform auto-redirect stays disabled in this first release so
                    environment rollout and group mapping remain easy to inspect.
                </p>
                <p>
                  The launch action validates the destination against the bundled
                  registry before navigating away from the gateway.
                </p>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
