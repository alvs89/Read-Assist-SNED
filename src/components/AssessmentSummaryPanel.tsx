import React from "react"
import { Badge } from "@/src/components/ui/badge"

type AssessmentSummaryPanelProps = {
  summary: string
  totalScore: number
  percentage: number
  lowestDomains: string[]
  compact?: boolean
}

export function AssessmentSummaryPanel({
  summary,
  totalScore,
  percentage,
  lowestDomains,
  compact = false,
}: AssessmentSummaryPanelProps) {
  const [pattern, interpretation] = splitAssessmentSummary(summary)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "md:grid-cols-3"}`}>
        <SummaryMetric label="Support Pattern" value={pattern} emphasis />
        <SummaryMetric label="Latest Score" value={`${totalScore}/50`} helper={`${percentage}% overall`} />
        <div className={compact ? "sm:col-span-2" : ""}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Priority Domains</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowestDomains.length > 0 ? (
              lowestDomains.map(domain => (
                <Badge key={domain} variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {domain}
                </Badge>
              ))
            ) : (
              <span className="text-sm font-medium text-green-700 dark:text-green-300">None flagged</span>
            )}
          </div>
        </div>
      </div>

      {interpretation && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-relaxed text-blue-950 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-100">
          <span className="font-semibold">Interpretation: </span>
          {interpretation}
        </div>
      )}
    </div>
  )
}

function SummaryMetric({ label, value, helper, emphasis = false }: { label: string; value: string; helper?: string; emphasis?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-base font-semibold leading-snug ${emphasis ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-slate-50"}`}>
        {value}
      </p>
      {helper && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{helper}</p>}
    </div>
  )
}

function splitAssessmentSummary(summary: string) {
  const [rawPattern, ...rest] = summary.split(":")
  const pattern = rawPattern?.trim() || "Assessment pattern"
  const interpretation = rest.join(":").trim()
  return [pattern, interpretation] as const
}
