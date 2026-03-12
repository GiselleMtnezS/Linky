export default function SkeletonCard() {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-card p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2.5">
          <div className="h-3.5 bg-surface-muted rounded-full w-3/4" />
          <div className="h-3.5 bg-surface-muted rounded-full w-1/2" />
          <div className="h-3 bg-surface-muted rounded-full w-1/4 mt-3" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-7 h-7 bg-surface-muted rounded-md" />
          <div className="w-7 h-7 bg-surface-muted rounded-md" />
        </div>
      </div>
    </div>
  )
}
