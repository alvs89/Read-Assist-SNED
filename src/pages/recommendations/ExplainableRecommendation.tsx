import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShieldAlert, BookOpen, AlertCircle, ArrowLeft, BrainCircuit, CheckCircle2, ClipboardCheck, Route, PencilLine } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Textarea } from "@/src/components/ui/textarea"
import { AssessmentSummaryPanel } from "@/src/components/AssessmentSummaryPanel"
import { useData } from "@/src/contexts/DataContext"
import { useAuth } from "@/src/contexts/AuthContext"

export function ExplainableRecommendation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { learners, recommendations, assessments, observations, updateRecommendation } = useData()
  const { user } = useAuth()
  
  const rec = recommendations.find(r => r.id === id) || recommendations[0]
  const [reviewNotes, setReviewNotes] = useState("")
  
  if (!rec) {
    return (
      <div className="p-8 text-center text-slate-500">
        No recommendation found.
      </div>
    )
  }

  const learner = learners.find(l => l.id === rec.learnerId) || learners[0]
  const assessment = assessments.find(a => a.id === rec.assessmentId)
  const observation = observations.find(o => o.id === rec.observationId)

  useEffect(() => {
    setReviewNotes(rec.teacherNotes || "")
  }, [rec.id, rec.teacherNotes])

  const markReviewed = (status: "Approved" | "Needs Revision") => {
    const trimmedNotes = reviewNotes.trim()
    if (status === "Needs Revision" && !trimmedNotes) {
      toast.error("Revision note required", {
        description: "Please explain what the teacher wants to modify before marking this plan for revision.",
      })
      return
    }

    const defaultNote = status === "Approved"
      ? "Teacher approved this advisory plan for guided classroom use."
      : "Teacher marked this plan for modification before use."

    updateRecommendation(rec.id, {
      teacherReviewStatus: status,
      reviewedByTeacher: status === "Approved",
      teacherNotes: trimmedNotes || defaultNote,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.name || "Teacher"
    })

    toast.success(status === "Approved" ? "Plan approved" : "Plan marked for revision", {
      description: status === "Approved"
        ? "The recommendation is now recorded as teacher-reviewed."
        : "The revision request and teacher note were saved.",
    })
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Explainable Decision-Support</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Teacher-reviewed intervention plan for {learner.code}</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-800/60 dark:bg-blue-900/20 dark:text-blue-100">
        ReadAssist-SNED assists educators in making informed decisions. Final intervention decisions remain under teacher supervision and professional judgment.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Classification Result Panel */}
        <Card className="border-t-4 border-t-blue-600 shadow-md">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="text-blue-600 dark:text-blue-400" size={20} />
              <CardDescription className="uppercase tracking-wider font-semibold text-blue-900 dark:text-blue-300">AI Classification Result</CardDescription>
            </div>
            <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
              {rec.classifiedSupportLevel}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">System Confidence</span>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{rec.confidence}%</span>
            </div>
            {assessment && (
              <div className="mb-6 space-y-3">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Assessment Summary</p>
                <AssessmentSummaryPanel
                  summary={assessment.summary}
                  totalScore={assessment.totalScore}
                  percentage={assessment.percentage}
                  lowestDomains={assessment.lowestDomains}
                  compact
                />
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" /> Contributing Assessment Factors
                </h4>
                <ul className="space-y-2">
                  {rec.contributingFactors.map((factor, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-500" /> NLP Extracted Evidence
                </h4>
                <div className="mb-3 flex flex-wrap gap-2">
                  {rec.nlpDifficultyTags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                  {rec.evidence.map((ev, i) => (
                    <li key={i} className="pl-1">{ev}</li>
                  ))}
                </ul>
              </div>

              {observation && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Teacher Observation Narrative</h4>
                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{observation.narrative}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Panel */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-green-500 shadow-md">
             <CardHeader className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <CardDescription className="uppercase tracking-wider font-semibold text-green-800 dark:text-green-400">IEP-Aligned Strategies</CardDescription>
                <CardTitle className="text-xl text-slate-900 dark:text-slate-50">Recommended Interventions</CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
               <div className="space-y-3">
                 {rec.recommendedStrategies.map((strategy, i) => (
                   <div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 border border-green-100 dark:border-green-900/40 rounded-lg shadow-sm">
                     <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                     <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{strategy}</span>
                   </div>
                 ))}
               </div>
             </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <Route size={18} className="text-blue-600" /> Reasoning Process
              </CardTitle>
              <CardDescription>Transparent steps used to generate this advisory output.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {rec.reasoningSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className={
            rec.teacherReviewStatus === "Approved"
              ? "border-green-200 bg-green-50/60 dark:border-green-900/50 dark:bg-green-900/10"
              : rec.teacherReviewStatus === "Needs Revision"
                ? "border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-900/10"
                : "border-amber-200 bg-amber-50/70 dark:border-amber-800/50 dark:bg-amber-900/20"
          }>
            <CardHeader>
              <div className="flex items-start gap-3">
                <ShieldAlert className="text-amber-600 dark:text-amber-500 shrink-0" size={24} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base text-slate-900 dark:text-slate-50">Teacher Review</CardTitle>
                    <Badge variant={
                      rec.teacherReviewStatus === "Approved" ? "success" :
                      rec.teacherReviewStatus === "Needs Revision" ? "destructive" :
                      "warning"
                    }>
                      {rec.teacherReviewStatus}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    The recommendation is advisory only. AI assists teachers, but educators make final decisions based on professional judgment.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="reviewNotes" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Teacher Review Notes
                </label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                  placeholder="Add approval notes or explain what needs to be modified before this plan is used."
                  className="min-h-[105px] bg-white dark:bg-slate-950"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Required when marking a plan for modification.
                </p>
              </div>

              {(rec.reviewedAt || rec.reviewedBy || rec.teacherNotes) && (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                    <PencilLine size={15} /> Saved Review Record
                  </div>
                  {rec.teacherNotes && <p className="mt-2 text-slate-700 dark:text-slate-300">{rec.teacherNotes}</p>}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {rec.reviewedBy && `Reviewed by ${rec.reviewedBy}`}
                    {rec.reviewedAt && ` on ${new Date(rec.reviewedAt).toLocaleString()}`}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => markReviewed("Approved")}>
                  <ClipboardCheck size={16} className="mr-2" /> Approve Plan
                </Button>
                <Button variant="outline" className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => markReviewed("Needs Revision")}>
                  <PencilLine size={16} className="mr-2" /> Modify Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
