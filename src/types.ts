export type SupportLevel = "Low Support Need" | "Moderate Support Need" | "High Support Need";
export type ProgressStatus = "Improving" | "Stable" | "Needs Modified Support";
export type ReviewStatus = "Pending Review" | "Approved" | "Needs Revision";
export type UserRole = "SNED Teacher" | "Reading Teacher" | "Reading Coordinator" | "School Administrator";

export interface InterventionNote {
  id: string;
  date: string;
  strategy: string;
  outcome: string;
  teacherReflection: string;
}

export interface Learner {
  id: string;
  code: string;
  gradeLevel: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  readingConcerns: string[];
  supportNeeds: SupportLevel;
  accommodations: string[];
  iepGoals: string[];
  interventionHistory: InterventionNote[];
  status: ProgressStatus;
}

export interface Assessment {
  id: string;
  learnerId: string;
  date: string;
  literalScore: number; // 0-10
  inferentialScore: number; // 0-10
  vocabularyScore: number; // 0-10
  sequencingScore: number; // 0-10
  mainIdeaScore: number; // 0-10
  totalScore: number;
  percentage: number;
  lowestDomains: string[];
  summary: string;
  notes: string;
}

export interface Observation {
  id: string;
  learnerId: string;
  date: string;
  indicators: string[];
  nlpTags: string[];
  extractedEvidence: string[];
  narrative: string;
  teacherId: string;
}

export interface Recommendation {
  id: string;
  learnerId: string;
  date: string;
  assessmentId: string;
  observationId: string;
  classifiedSupportLevel: SupportLevel;
  recommendedStrategies: string[];
  contributingFactors: string[];
  evidence: string[];
  nlpDifficultyTags: string[];
  reasoningSteps: string[];
  teacherReviewStatus: ReviewStatus;
  teacherNotes: string;
  reviewedAt?: string;
  reviewedBy?: string;
  progressStatus: ProgressStatus;
  confidence: number;
  reviewedByTeacher: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}
