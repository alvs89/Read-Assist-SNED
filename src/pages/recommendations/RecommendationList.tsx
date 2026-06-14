import React from "react"
import { useNavigate } from "react-router-dom"
import { Presentation, ChevronRight, BrainCircuit, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { useData } from "@/src/contexts/DataContext"
import { format } from "date-fns"

export function RecommendationList() {
  const navigate = useNavigate()
  const { recommendations, learners } = useData()
  const pendingCount = recommendations.filter(rec => rec.teacherReviewStatus === "Pending Review").length
  const approvedCount = recommendations.filter(rec => rec.teacherReviewStatus === "Approved").length

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/55 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative z-10">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">Intervention Recommendations</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            AI-assisted intervention plans synthesized from adapted reading assessments and teacher observations. Review, adapt, and approve plans before classroom use.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 dark:border-blue-800/70 dark:bg-blue-900/30 dark:text-blue-100">
            <ShieldCheck size={14} /> Teacher review required for every generated plan
          </p>
        </div>
        <BrainCircuit className="pointer-events-none absolute -bottom-7 -right-4 hidden h-40 w-40 text-blue-200/55 dark:text-blue-900/35 md:block" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Generated plans</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{recommendations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending teacher review</p>
            <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Approved for use</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {recommendations.length > 0 ? recommendations.map((rec) => {
          const learner = learners.find((l) => l.id === rec.learnerId)
          return (
            <Card key={rec.id} className="hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/recommendations/${rec.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500">
                      <Presentation size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50 flex flex-wrap items-center gap-2">
                        {learner?.code || "Unknown Learner"}
                        {rec.teacherReviewStatus === "Pending Review" && (
                          <Badge variant="warning" className="text-xs">Pending Review</Badge>
                        )}
                        {rec.teacherReviewStatus === "Approved" && (
                          <Badge variant="success" className="text-xs">Approved</Badge>
                        )}
                        {rec.teacherReviewStatus === "Needs Revision" && (
                          <Badge variant="destructive" className="text-xs">Needs Revision</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Generated on {format(new Date(rec.date), "MMM d, yyyy")} - Level: <span className="font-medium text-slate-700 dark:text-slate-300">{rec.classifiedSupportLevel}</span>
                      </p>
                      <div className="text-sm mt-3 text-slate-600 dark:text-slate-400">
                        <span className="font-medium text-slate-900 dark:text-slate-200">Strategies:</span> {rec.recommendedStrategies.slice(0, 2).join(", ")}
                        {rec.recommendedStrategies.length > 2 && "..."}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-blue-600"
                    aria-label={`Open recommendation for ${learner?.code || "learner"}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      navigate(`/recommendations/${rec.id}`)
                    }}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        }) : (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
             <Presentation className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
             <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50">No Recommendations Found</h3>
             <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
               Add an assessment and a teacher observation for the same learner to generate an explainable recommendation.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
