import { ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { GatewayPlatform } from '@/types/gateway'
import { GroupPill } from '@/components/GroupPill'

interface PlatformCardProps {
  matchedGroups: string[]
  onLaunch: (url: string) => void
  platform: GatewayPlatform
}

export function PlatformCard({
  matchedGroups,
  onLaunch,
  platform,
}: PlatformCardProps) {
  const host = new URL(platform.url).host

  return (
    <article className="group rounded-[28px] border border-white/10 bg-slate-950/72 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-slate-950/80">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {platform.environment} / {platform.team}
          </p>
          <h3 className="mt-2 font-display text-3xl text-white">{platform.name}</h3>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-100">
          Ready
        </div>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-300">
        {platform.description ?? 'Authorized Dagster platform route.'}
      </p>

      <div className="mt-5 rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <ShieldCheck className="h-4 w-4 text-cyan-200" />
          Matched group gates
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {matchedGroups.map((group) => (
            <GroupPill key={group} label={group} variant="success" />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <ShieldAlert className="h-4 w-4 text-cyan-200" />
          Allowlisted destination
        </div>
        <p className="mt-2 break-all text-sm text-slate-300">{host}</p>
      </div>

      <button
        type="button"
        onClick={() => onLaunch(platform.url)}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/12 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/50 hover:bg-cyan-300/20"
      >
        Open platform
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  )
}
