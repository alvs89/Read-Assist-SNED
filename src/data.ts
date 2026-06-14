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
    interventionHistory: [
      {
        id: "IH-001",
        date: "2026-05-13",
        strategy: "Vocabulary pre-teaching with picture-word support",
        outcome: "Learner identified 6 of 10 target words with visual cues.",
        teacherReflection: "Continue visual vocabulary support before inferential questions."
      }
    ],
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
    interventionHistory: [
      {
        id: "IH-002",
        date: "2026-05-15",
        strategy: "Story sequencing cards",
        outcome: "Learner sequenced 3 of 4 events with one verbal prompt.",
        teacherReflection: "Increase independent sequencing practice next session."
      }
    ],
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
    interventionHistory: [],
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
    percentage: 40,
    lowestDomains: ["Inferential Comprehension", "Vocabulary", "Main Idea"],
    summary: "High support pattern: total score is below 50% with difficulty in inferential comprehension and vocabulary.",
    notes: "Rushed through the inferential questions. Needed breaks."
  },
  {
    id: "A-102",
    learnerId: "L-002",
    date: "2026-05-16",
    literalScore: 7,
    inferentialScore: 6,
    vocabularyScore: 6,
    sequencingScore: 4,
    mainIdeaScore: 5,
    totalScore: 28,
    percentage: 56,
    lowestDomains: ["Sequencing", "Main Idea"],
    summary: "Moderate support pattern: sequencing and main idea tasks need targeted intervention.",
    notes: "Learner understood explicit details but needed prompts to order events and state the central idea."
  },
  {
    id: "A-103",
    learnerId: "L-003",
    date: "2026-05-18",
    literalScore: 8,
    inferentialScore: 7,
    vocabularyScore: 7,
    sequencingScore: 8,
    mainIdeaScore: 7,
    totalScore: 37,
    percentage: 74,
    lowestDomains: [],
    summary: "Low support pattern: scores are generally within the expected range, with light reinforcement recommended.",
    notes: "Learner answered most explicit questions independently and benefited from highlighted text."
  }
];

export const mockObservations: Observation[] = [
  {
    id: "O-101",
    learnerId: "L-001",
    date: "2026-05-11",
    indicators: ["Difficulty Understanding Vocabulary", "Difficulty Answering Inferential Questions", "Requires Frequent Prompts"],
    nlpTags: ["Vocabulary", "Inferential Comprehension", "Prompt Dependence"],
    extractedEvidence: [
      "Observation includes vocabulary difficulty.",
      "Observation includes inferential question difficulty.",
      "Observation includes repeated prompting."
    ],
    narrative: "The learner struggled with multi-syllabic words and required visual cues to understand the story's hidden meaning.",
    teacherId: "T-01"
  },
  {
    id: "O-102",
    learnerId: "L-002",
    date: "2026-05-17",
    indicators: ["Difficulty Sequencing Events", "Difficulty Determining Main Idea", "Requires Frequent Prompts"],
    nlpTags: ["Sequencing", "Main Idea", "Prompt Dependence"],
    extractedEvidence: [
      "Selected indicator: Difficulty Sequencing Events.",
      "Selected indicator: Difficulty Determining Main Idea.",
      "Selected indicator: Requires Frequent Prompts."
    ],
    narrative: "The learner can recall characters and setting but needs prompts to sequence events and summarize the main idea.",
    teacherId: "T-01"
  },
  {
    id: "O-103",
    learnerId: "L-003",
    date: "2026-05-19",
    indicators: ["Difficulty Identifying Details"],
    nlpTags: ["Literal Comprehension"],
    extractedEvidence: [
      "Selected indicator: Difficulty Identifying Details.",
      "Narrative mentions explicit details, which maps to Literal Comprehension."
    ],
    narrative: "The learner answers explicit wh- questions with highlighting and occasional detail prompts.",
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
    nlpDifficultyTags: ["Vocabulary", "Inferential Comprehension", "Prompt Dependence"],
    reasoningSteps: [
      "Assessment total score is 20/50, indicating substantial comprehension difficulty.",
      "Lowest domains are inferential comprehension, vocabulary, and main idea.",
      "Teacher observation confirms vocabulary difficulty and frequent prompts.",
      "The system recommends high-structure interventions for teacher review."
    ],
    teacherReviewStatus: "Pending Review",
    teacherNotes: "",
    progressStatus: "Needs Modified Support",
    confidence: 92,
    reviewedByTeacher: false
  },
  {
    id: "R-102",
    learnerId: "L-002",
    date: "2026-05-18",
    assessmentId: "A-102",
    observationId: "O-102",
    classifiedSupportLevel: "Moderate Support Need",
    recommendedStrategies: ["Story sequencing cards", "First-next-last organizer", "Graphic organizer for main idea and details", "Summary frames", "Prompt fading plan"],
    contributingFactors: ["Total adapted reading score: 28/50 (56%).", "Low Sequencing score (4/10)", "Low Main Idea score (5/10)", "Observation indicates prompt dependence."],
    evidence: [
      "Selected indicator: Difficulty Sequencing Events.",
      "Selected indicator: Difficulty Determining Main Idea.",
      "IEP-aligned goal considered: Sequence 4 events from a story."
    ],
    nlpDifficultyTags: ["Sequencing", "Main Idea", "Prompt Dependence"],
    reasoningSteps: [
      "The latest adapted reading assessment was summarized by comprehension domain.",
      "Teacher observation confirmed sequencing and main idea difficulty.",
      "Rule-based classification placed the learner in moderate support because scores are above severe range but below expected independence.",
      "The recommendation matrix matched sequencing and main idea tags to visual organizers and summary frames.",
      "The plan remains advisory until teacher review."
    ],
    teacherReviewStatus: "Pending Review",
    teacherNotes: "",
    progressStatus: "Improving",
    confidence: 84,
    reviewedByTeacher: false
  },
  {
    id: "R-103",
    learnerId: "L-003",
    date: "2026-05-20",
    assessmentId: "A-103",
    observationId: "O-103",
    classifiedSupportLevel: "Low Support Need",
    recommendedStrategies: ["Guided wh-questioning", "Text highlighting for key details", "Read-and-point response prompts"],
    contributingFactors: ["Total adapted reading score: 37/50 (74%).", "Observation indicates light difficulty with explicit details."],
    evidence: [
      "Selected indicator: Difficulty Identifying Details.",
      "Accommodations considered: Large Print, Highlighting.",
      "IEP-aligned goal considered: Answer explicit wh- questions."
    ],
    nlpDifficultyTags: ["Literal Comprehension"],
    reasoningSteps: [
      "Assessment scores show mostly independent performance across the reading domains.",
      "Observation indicates one focused literal comprehension support need.",
      "Rule-based classification kept the support level low because total performance is near the expected range.",
      "The recommendation matrix selected light scaffolds rather than intensive intervention.",
      "The teacher can continue monitoring for consistency across sessions."
    ],
    teacherReviewStatus: "Approved",
    teacherNotes: "Approved as light support for continued classroom monitoring.",
    progressStatus: "Stable",
    confidence: 76,
    reviewedByTeacher: true
  }
];
