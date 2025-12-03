# VisiTrack - Facial Recognition Visitor System

**VisiTrack** is an AI-powered visitor tracking and security dashboard designed to manage entry logs via facial recognition. 

Originally developed at **IIT Kanpur (Public Policy and Opinion Cell)**, this application demonstrates the client-facing interface of a system capable of real-time face detection, demographic analysis, and automated logging.


## 🚀 Features

- **📊 Interactive Dashboard**: Real-time visualization of visitor traffic, category breakdowns (Students, Faculty, Staff), and system health status.
- **📷 Live Face Scanner**: Integrates with the device webcam to capture visitor images.
- **🤖 AI Analysis (Gemini Powered)**: 
  - Uses **Google Gemini 2.5 Flash** to simulate the backend recognition engine.
  - Analyzes facial features to estimate demographics (Age, Gender, Emotion).
  - Simulates matching against a secure database with confidence scores.
- **📝 Visitor Logs**: A searchable and filterable history of all entry attempts (Check-In/Denied).
- **🗄️ Database Management**: UI for managing registered profiles (simulated interface for the original 5,000+ scraped dataset).

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Visualization**: Recharts
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Build Tooling**: Vite (implied environment)

## ℹ️ Project Context & Architecture

### Original Backend Implementation
The full production system was built with a Python-based backend:
- **Data Acquisition**: Scraped IIT Kanpur's internal search data to build a custom training dataset.
- **Recognition Engine**: Implemented using **FaceNet**, **dlib**, **HOG**, **SVM**, and **KNN** algorithms achieving 90%+ accuracy.
- **API**: Flask RESTful APIs handling the heavy lifting of face encoding and matching.

### Current Web Demo
This repository represents the **Client-Facing Interface**. To enable a fully functional public demo without the heavy GPU requirements of the original FaceNet backend, this version replaces the local inference engine with **Google's Gemini API**.
- When a face is scanned, the image is sent to Gemini.
- The LLM acts as the "Recognition Engine," providing demographic analysis and simulated match confidence to mimic the real-world behavior of the original VisiTrack system.

## 📦 Usage

1. **Prerequisites**: Ensure you have a valid `API_KEY` for the Gemini API set in your environment variables.
2. **Camera Access**: Allow the browser permission to access your webcam for the Face Scanner to function.
3. **Navigation**: Use the sidebar to switch between the Dashboard analytics, Live Scanner, and Logs view.

## 🛡️ Privacy & Permissions

- This app requests **Camera** permissions solely for the purpose of the live demonstration.
- No video feeds are stored permanently in this demo version; images are processed transiently for analysis.

---
*Developed by [Adiba Khan] - May 2025*
