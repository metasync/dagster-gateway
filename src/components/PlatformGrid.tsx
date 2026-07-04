import type { GatewayPlatform } from '@/types/gateway'
import { PlatformCard } from '@/components/PlatformCard'
import { resolveMatchedGroups } from '@/utils/gateway'

interface PlatformGridProps {
  environmentDescriptor: string
  groups: string[]
  onLaunch: (url: string) => void
  platforms: GatewayPlatform[]
}

export function PlatformGrid({
  environmentDescriptor,
  groups,
  onLaunch,
  platforms,
}: PlatformGridProps) {
  if (platforms.length === 0) {
    return (
      <section className="rounded-[28px] border border-dashed border-white/15 bg-white/4 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          No matched platforms
        </p>
        <h2 className="mt-3 font-display text-4xl text-white">
          Login succeeded, but no {environmentDescriptor} route matches your groups.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          The gateway only renders platforms whose required groups intersect with the
          current session. Confirm the platform registry and your Keycloak group
          membership before retrying.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      {platforms.map((platform) => (
        <PlatformCard
          key={platform.id}
          matchedGroups={resolveMatchedGroups(platform, groups)}
          onLaunch={onLaunch}
          platform={platform}
        />
      ))}
    </section>
  )
}
