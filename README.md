# 🎓 Edu-Path — AI-Powered Learning Assistant

> Hyper-personalized MOOC remedial assistant powered by Google Gemini AI

Edu-Path is an intelligent learning assistant that helps online students understand course materials better through AI-driven doubt resolution and conceptual quizzes.

## ✨ Features

### 📖 Context/Syllabus Ingestion
Paste your chapter text, lecture transcript, or study notes — Edu-Path uses it as the knowledge base for all interactions.

### 💬 Doubt Resolution Chatbot
Ask questions about your course material and get easy, step-by-step explanations in conversational language.

### 🧠 One-Click Conceptual Quiz
Generate 3 AI-crafted MCQs instantly. Get detailed feedback on your answers with explanations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`. On first launch, you'll be prompted to enter your Gemini API key.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite |
| **AI Engine** | Google Gemini 2.0 Flash |
| **Styling** | Vanilla CSS (Glassmorphism dark theme) |
| **Icons** | Lucide React |
| **Markdown** | react-markdown |

## 📁 Project Structure

```
src/
├── components/
│   ├── ApiKeyModal.jsx   # API key input modal
│   ├── Header.jsx        # App header with branding
│   ├── Sidebar.jsx       # Desktop navigation sidebar
│   ├── MobileNav.jsx     # Mobile bottom navigation
│   ├── ContextPanel.jsx  # Course material input
│   ├── ChatInterface.jsx # AI doubt resolution chat
│   └── QuizModule.jsx    # MCQ quiz generation
├── services/
│   └── gemini.js         # Gemini API integration
├── App.jsx               # Main application
├── index.css             # Design system & global styles
└── main.jsx              # Entry point
```

## 🔮 Future Scope

- **Multimodal Support**: Upload lecture videos and PDFs directly
- **Progress Dashboard**: Track weak/strong topics over time
- **Remedial Study Plans**: AI-generated personalized weekly timetables
- **Multi-language Support**: Learn in your preferred language

## 📄 License

MIT
