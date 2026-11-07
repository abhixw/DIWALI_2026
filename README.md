# The Diwali Within 🪔
> **"Every Light Has a Story."**  
> *Remember. Release. Rise.*

An AI-powered, cinematic, personalized Diwali experience that transforms visitor reflections into a deeply moving Diwali identity, custom letter, letter to future self, sacred promise, and high-resolution downloadable greeting card.

---

## ✨ Features

- **Cinematic Aesthetic & Visual System:** Handcrafted Indian festive design using deep obsidian (`#11100F`), antique gold (`#D4A64C`), warm saffron (`#E97832`), and rich terracotta maroon (`#7B3428`) with Google Fonts (*Playfair Display*, *Inter*, *Cormorant Garamond*).
- **Interactive Storytelling Journey:** 5-step intuitive questionnaire with age-adaptive questions, custom inputs, and skippable sensitive reflections.
- **Diya Lighting Climax:** Full-screen ritual where the visitor taps to light an earthen Diya, triggering expanding golden warmth, particles, and emotional revelation.
- **Groq AI Integration (`openai/gpt-oss-120b`):** Powered by OpenAI's open-weight 120B reasoning model on Groq, delivering culturally respectful, non-stereotypical, deeply authentic personal letters and identities.
- **5-Part Structured Personalization:**
  1. *Your Diwali Identity* (e.g., "The Dream Builder", "The Quiet Architect") & explanation.
  2. *Your Personal Diwali Letter* (~150-220 words) in elegant editorial typography.
  3. *Letter to Your Future Self* (time-capsule envelope to be reopened next Diwali).
  4. *Personal Promise* ("This Diwali, I promise myself...").
  5. *Personal Diwali Blessing* for friends & family.
- **Tone Refinement:** Seamless regeneration with alternative emotional voices (*Heartfelt*, *Emotional*, *Motivational*, *Poetic*, *Simple*).
- **Greeting Card Studio:** High-resolution HTML5 Canvas generator offering 3 distinct aesthetic templates (*Traditional Diwali*, *Premium Luxury*, *Minimal Elegant*) with instant PNG download and WhatsApp/Web Share API integration.
- **Privacy & Security First:** No login required, zero permanent database storage of personal reflections, and in-memory rate limiting.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`frontend/`)
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS with custom festive palette & custom glow utilities
- **Motion & Ambiance:** Framer Motion + HTML5 Canvas particle systems
- **State Management:** Zustand with `sessionStorage` persistence
- **Card Generation:** High-res HTML5 Canvas (1080x1350 portrait)
- **Icons:** Lucide React

### Backend (`backend/`)
- **Framework:** Python 3.11+ / FastAPI
- **AI SDK:** Official Groq Python SDK (`groq`)
- **Model:** `openai/gpt-oss-120b`
- **Validation:** Pydantic v2
- **Testing:** Pytest with full persona test suites
- **Server:** Uvicorn

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and paste your Groq API key:
# GROQ_API_KEY=gsk_...
# GROQ_MODEL=openai/gpt-oss-120b

# Run backend test suite
PYTHONPATH=. pytest tests/ -v

# Start development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`. Health check: `http://localhost:8000/api/health`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:8000 is present

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend health status and active Groq model |
| `POST` | `/api/story/generate` | Generates 5 personalized outputs from visitor questionnaire |
| `POST` | `/api/story/refine` | Refines story voice (*heartfelt*, *emotional*, *motivational*, *poetic*) |

---

## 🚢 Deployment

### Frontend (Vercel)
1. Import `frontend/` into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Backend (Render)
1. Deploy using the included `render.yaml` blueprint or as a Web Service.
2. Root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `GROQ_MODEL`: `openai/gpt-oss-120b`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`

---

## 🔒 Privacy & Safety
- User reflections are processed strictly in-memory and passed securely to Groq for generation.
- No personal data or sensitive reflections are logged to files or stored in a persistent database.
- Input lengths and rate limits are strictly enforced.

---

🪔 *The Diwali Within — Every Light Has a Story.*
