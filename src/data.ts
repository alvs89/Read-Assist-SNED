import { Learner, Assessment, Observation, Recommendation } from "./types";

export const mockLearners: Learner[] = [
  {
    id: "L-001",
    code: "RA-2026-001",
    gradeLevel: "Grade 3",
    age: 9,
    gender: "Male",
    readingConcerns: ["Vocabulary", "Inferential Comprehension"],
    supportNeeds: "High Support Need",
    accommodations: ["Visual Schedules", "Extended Time", "Read-Aloud Support"],
    iepGoals: ["Identify main characters in a simple story", "Learn 10 new sight words per week"],
    status: "Needs Modified Support",
  },
  {
    id: "L-002",
    code: "RA-2026-002",
    gradeLevel: "Grade 4",
    age: 10,
    gender: "Female",
    readingConcerns: ["Sequencing", "Main Idea"],
    supportNeeds: "Moderate Support Need",
    accommodations: ["Graphic Organizers", "Frequent Breaks"],
    iepGoals: ["Sequence 4 events from a story", "State the main idea with prompting"],
    status: "Improving",
  },
  {
    id: "L-003",
    code: "RA-2026-003",
    gradeLevel: "Grade 2",
    age: 8,
    gender: "Male",
    readingConcerns: ["Literal Comprehension"],
    supportNeeds: "Low Support Need",
    accommodations: ["Large Print", "Highlighting"],
    iepGoals: ["Answer explicit wh- questions"],
    status: "Stable",
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: "A-101",
    learnerId: "L-001",
    date: "2026-05-10",
    literalScore: 6,
    inferentialScore: 2,
    vocabularyScore: 3,
    sequencingScore: 5,
    mainIdeaScore: 4,
    totalScore: 20,
    notes: "Rushed through the inferential questions. Needed breaks."
  }
];

export const mockObservations: Observation[] = [
  {
    id: "O-101",
    learnerId: "L-001",
    date: "2026-05-11",
    indicators: ["Difficulty Understanding Vocabulary", "Difficulty Answering Inferential Questions", "Requires Frequent Prompts"],
    narrative: "The learner struggled with multi-syllabic words and required visual cues to understand the story's hidden meaning.",
    teacherId: "T-01"
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "R-101",
    learnerId: "L-001",
    date: "2026-05-12",
    assessmentId: "A-101",
    observationId: "O-101",
    classifiedSupportLevel: "High Support Need",
    recommendedStrategies: ["Vocabulary pre-teaching", "Picture-word supports", "Guided questioning", "Comprehension Monitoring Strategies"],
    contributingFactors: ["Low Inferential Comprehension Score (2/10)", "Low Vocabulary Score (3/10)"],
    evidence: ["Teacher noted 'Difficulty Understanding Vocabulary'", "Teacher noted 'Requires Frequent Prompts'"],
    confidence: 92,
    reviewedByTeacher: false
  }
];
