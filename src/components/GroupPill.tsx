import { cn } from '@/lib/utils'

interface GroupPillProps {
  label: string
  variant?: 'neutral' | 'success'
}

export function GroupPill({
  label,
  variant = 'neutral',
}: GroupPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]',
        variant === 'success'
          ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-100'
          : 'border-white/15 bg-white/5 text-slate-200',
      )}
    >
      {label}
    </span>
  )
}
