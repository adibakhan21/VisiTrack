
# VisiTrack - Facial Recognition Visitor System

**VisiTrack** is an AI-powered visitor tracking and security dashboard designed to manage entry logs via facial recognition.

Originally developed at **IIT Kanpur (Public Policy and Opinion Cell)**, this application demonstrates the client-facing interface of a system capable of real-time face detection, demographic analysis, and automated logging.

---

## 🚀 Features

- **📊 Interactive Dashboard**: Real-time visualization of visitor traffic, category breakdowns (Students, Faculty, Staff), and system health status.
- **📷 Live Face Scanner**: Integrates with the device webcam to capture visitor images.
- **🤖 AI Analysis (Gemini Powered)**:
  - Uses **Google Gemini 2.5 Flash** to simulate the backend recognition engine.
  - Estimates demographics (Age, Gender, Emotion).
  - Simulates identity matching with confidence scores.
- **📝 Visitor Logs**: Searchable and filterable activity log (Check-in / Denied).
- **🗄️ Database Management**: Interface for browsing registered profiles (simulated 5k+ records).

---

## 📸 Screenshots

### Dashboard View
![Dashboard](./Screenshot%202025-12-03%20at%2011.21.09.png)
> Overview panel showing traffic analytics and system status.

---

### Live Face Scanner
![Scanner](./Screenshot%202025-12-03%20at%2011.21.18.png)
> Webcam-based facial capture and AI result preview.

---

### Visitor Logs
![Logs](./Screenshot%202025-12-03%20at%2011.21.26.png)
> Entry history with filters and status markers.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Charts**: Recharts
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Build Tool**: Vite

---

## ℹ️ Project Context & Architecture

### Original Backend (Full System)
The real system was backed by a Python pipeline:
- **Dataset Building**: Web scraping IIT Kanpur directory data.
- **Recognition Engine**:
  - FaceNet
  - dlib
  - HOG
  - SVM
  - KNN
- Achieved **90%+ accuracy** on internal data.
- **Backend**: Flask-based REST APIs for face encoding and verification.

---

### Current Repository (Web Demo)
This repository contains only the **Client-Facing Interface**.

To avoid GPU dependency and deployment complexity:
- Face inference is simulated via **Google Gemini API**
- Gemini mimics face detection and demographic analysis
- Match confidence is AI-generated to resemble real behavior

---

## 📦 Usage

1. Set your Gemini API key:
   ```bash
   export API_KEY=your_api_key_here
````

2. Install dependencies:

   ```bash
   npm install
   ```
3. Run locally:

   ```bash
   npm run dev
   ```
4. Allow **camera permission** for the scanner module.

---

## 🔐 Privacy & Security

* Webcam access is used **only** for analysis.
* No image is permanently stored in the demo version.
* AI responses are session-based only.

---

## 🧑‍💻 Developer

**Adiba Khan**
*Built in May 2025*
IIT Kanpur

