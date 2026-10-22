import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health and provider status
app.get('/api/health', (req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    status: 'ok',
    providers: {
      gemini: { available: hasGemini },
      openai: { available: hasOpenAI },
      demo: { available: true, activeByDefault: !hasGemini && !hasOpenAI }
    },
    mode: (hasGemini ? 'gemini' : (hasOpenAI ? 'openai' : 'demo'))
  });
});

// Helper to call OpenAI API
async function callOpenAI(apiKey, prompt, systemPrompt, jsonMode = false) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || 'You are an academic learning assistant.' },
        { role: 'user', content: prompt }
      ],
      response_format: jsonMode ? { type: 'json_object' } : undefined,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Helper to call Gemini API
async function callGemini(apiKey, prompt, systemInstruction = '', jsonMode = false) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: 0.3,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

// 1. explainConcept
app.post('/api/ai/explain', async (req, res) => {
  const { topic, teachingMethod, difficulty, contextDocument, studentHistory } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const provider = process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'demo');

  if (apiKey && provider !== 'demo') {
    try {
      const prompt = `Topic: "${topic}".
Teaching Approach: "${teachingMethod}".
Difficulty: "${difficulty || 'standard'}".
${contextDocument ? `Context Material:\n${contextDocument.substring(0, 2000)}\n` : ''}
${studentHistory ? `Student Background: ${JSON.stringify(studentHistory)}\n` : ''}

Generate a structured lesson explanation formatted in JSON:
{
  "title": "Title of concept",
  "introduction": "Brief hook and 2-sentence overview",
  "explanation": "Core explanation tailored specifically using the ${teachingMethod} approach",
  "keyTakeaways": ["point 1", "point 2", "point 3"],
  "examples": [
    {
      "title": "Example title",
      "walkthrough": "Step by step walkthrough",
      "codeSnippet": "code if applicable or null",
      "explanation": "why it works"
    }
  ],
  "visualPrompt": "Description of diagram or ASCII/SVG visualization for this concept",
  "socraticCheck": "A quick self-check reflection question for the student"
}`;

      let resultText;
      if (provider === 'gemini') {
        resultText = await callGemini(apiKey, prompt, 'You are an adaptive academic pedagogy expert. Return valid JSON only.', true);
      } else {
        resultText = await callOpenAI(apiKey, prompt, 'You are an adaptive academic pedagogy expert. Return valid JSON only.', true);
      }
      return res.json({ success: true, provider, isDemo: false, data: JSON.parse(resultText) });
    } catch (err) {
      console.warn('AI API call failed, falling back to pedagogical engine:', err.message);
    }
  }

  // Demo / Fallback Mode (Deterministic & realistic pedagogical content)
  res.json({
    success: true,
    provider: 'demo',
    isDemo: true,
    message: 'Generated using built-in Pedagogical Simulation Engine (No live API key required)',
    data: null // Frontend service handles complete topic-aware generation
  });
});

// 2. answerStudentDoubt
app.post('/api/ai/doubt', async (req, res) => {
  const { topic, doubt, currentLessonStep, contextDocument } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const provider = process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'demo');

  if (apiKey && provider !== 'demo') {
    try {
      const prompt = `Student Doubt on "${topic}": "${doubt}"
Current Lesson Context: "${currentLessonStep || 'General'}"
${contextDocument ? `Source Document:\n${contextDocument.substring(0, 1500)}` : ''}

Answer clearly, warmly, and pedagogically. Point out any misconceptions, use a concise analogy or minimal code snippet if needed, and verify their understanding at the end.`;

      let answer;
      if (provider === 'gemini') {
        answer = await callGemini(apiKey, prompt, 'You are a patient, encouraging academic professor.');
      } else {
        answer = await callOpenAI(apiKey, prompt, 'You are a patient, encouraging academic professor.');
      }
      return res.json({ success: true, provider, isDemo: false, answer });
    } catch (err) {
      console.warn('AI API call failed for doubt:', err.message);
    }
  }

  res.json({
    success: true,
    provider: 'demo',
    isDemo: true,
    answer: null // Handled gracefully by frontend engine
  });
});

// 3. evaluateAnswer
app.post('/api/ai/evaluate', async (req, res) => {
  const { question, studentAnswer, rubrics } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const provider = process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'demo');

  if (apiKey && provider !== 'demo') {
    try {
      const prompt = `Question: "${question}"
Student's Answer: "${studentAnswer}"
Criteria/Rubrics: "${rubrics || 'Check for core conceptual accuracy and completeness'}"

Respond in JSON:
{
  "isCorrect": true/false,
  "score": number between 0 and 100,
  "feedback": "constructive 2-sentence feedback highlighting strengths and any missing elements",
  "identifiedGaps": ["list of concepts or terms missing"],
  "encouragement": "motivational brief closing"
}`;

      let resultText;
      if (provider === 'gemini') {
        resultText = await callGemini(apiKey, prompt, 'You are a fair, pedagogical assessor. Return valid JSON only.', true);
      } else {
        resultText = await callOpenAI(apiKey, prompt, 'You are a fair, pedagogical assessor. Return valid JSON only.', true);
      }
      return res.json({ success: true, provider, isDemo: false, evaluation: JSON.parse(resultText) });
    } catch (err) {
      console.warn('AI API call failed for evaluate:', err.message);
    }
  }

  res.json({
    success: true,
    provider: 'demo',
    isDemo: true,
    evaluation: null
  });
});

app.listen(PORT, () => {
  console.log(`Academic Learning Assistant backend running on http://localhost:${PORT}`);
});
