import { Fingerprint, ShieldCheck, UserRound } from 'lucide-react'
import type { GatewaySessionState } from '@/types/gateway'
import { GroupPill } from '@/components/GroupPill'

interface IdentityPanelProps {
  environmentLabel: string
  issuer: string
  session: GatewaySessionState
}

export function IdentityPanel({
  environmentLabel,
  issuer,
  session,
}: IdentityPanelProps) {
  const identityLabel =
    session.profile?.name ||
    session.profile?.preferred_username ||
    session.profile?.email ||
    'Waiting for session'

  return (
    <section className="rounded-[28px] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-100">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Session
          </p>
          <h2 className="font-display text-2xl text-white">{identityLabel}</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 text-sm text-slate-300">
        <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
          <UserRound className="mt-0.5 h-4 w-4 text-cyan-200" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Environment
            </p>
            <p className="mt-1 font-medium text-white">{environmentLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
          <Fingerprint className="mt-0.5 h-4 w-4 text-cyan-200" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Issuer
            </p>
            <p className="mt-1 break-all font-medium text-white">{issuer}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Active Groups
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {session.groups.length > 0 ? (
            session.groups.map((group) => (
              <GroupPill key={group} label={group} variant="success" />
            ))
          ) : (
            <span className="text-sm text-slate-400">
              No mapped groups are currently present in the session.
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
