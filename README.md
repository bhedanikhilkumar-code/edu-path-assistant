# 🎓 Edu-Path — AI-Powered Remedial Learning Assistant

<p align="center">
  <b>Hyper-personalized MOOC Remedial Assistant powered by Google Gemini AI</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/AI Engine-Gemini 2.0 Flash-8E44AD?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/UI Theme-Glassmorphism Dark-00C9FF" alt="Glassmorphism UI" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License MIT" />
</p>

---

## 📌 Executive Summary

Online Massive Open Online Courses (MOOCs) often suffer from high dropout rates because learners get stuck on complex concepts without real-time, tailored assistance. **Edu-Path** bridges this gap by acting as an intelligent 24/7 personal remedial tutor. 

Learners upload or paste their exact course syllabus, lecture transcripts, or study notes. Edu-Path then provides **context-aware doubt resolution** and **instant conceptual MCQs** to test and strengthen understanding in real time.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 📄 **Context Ingestion Engine** | Paste course chapters, transcripts, or notes. Edu-Path anchors all AI responses strictly to your material. |
| 💬 **AI Remedial Doubt Solver** | Ask questions and receive step-by-step, simple explanations with Hinglish & English language support. |
| 🧠 **One-Click MCQ Quiz Generator** | Generate instant multi-choice quizzes based on your course material with instant scoring & explanations. |
| 🌐 **Hinglish & Multi-Lang Mode** | Learner-friendly Hinglish responses ("*Ye topic samajhne ke liye...*") lower cognitive barriers for fast learning. |
| 🛡️ **Privacy & Client Storage** | API keys and context data remain safely stored in local browser storage (`localStorage`). |
| 💎 **Glassmorphism Dark UI** | Sleek, modern, and responsive user interface crafted with dynamic glassmorphism design. |

---

## 🏗️ System Architecture & Workflow

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      Learner Interface                      │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                    [1. Paste Study Material]
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                   Local Context Engine                      │
 │       (Stores context & API keys in Browser Storage)        │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                 [2. Query / Generate Quiz]
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │             Google Gemini 2.0 Flash Integration             │
 │        (Generates tailored remedial answers & MCQs)         │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                     [3. Dynamic Rendering]
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │              Remedial Output & Interactive Quiz             │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core:** React 19, JSX, ES Modules
- **Build Tool:** Vite 6
- **AI Integration:** `@google/generative-ai` (Gemini 2.0 Flash)
- **Icons:** `lucide-react`
- **Markdown Processing:** `react-markdown`
- **Styling:** Vanilla CSS with custom properties (Glassmorphism Dark Theme)

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/edu-path.git
   cd edu-path
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.
   On first load, enter your **Gemini API Key** in the settings modal.

---

## 📂 Project Directory Structure

```
Edu-Path/
├── public/                 # Static assets
├── src/
│   ├── components/         # Modular React components
│   │   ├── ApiKeyModal.jsx # API Key setup modal
│   │   ├── ChatInterface.jsx # AI doubt-clearing chat
│   │   ├── ContextPanel.jsx # Course content ingestion form
│   │   ├── Header.jsx      # Navigation header with settings & language selector
│   │   ├── MobileNav.jsx   # Responsive mobile bottom navigation bar
│   │   ├── QuizModule.jsx  # Interactive MCQ quiz generator & evaluator
│   │   └── Sidebar.jsx     # Desktop sidebar navigation
│   ├── services/
│   │   └── gemini.js       # Gemini API client integration & prompt engineering
│   ├── App.jsx             # Main application state & routing controller
│   ├── index.css           # Glassmorphism design tokens & global CSS
│   └── main.jsx            # Application entry point
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite configuration
└── README.md               # Documentation
```

---

## 💡 How It Works (Step-by-Step)

1. **Step 1: Input Course Context** — Paste your lecture notes, textbook excerpt, or topic outline into the **Context Panel**.
2. **Step 2: Ask Doubts in Chat** — Head over to the **Remedial Chat** tab. Ask any confusing question in English or Hinglish.
3. **Step 3: Evaluate Understanding** — Switch to **Quiz Module** and click **Generate Quiz**. Answer the 3 tailored MCQs to check your mastery.

---

## 🔮 Future Roadmap

- 🎥 **Multimodal Support**: Direct ingestion of PDF textbooks, lecture audio, and YouTube video links.
- 📊 **Learning Analytics Dashboard**: Track weak concepts and progress history over time.
- 📅 **AI Study Planner**: Generate customized daily remedial review schedules based on quiz results.
- 🔊 **Voice Tutor**: Audio-based Q&A interactions for hands-free learning.

---

## 📜 License

Distributed under the **MIT License**.

---

<p align="center">
  Crafted with ❤️ for accessible, intelligent, and personalized learning.
</p>
