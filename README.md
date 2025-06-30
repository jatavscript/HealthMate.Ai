# 🧠 HealthMate.AI – Your Smart Post-Hospital Recovery Assistant

HealthMate.AI is an AI-powered healthcare assistant designed to support patients after hospital discharge. By blending advanced AI, secure data storage, personalized multimedia, and voice-based interaction, HealthMate.AI offers an intelligent, compassionate recovery experience at scale.

> 🏆 **Built during the **Bolt.new Hackathon 2025**, HealthMate.AI reimagines post-care with automation, accessibility, and human-like support.**


---

## 🚀 Project Highlights

### 🩺 What It Does
HealthMate.AI acts as a personal recovery assistant for patients, offering:
- Daily health check-ins
- Symptom and medication tracking
- Personalized AI video messages
- Smart diet and exercise suggestions
- Voice-based interaction with an AI assistant
- Multilingual support
- Secure and decentralized storage of medical records

---

## 💡 Problem Statement

After hospital discharge, many patients lack guidance and emotional support. They forget medications, skip follow-ups, or misinterpret instructions. This gap in post-care often leads to complications or re-hospitalization.

**HealthMate.AI fills this gap** by providing real-time, AI-assisted care from the comfort of home — with accountability, empathy, and technology.

---

## 🧠 Key Features

| Feature                       | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| 🧾 Smart Recovery Tracker     | Daily updates for vitals, pain level, appetite, sleep, and energy           |
| 🗣️ Voice Assistant             | Realistic voice interaction using **ElevenLabs AI**                          |
| 🍽️ Health Suggestions         | Auto-generated diet/exercise plans based on condition                       |
| 🔒 Decentralized Health Logs  | Medical record storage with **IPFS & Algorand** for privacy and integrity   |
| 🌐 Multilingual Support       | Real-time translations via **Lingo**                                        |
| 📈 Visual Dashboards          | Insightful charts for doctors and caregivers to monitor progress            |
| 🧠 Emotion-Aware Design       | Sends motivational messages, reminders, and wellbeing tips                  |

---

## 🛠️ Tech Stack & Architecture

### 🧩 Frontend
- **Vite** – Lightning-fast frontend build tool
- **React + TypeScript** – Component-based architecture (`App.tsx`, `main.tsx`)
- **Tailwind CSS** – Utility-first styling (`tailwind.config.js`)
- **PostCSS** – CSS pre-processing
- **React Context API** – Global state management (`contexts/`)
- **React Router** – (Assumed in `pages/` directory structure)

### 📦 Backend
- **Bolt Pro SDK** – Full-stack SDK to manage frontend + backend APIs
- **Node.js + Express (via Bolt)** – Server-side routing and logic
- **SQLite** – Lightweight, fast local database (`database.sqlite`)
- **TypeScript for Backend** – Backend uses `.ts` for strong typing

### 🧪 Dev Tooling & Config
- **Vite Config** – (`vite.config.ts`) for project-level build settings
- **ESLint** – Linting for cleaner code (`eslint.config.js`)
- **TypeScript Configs** – Shared + Node + App configs for separate scopes
- **.env.example** – Environment variable management


---



## ⚙️ How It Works

1. **User Onboarding** – Register and input health history.
2. **Personalized Recovery Plan** – AI generates a recovery path based on condition.
3. **Daily Monitoring** – Patients input vitals and receive automated feedback.
4. **Voice Assistant** – Ask questions, set reminders, or check progress via ElevenLabs AI.
5. **Tavus Video Messaging** – Receives personalized recovery tips and encouragement.
6. **Secure Data Logging** – All interactions saved on IPFS and Algorand securely.
7. **Caregiver Access** – Doctors and family members can track progress visually.

---

## 🧪 Future Enhancements

- 📱 Wearable integrations (Fitbit, Apple Watch)
- 🧑‍⚕️ Telehealth/doctor chat features
- 🆘 Emergency alert system using anomaly detection
- 📴 Offline support for rural health zones

---

## 👨‍💻 Team & Credits

**Team Leader:** Ajay Jatav & Harsh Mistry 
**Hackathon:** Bolt.new Hackathon 2025  
**Built With:** Bolt SDK, React, TypeScript, Tailwind, ElevenLabs, IPFS, Algorand, Tavus, RevenueCat, and more.

---

## 📜 License

This project is for demonstration and academic purposes only.  
For production use in healthcare, further compliance (e.g., HIPAA, GDPR) is required.

---

## 🔗 Project Links

- 🔥 **Devpost:** https://devpost.com/software/healthmate-ai-2deq5k?ref_content=my-projects-tab&ref_feature=my_projects
- 🌐 **Live Demo:** https://idyllic-flan-d7533b.netlify.app/
- 📹 **Demo Video:** https://youtu.be/TLK5fV4T3NI?si=70TmagAhEr_XxIFD
- 💻 **Source Code:** https://github.com/jatavscript/HealthMate.Ai.git

---

> **HealthMate.AI – Because care shouldn’t stop at discharge.**
