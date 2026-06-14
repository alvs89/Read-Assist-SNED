import { Assessment, Learner, Observation, ProgressStatus, Recommendation, SupportLevel } from "@/src/types"

type ScoreInput = {
  literalScore: number
  inferentialScore: number
  vocabularyScore: number
  sequencingScore: number
  mainIdeaScore: number
}

const domainLabels: Record<keyof ScoreInput, string> = {
  literalScore: "Literal Comprehension",
  inferentialScore: "Inferential Comprehension",
  vocabularyScore: "Vocabulary",
  sequencingScore: "Sequencing",
  mainIdeaScore: "Main Idea",
}

const indicatorToTag: Record<string, string> = {
  "Difficulty Identifying Details": "Literal Comprehension",
  "Difficulty Understanding Vocabulary": "Vocabulary",
  "Difficulty Determining Main Idea": "Main Idea",
  "Difficulty Sequencing Events": "Sequencing",
  "Difficulty Answering Inferential Questions": "Inferential Comprehension",
  "Requires Frequent Prompts": "Prompt Dependence",
  "Attention During Reading": "Reading Attention",
}

const keywordRules: Array<{ tag: string; words: string[] }> = [
  { tag: "Vocabulary", words: ["vocabulary", "word", "meaning", "terms", "multi-syllabic", "sight word"] },
  { tag: "Literal Comprehension", words: ["detail", "who", "what", "where", "when", "explicit"] },
  { tag: "Inferential Comprehension", words: ["infer", "inference", "hidden meaning", "why", "predict", "conclude"] },
  { tag: "Sequencing", words: ["sequence", "order", "first", "next", "last", "events"] },
  { tag: "Main Idea", words: ["main idea", "central idea", "summary", "summarize", "gist"] },
  { tag: "Prompt Dependence", words: ["prompt", "cue", "remind", "assistance", "guided"] },
  { tag: "Reading Attention", words: ["attention", "focus", "distracted", "break", "fatigue"] },
]

const interventionMatrix: Record<string, string[]> = {
  "Vocabulary": ["Vocabulary pre-teaching", "Picture-word supports", "Personal word bank"],
  "Literal Comprehension": ["Guided wh-questioning", "Text highlighting for key details", "Read-and-point response prompts"],
  "Inferential Comprehension": ["Guided inferential questioning", "Think-aloud modeling", "Evidence sentence frames"],
  "Sequencing": ["Story sequencing cards", "First-next-last organizer", "Retell with visual timeline"],
  "Main Idea": ["Graphic organizer for main idea and details", "Summary frames", "Title-and-theme discussion prompts"],
  "Prompt Dependence": ["Prompt fading plan", "Choice-based response scaffolds", "Independent check-for-understanding routine"],
  "Reading Attention": ["Short reading segments with planned breaks", "Visual reading tracker", "Reduced-distraction reading setup"],
}

export function buildAssessmentSummary(scores: ScoreInput) {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + clampScore(score), 0)
  const percentage = Math.round((totalScore / 50) * 100)
  const entries = Object.entries(scores).map(([key, value]) => ({
    label: domainLabels[key as keyof ScoreInput],
    score: clampScore(value),
  }))
  const lowestDomains = entries
    .filter((entry) => entry.score <= 5)
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.label)

  let summary = "Low support pattern: scores are generally within the expected range for adapted reading tasks."
  if (percentage < 50) {
    summary = "High support pattern: total score is below 50% and needs structured reading comprehension support."
  } else if (percentage < 75 || lowestDomains.length > 0) {
    summary = "Moderate support pattern: one or more comprehension domains need targeted intervention."
  }

  return { totalScore, percentage, lowestDomains, summary }
}

export function analyzeObservation(indicators: string[], narrative: string) {
  const normalizedNarrative = narrative.toLowerCase()
  const tags = new Set<string>()
  const extractedEvidence: string[] = []

  indicators.forEach((indicator) => {
    const tag = indicatorToTag[indicator]
    if (tag) {
      tags.add(tag)
      extractedEvidence.push(`Selected indicator: ${indicator}.`)
    }
  })

  keywordRules.forEach((rule) => {
    const matchedWord = rule.words.find((word) => normalizedNarrative.includes(word))
    if (matchedWord) {
      tags.add(rule.tag)
      extractedEvidence.push(`Narrative mentions "${matchedWord}", which maps to ${rule.tag}.`)
    }
  })

  return {
    nlpTags: Array.from(tags),
    extractedEvidence: extractedEvidence.length > 0 ? extractedEvidence : ["No major difficulty keyword was extracted from the narrative."],
  }
}

