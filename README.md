# Antigravity Learn — LLM-Powered Personalized Academic Learning Assistant

An evidence-based, adaptive academic learning platform that teaches complex concepts, evaluates student understanding through multiple question modalities, diagnoses prerequisite knowledge gaps, and transparently adapts its teaching approach based on empirical performance.

---

## 🌟 Key Architecture & Capabilities

### 1. Chat-Based Learning Workspace & Multi-Topic Navigation
- **ChatGPT-Inspired Collapsible Interface**: Clean sidebar displaying active and previous learning topics with estimated mastery, assessment counts, and document indicators.
- **Topic Independence**: Each chat represents an isolated academic topic (e.g., *Linked Lists in C*, *Binary Search Trees*, *Newton's Laws of Motion*, *Transformer Attention*) with its own lesson sequence, assessment outcomes, and adaptation history.
- **Zero-Barrier Start**: Learn any topic immediately with or without study materials.

### 2. Tri-Category Learning Technique Selection
Techniques are organized into three distinct, non-interchangeable categories:
- **A. Teaching Approaches**: *Step-by-Step Explanation*, *Worked Examples First*, *Visual & Diagram-Based*, *Analogy-Based*, *Socratic Questioning*, *Simplified to Increasing Complexity*.
- **B. Practice Approaches**: *Retrieval Practice*, *Guided Problem-Solving*, *Independent Exercises*, *Explain-in-Your-Own-Words (Feynman)*, *Error Analysis & Debugging*.
- **C. Study Schedules**: *Pomodoro Focus Sessions*, *Spaced Repetition (Leitner Intervals)*, *Scheduled Topic Check-ins*.

### 3. Transparent Adaptive Teaching Engine
- **No Pseudo-Labeling**: Avoids assigning rigid or permanent psychological learning styles to students.
- **Empirical Gap Diagnosis**: Identifies specific prerequisite gaps from repeated error patterns (e.g., pointer inversion errors leading to heap memory gap diagnosis).
- **Transparent Adaptation Dialogue**: Shows a clear rationale when adapting:
  > *"I noticed that the pointer-based examples were difficult under the Step-by-Step approach. Let's try a Visual Diagram explanation of how nodes connect in memory, followed by a simpler verification exercise."*
- **Full Student Agency**: Students can **Accept**, **Reject**, or **Manually Override** adaptations.
- **Pre/Post Delta Measurement**: Conducts a follow-up assessment to measure if understanding improved (e.g., +28% accuracy gain).

### 4. Multi-Modal Assessment & Interactive Code Editor
- **Question Types**: Multiple-Choice, Short-Answer, Explain-in-your-own-words with rubric grading, and Code Debugging with an interactive C/C++ editor.
- **Granular Evidence Metrics**: Deterministic scoring for objective items, criteria checking for open-ended explanations, hints requested, attempt counts, and 1–5 confidence ratings.

### 5. Progress Analytics Dashboard
- **Distinct Metrics**: Clearly distinguishes **Measured Facts** (direct quiz accuracy) from **Estimated Metrics** (probabilistic concept mastery).
- **Efficacy Comparison**: Tracks learning methods used and observed accuracy outcomes.
- **Friction Points**: Identifies diagnosed recurring mistakes across units.

### 6. Spaced Repetition Flashcards & Pomodoro Timer
- **Leitner Box System**: 4 recall rating tiers (*Again*, *Hard*, *Good*, *Easy*) calculating scheduled review intervals.
- **Pomodoro Timer**: 25-minute focus bursts and 5-minute cognitive rest intervals.

### 7. Optional Notes & Document Grounding
- Upload PDF, DOCX, TXT, or images of handwritten notes.
- Extracts key concepts and grounds AI explanations and doubts directly in the uploaded text.
- Includes pre-packaged CS lecture notes (*Lecture_04_Pointers_and_Nodes.txt*).

---

## 🔒 AI Integration & Security Architecture

The platform supports multiple AI backends behind a clean service layer:

| Mode | Provider | Key Configuration | Purpose |
|---|---|---|---|
| **Demo Mode** *(Active by Default)* | Built-in Pedagogical Engine | None required | 100% offline, deterministic, rich academic simulation |
| **Live AI** | Google Gemini | `GEMINI_API_KEY` | Deep multimodal explanations & conceptual evaluation |
| **Live AI** | OpenAI | `OPENAI_API_KEY` | Conversational doubts, structured JSON rubrics |

### Security Safeguards
- **Zero Client-Side Secrets**: API keys are **never** stored in client localStorage or committed to the repository.
- **Backend Proxy**: All AI requests are routed through `server/index.js` (Express API) which reads keys from environment variables.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional)
If you wish to use live Google Gemini or OpenAI API keys instead of the built-in pedagogical simulation:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and supply your keys:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 3. Run the Application
To run both the backend server and frontend client concurrently:
```bash
npm start
```
Alternatively, run them separately:
- **Backend API**: `npm run server` (runs on `http://localhost:3001`)
- **Frontend Client**: `npm run dev` (runs on `http://localhost:5173`)

### 4. Production Build & Validation
```bash
npm run build
```
Verify the production build locally:
```bash
npm run preview
```
