# CodeReviewAI

A Serverless React Application that automates code reviews using the Google Gemini 2.5 Flash API. This project demonstrates how to build a robust AI-powered tool without a dedicated backend server by utilizing the Gemini Web SDK and structured JSON output.

## 🚀 Features

- **Drag & Drop Upload**: Support for common source code files (JS, TS, Python, etc.).
- **Deep AI Analysis**: Uses `gemini-2.5-flash` to check for:
  - Readability & Maintainability
  - Security Vulnerabilities
  - Code Smells & Anti-patterns
  - Potential Bugs
- **Structured Reports**: Visual dashboard with score charts and actionable issue lists.
- **History Tracking**: Saves previous reviews using local browser storage (simulated database).
- **Responsive UI**: Built with Tailwind CSS for a modern, clean developer experience.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai` SDK)
- **Visualization**: Recharts
- **Icons**: Lucide React

## 📦 Project Structure

```
├── components/          # UI Components
│   ├── FileUpload.tsx   # Dropzone and loading state
│   ├── Layout.tsx       # Sidebar and main shell
│   └── ReviewDashboard.tsx # Results visualization
├── services/            # Logic Layer
│   ├── geminiService.ts # AI Prompting & Schema validation
│   └── storageService.ts # LocalStorage "Database"
├── types.ts             # TypeScript Interfaces
├── App.tsx              # Main State Controller
└── index.tsx            # Entry Point
```

## 🔧 Setup & Running

1. **API Key**: You need a valid Google Gemini API Key.
   - The application expects `process.env.API_KEY` to be available.
   - In a sandbox environment, ensure this environment variable is set.
   
2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm start
   ```

4. **Usage**:
   - Open the app in your browser.
   - Click "New Review".
   - Drag a code file (e.g., `App.tsx` or `server.py`) into the drop zone.
   - Wait for Gemini to analyze and generate the report.

## 🧠 LLM Prompt Strategy

The backend service uses a strict **JSON Schema** to force Gemini to return structured data. This avoids parsing errors common with free-text LLM responses.

**Internal System Instruction:**
> "You are a senior principal software engineer... Focus on Readability, Modularity, Code Smells, Bugs, Best Practices, and Security."

## ⚠️ Notes

- **Client-Side Limitation**: For a production app, the API calls should be proxied through a backend server to keep your API key secret. This project uses client-side calls for demonstration purposes.
- **File Size**: Limited to ~50KB text files for browser performance.
