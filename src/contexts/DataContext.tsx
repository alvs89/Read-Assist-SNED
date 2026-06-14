import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Learner, Assessment, Observation, Recommendation } from "../types"
import { mockLearners as initialLearners, mockAssessments, mockObservations, mockRecommendations } from "../data"
import { analyzeObservation, buildAssessmentSummary, buildRecommendation } from "@/src/lib/decisionSupport"

interface DataContextType {
  learners: Learner[];
  addLearner: (learner: Omit<Learner, "id">) => void;
  updateLearner: (id: string, learner: Partial<Learner>) => void;
  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, "id" | "percentage" | "lowestDomains" | "summary">) => void;
  observations: Observation[];
  addObservation: (observation: Omit<Observation, "id" | "nlpTags" | "extractedEvidence">) => void;
  recommendations: Recommendation[];
  addRecommendation: (recommendation: Omit<Recommendation, "id">) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
  generateRecommendationForLearner: (learnerId: string) => Recommendation | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [learners, setLearners] = useState<Learner[]>(() => {
    const saved = localStorage.getItem('readassist_learners_v4')
    return saved ? JSON.parse(saved) : initialLearners
  })
  
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('readassist_assessments_v4')
    return saved ? JSON.parse(saved) : mockAssessments
  })
  
  const [observations, setObservations] = useState<Observation[]>(() => {
    const saved = localStorage.getItem('readassist_observations_v4')
    return saved ? JSON.parse(saved) : mockObservations
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem('readassist_recommendations_v4')
    return saved ? JSON.parse(saved) : mockRecommendations
  })

  useEffect(() => {
    localStorage.setItem('readassist_learners_v4', JSON.stringify(learners))
  }, [learners])

  useEffect(() => {
    localStorage.setItem('readassist_assessments_v4', JSON.stringify(assessments))
  }, [assessments])

  useEffect(() => {
    localStorage.setItem('readassist_observations_v4', JSON.stringify(observations))
  }, [observations])

  useEffect(() => {
    localStorage.setItem('readassist_recommendations_v4', JSON.stringify(recommendations))
  }, [recommendations])

  const addLearner = (learnerData: Omit<Learner, "id">) => {
    const newLearner: Learner = {
      ...learnerData,
      id: `L-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    }
    setLearners(prev => [...prev, newLearner])
  }

  const updateLearner = (id: string, updates: Partial<Learner>) => {
    setLearners(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const addAssessment = (data: Omit<Assessment, "id" | "percentage" | "lowestDomains" | "summary">) => {
    const summary = buildAssessmentSummary({
      literalScore: data.literalScore,
      inferentialScore: data.inferentialScore,
      vocabularyScore: data.vocabularyScore,
      sequencingScore: data.sequencingScore,
      mainIdeaScore: data.mainIdeaScore,
    })
    const fresh: Assessment = {
      ...data,
      ...summary,
      id: `A-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    }
    setAssessments(prev => [...prev, fresh])
    const latestObservation = [...observations]
      .filter(o => o.learnerId === fresh.learnerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    if (latestObservation) {
      createRecommendationFromPair(fresh, latestObservation, [...assessments, fresh])
    }
  }

  const addObservation = (data: Omit<Observation, "id" | "nlpTags" | "extractedEvidence">) => {
    const analysis = analyzeObservation(data.indicators, data.narrative)
    const fresh: Observation = {
      ...data,
      ...analysis,
      id: `O-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    }
    setObservations(prev => [...prev, fresh])
    const latestAssessment = [...assessments]
      .filter(a => a.learnerId === fresh.learnerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    if (latestAssessment) {
      createRecommendationFromPair(latestAssessment, fresh, assessments)
    }
  }

  const addRecommendation = (data: Omit<Recommendation, "id">) => {
    const fresh: Recommendation = { ...data, id: `R-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` }
    setRecommendations(prev => [...prev, fresh])
  }

  const updateRecommendation = (id: string, updates: Partial<Recommendation>) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const createRecommendationFromPair = (
    assessment: Assessment,
    observation: Observation,
    assessmentPool: Assessment[]
  ) => {
    const learner = learners.find(l => l.id === assessment.learnerId)
    if (!learner) return undefined

    const generated: Recommendation = {
      ...buildRecommendation(learner, assessment, observation, assessmentPool.filter(a => a.learnerId === learner.id)),
      id: `R-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    }

    setRecommendations(prev => {
      const exists = prev.some(r => r.assessmentId === assessment.id && r.observationId === observation.id)
      return exists ? prev : [generated, ...prev]
    })
    setLearners(prev => prev.map(l => l.id === learner.id ? {
      ...l,
      supportNeeds: generated.classifiedSupportLevel,
      status: generated.progressStatus
    } : l))
    return generated
  }

  const generateRecommendationForLearner = (learnerId: string) => {
    const latestAssessment = [...assessments]
      .filter(a => a.learnerId === learnerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    const latestObservation = [...observations]
      .filter(o => o.learnerId === learnerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    if (!latestAssessment || !latestObservation) return undefined
    return createRecommendationFromPair(latestAssessment, latestObservation, assessments)
  }

  return (
    <DataContext.Provider value={{
      learners, addLearner, updateLearner,
      assessments, addAssessment,
      observations, addObservation,
      recommendations, addRecommendation, updateRecommendation, generateRecommendationForLearner
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
