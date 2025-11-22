# 🚀 Arkai LXP: Next-Gen Learning Experience Platform
> **"Low Code / High Impact"** — A demonstration of modern software architecture built with efficiency and scale in mind.

## 🌟 Project Overview
**Arkai LXP** is a cutting-edge Learning Experience Platform designed to democratize education for small businesses. Unlike generic LMS solutions, Arkai combines a premium **"RightWay Ecosystem"** aesthetic with powerful **AI-driven automation** to create a personalized learning journey.

This project demonstrates the power of integrating **Low Code principles** with **High-Code architecture** (React + Supabase + Edge Functions) to build enterprise-grade software with a lean team.

---

## 🏗️ Technical Architecture
The platform is built on a robust, serverless stack designed for security, scalability, and cost-efficiency.

```mermaid
graph TD
    User[User / Student] -->|HTTPS| Frontend[React + Vite Frontend]
    Frontend -->|Auth & Data| Supabase[Supabase Backend]
    
    subgraph "Supabase Ecosystem"
        Supabase -->|Auth| Auth[Authentication]
        Supabase -->|PostgreSQL| DB[(Database)]
        Supabase -->|API Calls| Edge[Edge Functions (Deno)]
    end
    
    subgraph "AI Brain"
        Edge -->|Prompt| Gemini[Gemini 1.5 Flash API]
        Gemini -->|JSON Response| Edge
    end
    
    Edge -->|Structured Data| Frontend
```

### 🔧 Tech Stack
-   **Frontend:** React 18, Vite, Tailwind CSS (Custom "RightWay" Design System).
-   **Backend:** Supabase (PostgreSQL, Row Level Security, Real-time).
-   **Compute:** Supabase Edge Functions (Deno/TypeScript).
-   **Artificial Intelligence:** Google Gemini 1.5 Flash (via API).
-   **Deployment:** Vercel (Frontend), Supabase (Backend).

---

## ✨ Key Features

### 1. 🤖 Kai Companion (AI Tutor)
An intelligent, always-on virtual tutor that guides students through their learning path.
-   **Technology:** Powered by `chatbot-kai` Edge Function.
-   **Capabilities:** Context-aware answers, friendly persona, markdown formatting.
-   **Innovation:** Removed voice complexity for a faster, text-first reliable experience.

### 2. 📝 AI Quiz Generator
Automated assessment creation engine.
-   **Technology:** `generate-quiz-ai` Edge Function using **Structured Outputs**.
-   **Workflow:** The user provides raw text -> AI analyzes complexity -> Generates a 5-question quiz with options and explanations in JSON format.
-   **Impact:** Reduces content creation time from hours to seconds.

### 3. 🎨 "RightWay" Design System
A custom UI/UX language built for engagement.
-   **Aesthetic:** Dark mode, Glassmorphism, Neon accents (`#00f0ff`, `#7000ff`).
-   **Components:** Custom "Glass Cards", animated sidebars, responsive layouts.
-   **Philosophy:** "Software should feel like a premium tool, not a spreadsheet."

### 4. 🛡️ Enterprise-Grade Security
-   **RLS (Row Level Security):** Data access is controlled at the database engine level.
-   **Edge Security:** API keys (Gemini) are hidden in server-side Edge Functions, never exposed to the client.

---

## 💡 Business Value
For a small business, Arkai LXP represents a **strategic asset**:
1.  **Cost Efficiency:** Running on serverless tiers (Vercel/Supabase free tiers) keeps operating costs near zero.
2.  **Scalability:** The architecture can handle thousands of users without code changes.
3.  **Ownership:** Unlike rented SaaS platforms (Kajabi, Teachable), the code and data belong 100% to the business.

---

> *Built with passion, study, and a vision for the future of work.*
