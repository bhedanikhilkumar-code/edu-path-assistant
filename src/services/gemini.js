import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

export const initializeGemini = (apiKey) => {
  if (!apiKey) return null;
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

const getModel = (modelName = "gemini-2.0-flash", systemInstruction) => {
  if (!genAI) {
    const key = localStorage.getItem("edu-path-api-key");
    if (key) {
      initializeGemini(key);
    }
  }
  if (!genAI) {
    throw new Error("Gemini API is not initialized. Please configure your API key.");
  }
  const config = { model: modelName };
  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }
  return genAI.getGenerativeModel(config);
};

export const askDoubt = async (context, question, language = "English") => {
  const provider = localStorage.getItem("edu-path-api-provider") || "gemini";
  const apiKey = localStorage.getItem("edu-path-api-key") || "";

  const systemInstruction = `You are a helpful, expert AI teaching assistant for a MOOC. 
Your goal is to explain difficult topics in a simple, step-by-step, intuitive manner.
Answer the student's question based on the provided educational context.
If the question is not related to the context or general learning, politely steer the conversation back to the context.

Respond in ${language}. 
If ${language} is "Hinglish", use a friendly, conversational mix of Hindi and English written in Latin script (e.g. "Ye topic samajhne ke liye hume...", "Correct answer A hai kyuki...").
Use markdown format for your answers (bolding, lists, and code blocks for technical items).
Provide a structured, step-by-step explanation.`;

  const prompt = `
Educational Context:
${context || "No context provided. Use general educational/academic knowledge to answer."}

Student's Question:
${question}
`;

  if (provider === "gemini") {
    const model = getModel("gemini-2.0-flash", systemInstruction);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } else {
    // Custom OpenAI-compatible / Proxy (e.g. OpenCode Zen)
    const baseUrl = localStorage.getItem("edu-path-custom-base-url") || "https://opencode.ai/zen/v1";
    const customModel = localStorage.getItem("edu-path-custom-model") || "gemini-2.0-flash";

    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: customModel,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parseErr;
      try {
        parseErr = JSON.parse(errText);
      } catch {}
      const errMsg = parseErr?.error?.message || errText || response.statusText;
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};

export const generateQuiz = async (context, numQuestions = 3, difficulty = "Medium") => {
  if (!context || !context.trim()) {
    throw new Error("Please add your course context or lecture notes in the 'Course Context' tab before generating a quiz.");
  }

  const provider = localStorage.getItem("edu-path-api-provider") || "gemini";
  const apiKey = localStorage.getItem("edu-path-api-key") || "";

  const prompt = `
Generate exactly ${numQuestions} multiple choice questions (MCQs) at a ${difficulty} difficulty level to test understanding of the following educational context.
Each question must have exactly 4 choices, a correct answer index (0-based, 0 to 3), and a short helpful explanation.

Return the response in a JSON object with a single root key "quizzes", which is an array of questions.
Each question object in the "quizzes" array must contain:
- "id": integer (0 to ${numQuestions - 1})
- "question": string
- "options": array of exactly 4 strings
- "correctAnswerIndex": integer (0 to 3)
- "explanation": string

Context:
${context}
`;

  const parseJsonResponse = (text) => {
    if (!text) throw new Error("Empty response received from AI model.");
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const startIdx = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      clean = clean.substring(startIdx, endIdx + 1);
    }
    const data = JSON.parse(clean);
    if (!data.quizzes || !Array.isArray(data.quizzes)) {
      throw new Error("Invalid response format: 'quizzes' array missing.");
    }
    return data.quizzes;
  };

  if (provider === "gemini") {
    const model = getModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            quizzes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "INTEGER" },
                  question: { type: "STRING" },
                  options: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    description: "Exactly 4 options"
                  },
                  correctAnswerIndex: { type: "INTEGER", description: "0-based index of the correct answer (0 to 3)" },
                  explanation: { type: "STRING", description: "Why the answer is correct" }
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
              }
            }
          },
          required: ["quizzes"]
        }
      }
    });

    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  } else {
    // Custom OpenAI-compatible / Proxy (e.g. OpenCode Zen)
    const baseUrl = localStorage.getItem("edu-path-custom-base-url") || "https://opencode.ai/zen/v1";
    const customModel = localStorage.getItem("edu-path-custom-model") || "gemini-2.0-flash";

    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: customModel,
        messages: [
          { role: "system", content: "You are an educational quiz generation assistant. You must output valid JSON matching the requested schema." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parseErr;
      try {
        parseErr = JSON.parse(errText);
      } catch {}
      const errMsg = parseErr?.error?.message || errText || response.statusText;
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    return parseJsonResponse(responseText);
  }
};

export const generateFlashcards = async (context) => {
  if (!context || !context.trim()) {
    throw new Error("Please add your course context or lecture notes in the 'Course Context' tab before generating flashcards.");
  }

  const provider = localStorage.getItem("edu-path-api-provider") || "gemini";
  const apiKey = localStorage.getItem("edu-path-api-key") || "";

  const prompt = `
Generate exactly 5 essential flashcards from the following educational context for quick revision and remedial study.
Each flashcard must summarize a core concept, key term, or principle.

Return the response in a JSON object with a single root key "flashcards", which is an array of objects.
Each object in "flashcards" must contain:
- "id": integer (0 to 4)
- "concept": string (The question or core term on front of card)
- "explanation": string (Clear 2-3 sentence explanation on back of card)
- "keyTakeaway": string (A one-sentence takeaway or memory trick)

Context:
${context}
`;

  const parseJsonResponse = (text) => {
    if (!text) throw new Error("Empty response received from AI model.");
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const startIdx = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      clean = clean.substring(startIdx, endIdx + 1);
    }
    const data = JSON.parse(clean);
    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      throw new Error("Invalid response format: 'flashcards' array missing.");
    }
    return data.flashcards;
  };

  if (provider === "gemini") {
    const model = getModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            flashcards: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "INTEGER" },
                  concept: { type: "STRING" },
                  explanation: { type: "STRING" },
                  keyTakeaway: { type: "STRING" }
                },
                required: ["id", "concept", "explanation", "keyTakeaway"]
              }
            }
          },
          required: ["flashcards"]
        }
      }
    });

    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  } else {
    const baseUrl = localStorage.getItem("edu-path-custom-base-url") || "https://opencode.ai/zen/v1";
    const customModel = localStorage.getItem("edu-path-custom-model") || "gemini-2.0-flash";

    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: customModel,
        messages: [
          { role: "system", content: "You are an educational flashcard generation assistant. Output valid JSON matching the schema." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parseErr;
      try { parseErr = JSON.parse(errText); } catch {}
      const errMsg = parseErr?.error?.message || errText || response.statusText;
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    return parseJsonResponse(responseText);
  }
};

export const generateStudyPlan = async (context) => {
  if (!context || !context.trim()) {
    throw new Error("Please add your course context or lecture notes in the 'Course Context' tab before generating a study plan.");
  }

  const provider = localStorage.getItem("edu-path-api-provider") || "gemini";
  const apiKey = localStorage.getItem("edu-path-api-key") || "";

  const prompt = `
Analyze the following educational context and generate a comprehensive Remedial Study Plan & Cheat Sheet.

Return the response in a JSON object containing:
- "topicTitle": string (A concise title summarizing the course material)
- "summaryPoints": array of 4-5 strings (Core concepts & main takeaways)
- "misconceptions": array of 3 strings (Common student errors or misunderstandings to avoid)
- "glossary": array of 4 objects, each with {"term": string, "definition": string}
- "remedialSteps": array of 3 objects, each with {"step": integer, "title": string, "description": string}

Context:
${context}
`;

  const parseJsonResponse = (text) => {
    if (!text) throw new Error("Empty response received from AI model.");
    let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const startIdx = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      clean = clean.substring(startIdx, endIdx + 1);
    }
    const data = JSON.parse(clean);
    if (!data.topicTitle || !Array.isArray(data.summaryPoints)) {
      throw new Error("Invalid response format: Missing study plan fields.");
    }
    return data;
  };

  if (provider === "gemini") {
    const model = getModel();
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            topicTitle: { type: "STRING" },
            summaryPoints: { type: "ARRAY", items: { type: "STRING" } },
            misconceptions: { type: "ARRAY", items: { type: "STRING" } },
            glossary: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  term: { type: "STRING" },
                  definition: { type: "STRING" }
                },
                required: ["term", "definition"]
              }
            },
            remedialSteps: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  step: { type: "INTEGER" },
                  title: { type: "STRING" },
                  description: { type: "STRING" }
                },
                required: ["step", "title", "description"]
              }
            }
          },
          required: ["topicTitle", "summaryPoints", "misconceptions", "glossary", "remedialSteps"]
        }
      }
    });

    const responseText = result.response.text();
    return parseJsonResponse(responseText);
  } else {
    const baseUrl = localStorage.getItem("edu-path-custom-base-url") || "https://opencode.ai/zen/v1";
    const customModel = localStorage.getItem("edu-path-custom-model") || "gemini-2.0-flash";

    const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: customModel,
        messages: [
          { role: "system", content: "You are an educational remedial study planner. Output valid JSON matching the schema." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let parseErr;
      try { parseErr = JSON.parse(errText); } catch {}
      const errMsg = parseErr?.error?.message || errText || response.statusText;
      throw new Error(`API Error (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    return parseJsonResponse(responseText);
  }
};

export const evaluateAnswers = (questions, userAnswers) => {
  const results = questions.map((q) => {
    const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;
    return {
      id: q.id,
      isCorrect,
      userAnswerIndex: userAnswers[q.id],
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const total = questions.length;
  const percentage = Math.round((score / total) * 100);

  return {
    results,
    score,
    total,
    percentage
  };
};

export const getFriendlyErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred. Please try again.';
  
  const msg = error.message || String(error);
  
  if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('Limit')) {
    return 'API Quota/Rate Limit Exceeded. The free tier limits how frequently you can call the model. Please wait a few seconds and click try again, or configure a different Gemini API key.';
  }
  
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('key is invalid') || msg.includes('invalid api key')) {
    return 'Invalid API Key. Please click the settings icon in the top right and verify your Gemini API key.';
  }

  if (msg.includes('safety') || msg.includes('blocked')) {
    return 'Content blocked. The query or generated response triggered safety filters. Please try rephrasing your prompt.';
  }

  if (msg.includes('Failed to fetch') || msg.includes('network') || msg.includes('Network')) {
    return 'Network Error. Could not connect to Gemini API. Please check your internet connection.';
  }

  return msg;
};
