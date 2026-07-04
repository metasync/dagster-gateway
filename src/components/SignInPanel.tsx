import { ArrowRight, FlaskConical, ShieldEllipsis } from 'lucide-react'
import type { DemoUserProfile, GatewaySessionState } from '@/types/gateway'

interface SignInPanelProps {
  authMode: 'demo' | 'oidc'
  demoUsers?: DemoUserProfile[]
  environmentDescriptor: string
  onDemoSelect?: (user: DemoUserProfile) => void
  session: GatewaySessionState
}

export function SignInPanel({
  authMode,
  demoUsers = [],
  environmentDescriptor,
  onDemoSelect,
  session,
}: SignInPanelProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/78 p-8 shadow-2xl shadow-slate-950/40">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-100">
          {authMode === 'demo' ? (
            <FlaskConical className="h-5 w-5" />
          ) : (
            <ShieldEllipsis className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {authMode === 'demo' ? 'Local preview mode' : 'OIDC sign-in'}
          </p>
          <h2 className="font-display text-3xl text-white">
            {authMode === 'demo'
              ? 'Preview the group-filtered gateway locally.'
              : `Use the ${environmentDescriptor} realm to open your allowed Dagster routes.`}
          </h2>
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
        {authMode === 'demo'
          ? 'The local preview keeps the same platform filtering and redirect safety rules, but uses seeded demo identities so the interface can be exercised before the real gateway client is bootstrapped.'
          : `The gateway trusts only the ${environmentDescriptor} issuer and derives visibility from the token groups claim. No platform is shown unless a registry rule matches the current session.`}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={session.signIn}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/50 hover:bg-cyan-300/25"
        >
          {authMode === 'demo' ? 'Use first demo user' : 'Sign in with Keycloak'}
          <ArrowRight className="h-4 w-4" />
        </button>
        {session.error ? (
          <p className="self-center text-sm text-rose-300">{session.error}</p>
        ) : null}
      </div>

      {authMode === 'demo' && demoUsers.length > 0 && onDemoSelect ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {demoUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => onDemoSelect(user)}
              className="rounded-3xl border border-white/10 bg-white/4 p-4 text-left transition hover:border-cyan-300/30 hover:bg-white/8"
            >
              <p className="font-medium text-white">{user.name}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
                {user.groups.join(' · ') || 'No groups'}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
