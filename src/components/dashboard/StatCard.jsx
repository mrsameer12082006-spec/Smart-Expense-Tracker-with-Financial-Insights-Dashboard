const StatCard = ({
  label,
  value,
  hint,
  tone = 'default',
  icon: Icon,
  trend,
  progress,
  progressLabel,
}) => {
  const toneClasses = {
    default: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900',
    success: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-900/20',
    warning: 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-900/20',
    soft: 'border-indigo-100 bg-indigo-50/80 dark:border-indigo-900 dark:bg-indigo-900/20',
    amber: 'border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-900/20',
  }

  return (
    <article className={`rounded-2xl border p-4 ${toneClasses[tone] || toneClasses.default}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-1 text-3xl font-semibold leading-tight tracking-tight">{value}</h3>
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/80 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
            <Icon size={18} />
          </span>
        ) : null}
      </div>

      {trend ? (
        <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">↗ {trend}</p>
      ) : null}

      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}

      {typeof progress === 'number' ? (
        <div className="mt-2 space-y-1.5">
          {progressLabel ? (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{progressLabel}</p>
          ) : null}
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-rose-500"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      ) : null}
    </article>
  )
}

export default StatCard
