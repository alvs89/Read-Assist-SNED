# ReadAssist-SNED

ReadAssist-SNED is an AI-assisted intervention platform designed to help Special Needs Education (SNED) teachers monitor reading comprehension, record behavioral observations, and generate explainable intervention plans for their learners.

## Features

- **Learner Profiles:** Track individual learner progress, support needs, grade level, accommodations, and IEP Goals.
- **Reading Comprehension Assessments:** Record literal and inferential comprehension scores, vocabulary usage, sequencing, and main idea recognition for objective analysis.
- **Teacher Observations:** Document behavioral patterns and specific reading difficulties interactively.
- **Explainable Recommendations:** Automatically generate data-driven reading strategies based on combined assessments and behavioral observations. 
- **Progress Tracking:** Visualize learning trends through intuitive charts and simple metrics to gauge response to interventions over time.

## Technologies

- **React 18** and **Vite**
- **Tailwind CSS** for elegant, mobile-responsive layouts
- **Recharts** for intuitive data visualization
- **Lucide React** for essential iconography

## Setup & Running

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

## Structure

- `src/pages`: Feature-based routing (Dashboard, Learners, Assessments, Observations, Recommendations, Progress).
- `src/components`: Reusable UI elements (Cards, Buttons, Badges).
- `src/contexts`: Persistent local state management spanning session activity.

## Purpose

Empowering special educators with actionable, data-backed insights to better guide their learners.
