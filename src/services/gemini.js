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
  const systemInstruction = `You are a helpful, expert AI teaching assistant for a MOOC. 
Your goal is to explain difficult topics in a simple, step-by-step, intuitive manner.
Answer the student's question based on the provided educational context.
If the question is not related to the context or general learning, politely steer the conversation back to the context.

Respond in ${language}. 
If ${language} is "Hinglish", use a friendly, conversational mix of Hindi and English written in Latin script (e.g. "Ye topic samajhne ke liye hume...", "Correct answer A hai kyuki...").
Use markdown format for your answers (bolding, lists, and code blocks for technical items).
Provide a structured, step-by-step explanation.`;

  const model = getModel("gemini-2.0-flash", systemInstruction);

  const prompt = `
Educational Context:
${context || "No context provided. Use general educational/academic knowledge to answer."}

Student's Question:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateQuiz = async (context) => {
  const model = getModel();
  
  const prompt = `
Generate exactly 3 multiple choice questions (MCQs) to test understanding of the following educational context.
Each question must have exactly 4 choices, a correct answer index (0-based, 0 to 3), and a short helpful explanation.

Context:
${context}
`;

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
  const data = JSON.parse(responseText);
  return data.quizzes;
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