export function classifySupportNeed(assessment: Assessment, observation: Observation): {
  level: SupportLevel
  confidence: number
  contributingFactors: string[]
} {
  const scoreSignals = [
    { label: "Literal Comprehension", score: assessment.literalScore },
    { label: "Inferential Comprehension", score: assessment.inferentialScore },
    { label: "Vocabulary", score: assessment.vocabularyScore },
    { label: "Sequencing", score: assessment.sequencingScore },
    { label: "Main Idea", score: assessment.mainIdeaScore },
  ]
  const lowScoreFactors = scoreSignals
    .filter((domain) => domain.score <= 5)
    .map((domain) => `Low ${domain.label} score (${domain.score}/10)`)
  const promptFactor = observation.nlpTags.includes("Prompt Dependence") ? ["Observation indicates prompt dependence."] : []
  const contributingFactors = [
    `Total adapted reading score: ${assessment.totalScore}/50 (${assessment.percentage}%).`,
    ...lowScoreFactors,
    ...promptFactor,
  ]

  const supportWeight = (50 - assessment.totalScore) + observation.nlpTags.length * 3 + promptFactor.length * 4
  if (assessment.totalScore <= 24 || supportWeight >= 34) {
    return { level: "High Support Need", confidence: Math.min(96, 78 + observation.nlpTags.length * 3), contributingFactors }
  }
  if (assessment.totalScore <= 37 || supportWeight >= 20) {
    return { level: "Moderate Support Need", confidence: Math.min(90, 70 + observation.nlpTags.length * 3), contributingFactors }
  }
  return { level: "Low Support Need", confidence: Math.max(62, 82 - observation.nlpTags.length * 2), contributingFactors }
}

export function determineProgressStatus(learnerAssessments: Assessment[], latestAssessment: Assessment): ProgressStatus {
  const ordered = [...learnerAssessments, latestAssessment]
    .filter((assessment, index, array) => array.findIndex((item) => item.id === assessment.id) === index)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const latestIndex = ordered.findIndex((assessment) => assessment.id === latestAssessment.id)
  const previous = latestIndex > 0 ? ordered[latestIndex - 1] : undefined

  if (!previous) {
    return latestAssessment.totalScore < 25 ? "Needs Modified Support" : "Stable"
  }

  const difference = latestAssessment.totalScore - previous.totalScore
  if (difference >= 5) return "Improving"
  if (difference <= -3 || latestAssessment.totalScore < 25) return "Needs Modified Support"
  return "Stable"
}

export function buildRecommendation(
  learner: Learner,
  assessment: Assessment,
  observation: Observation,
  learnerAssessments: Assessment[]
): Omit<Recommendation, "id"> {
  const classification = classifySupportNeed(assessment, observation)
  const priorityTags = observation.nlpTags.length > 0 ? observation.nlpTags : assessment.lowestDomains
  const recommendedStrategies = Array.from(
    new Set(priorityTags.flatMap((tag) => interventionMatrix[tag] || []))
  ).slice(0, 6)
  const progressStatus = determineProgressStatus(learnerAssessments, assessment)

  return {
    learnerId: learner.id,
    date: new Date().toISOString(),
    assessmentId: assessment.id,
    observationId: observation.id,
    classifiedSupportLevel: classification.level,
    recommendedStrategies: recommendedStrategies.length > 0 ? recommendedStrategies : ["Teacher-guided comprehension review"],
    contributingFactors: classification.contributingFactors,
    evidence: [
      ...observation.extractedEvidence,
      `IEP-aligned goals considered: ${learner.iepGoals.slice(0, 2).join("; ") || "No goals encoded yet."}`,
      `Accommodations considered: ${learner.accommodations.slice(0, 3).join(", ") || "No accommodations encoded yet."}`,
    ],
    nlpDifficultyTags: priorityTags,
    reasoningSteps: [
      "The latest adapted reading assessment was summarized by comprehension domain.",
      "Teacher observations were processed through keyword and selected-indicator matching.",
      "Rule-based classification combined the total score, lowest domains, and observation tags.",
      "The recommendation matrix matched difficulty tags with reading comprehension interventions.",
      "The result remains advisory and requires teacher review before classroom use.",
    ],
    teacherReviewStatus: "Pending Review",
    teacherNotes: "",
    progressStatus,
    confidence: classification.confidence,
    reviewedByTeacher: false,
  }
}

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.min(10, Math.max(0, Number(value)))
}
