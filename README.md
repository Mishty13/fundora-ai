# Fundora AI

### AI-Powered Startup Funding Intelligence for Founders and Investors

Fundora AI is a full-stack startup funding intelligence platform designed to help founders become investor-ready and help investors discover and evaluate startups more effectively.

The platform combines deterministic scoring algorithms, structured startup and investor profiles, bidirectional matching, pitch intelligence, funding-readiness analysis, personalized improvement roadmaps, and generative AI powered by IBM watsonx.ai.

Fundora AI supports both sides of the startup funding ecosystem:

- **Founders** receive readiness assessments, pitch intelligence, improvement roadmaps, investor matches, and personalized AI funding advice.
- **Investors** receive startup matches, transparent compatibility scores, deterministic match explanations, and AI-generated startup investment briefs.

---

## The Problem

Startup fundraising is often fragmented, subjective, and inefficient.

Founders frequently struggle with questions such as:

- Is my startup actually investor-ready?
- What weaknesses should I fix before fundraising?
- Is my pitch strong enough?
- Which investors are genuinely compatible with my startup?
- What should I improve first?

At the same time, investors face their own challenges:

- How can promising startups be discovered efficiently?
- Why is a particular startup considered a good match?
- What are the strongest investment signals?
- Which risks require further due diligence?
- What questions should be asked before moving forward?

Fundora AI addresses these challenges through a unified intelligence platform built for both founders and investors.

---

## Core Features

### Founder Intelligence

#### Startup Profile

Founders create a structured startup profile containing information such as:

- Startup name and tagline
- Industry and business model
- Startup stage
- Location
- Team size
- Revenue and funding information
- Target raise
- Product and traction details

This profile becomes the foundation for Fundora's intelligence features.

#### Funding Readiness Assessment

Fundora evaluates startup readiness using a deterministic scoring methodology.

The assessment helps identify strengths and weaknesses across key dimensions of investor readiness and produces transparent, reproducible results.

#### Pitch Intelligence

Founders can analyze their pitch information to identify:

- Strong sections
- Missing information
- Weak areas
- Improvement opportunities
- Investor-facing gaps

The analysis is designed to improve the quality and completeness of fundraising communication.

#### Improvement Roadmap

Based on startup readiness and pitch analysis, Fundora creates a prioritized roadmap to help founders improve their investor readiness systematically.

#### Investor Matching

Fundora matches startups with investors using deterministic compatibility scoring.

Matching can consider dimensions such as:

- Industry alignment
- Startup-stage alignment
- Geography compatibility
- Investment-range compatibility
- Other structured profile preferences

Each match includes an overall score, dimension-level scores, and human-readable reasons explaining why the match occurred.

#### AI Funding Advisor

The AI Funding Advisor uses real startup data and existing Fundora intelligence outputs to generate personalized fundraising guidance.

It combines context from:

- Startup profile
- Funding readiness assessment
- Pitch analysis
- Improvement roadmap

The advisor is powered by IBM watsonx.ai and is designed to provide evidence-based guidance without replacing Fundora's deterministic scoring methodologies.

---

### Investor Intelligence

#### Investor Profile

Investors can create structured profiles containing investment preferences such as:

- Preferred industries
- Preferred startup stages
- Geographic preferences
- Minimum investment amount
- Maximum investment amount
- Investment thesis and other relevant criteria

#### Startup Matching

Fundora identifies startups aligned with an investor's structured preferences.

Each result provides:

- Overall match score
- Dimension-level compatibility scores
- Transparent match explanations
- Relevant startup information

#### AI Startup Investment Brief

For each matched startup, investors can generate an AI-powered investment brief containing:

- Investment thesis
- Three key strengths
- Three due-diligence concerns
- Three questions to ask the founder
- Balanced investor perspective

The AI brief uses only the available startup and matching context and is explicitly instructed not to invent revenue, traction, customers, funding, market size, team information, or other unsupported facts.

---

## IBM watsonx.ai Integration

Fundora AI integrates IBM watsonx.ai as its generative AI intelligence layer.

### Foundation Model

```text
meta-llama/llama-3-3-70b-instruct
```

### IBM AI-Powered Features

IBM watsonx.ai powers two major features:

1. **AI Funding Advisor for founders**
2. **AI Startup Investment Brief for investors**

The application uses a centralized Watsonx service layer so that model communication, authentication, error handling, and response processing remain separated from the main application logic.

### AI Architecture

```text
Founder
   |
   v
Startup Profile
   |
   +----> Funding Readiness Assessment
   |
   +----> Pitch Intelligence
   |
   +----> Improvement Roadmap
   |
   +----> Investor Matching
   |
   v
AI Funding Advisor
   |
   v
IBM watsonx.ai
   |
   v
Llama 3.3 70B Instruct
```

```text
Investor
   |
   v
Investor Profile
   |
   v
Startup Matching
   |
   +----> Overall Match Score
   |
   +----> Dimension Scores
   |
   +----> Match Explanations
   |
   v
AI Startup Investment Brief
   |
   v
IBM watsonx.ai
   |
   v
Llama 3.3 70B Instruct
```

---

## Responsible AI Design

Fundora AI separates deterministic decision-support algorithms from generative AI.

The generative AI layer does not replace or recalculate Fundora's deterministic:

- Funding-readiness scores
- Startup-investor match scores
- Dimension-level compatibility scores

Instead, AI is used to interpret available context and generate personalized guidance.

The AI prompts are designed to:

- Use only explicitly available information
- Avoid inventing startup facts
- Treat missing information as unknown
- Separate positive signals from risks
- Generate due-diligence questions from actual gaps
- Avoid guaranteed investment recommendations
- Provide decision support rather than financial advice

---

## System Architecture

```text
                         +----------------------+
                         |      React + Vite    |
                         |       Frontend       |
                         +----------+-----------+
                                    |
                                    | REST API
                                    v
                         +----------------------+
                         |       FastAPI        |
                         |       Backend        |
                         +----+------------+----+
                              |            |
                              |            |
                              v            v
                    +--------------+   +------------------+
                    |   Supabase   |   | IBM watsonx.ai   |
                    |              |   |                  |
                    | Auth         |   | Llama 3.3 70B    |
                    | PostgreSQL   |   | Instruct         |
                    +--------------+   +------------------+
```

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Motion
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- HTTPX

### Database and Authentication

- Supabase
- PostgreSQL
- Supabase Authentication

### Artificial Intelligence

- IBM watsonx.ai
- Meta Llama 3.3 70B Instruct

### Deployment

- Render for the backend API
- Vercel for the frontend
- Supabase for database and authentication
- IBM Cloud for watsonx.ai inference

---

## Project Structure

```text
fundora-ai/
|
|-- backend/
|   |-- app/
|   |   |-- api/
|   |   |   |-- dependencies/
|   |   |   `-- routes/
|   |   |
|   |   |-- core/
|   |   |-- engines/
|   |   |-- integrations/
|   |   |-- models/
|   |   |-- repositories/
|   |   |-- schemas/
|   |   `-- services/
|   |
|   |-- tests/
|   |-- .env.example
|   `-- requirements.txt
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- config/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- lib/
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- founder/
|   |   |   `-- investor/
|   |   |
|   |   |-- services/
|   |   `-- utils/
|   |
|   |-- .env.example
|   `-- package.json
|
|-- .gitignore
`-- README.md
```

---

## API Overview

Fundora exposes REST API endpoints for:

- Authentication and user context
- Health checks
- Funding readiness
- Pitch analysis
- Improvement roadmaps
- Investor profiles
- Founder-investor matching
- AI Funding Advisor
- AI Startup Investment Brief

Sensitive AI endpoints require authentication.

Temporary unauthenticated AI testing endpoints used during development are removed before deployment.

---

## Security

Fundora AI implements several security practices:

- Supabase-based authentication
- Bearer-token authentication for protected backend routes
- Role-based frontend route protection
- Authorization checks for investor-startup matches
- Server-side IBM API credentials
- Server-side Supabase secret credentials
- Environment-based secret management
- `.env` files excluded from Git
- No IBM API keys exposed to the frontend
- No Supabase secret/service-role key exposed to the frontend
- Protected AI generation endpoints

---

## Local Development

### Prerequisites

Make sure you have installed:

- Python 3.11 or later
- Node.js and npm
- Git

You also need:

- A Supabase project
- IBM Cloud credentials
- Access to an IBM watsonx.ai project and supported foundation model

---

### Clone the Repository

```bash
git clone https://github.com/Mishty13/fundora-ai.git
cd fundora-ai
```

---

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file based on `.env.example` and provide the required environment variables.

Example:

```env
APP_NAME=Fundora AI API
APP_VERSION=1.0.0
ENVIRONMENT=development
API_V1_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SECRET_KEY=your_secret_key_here

IBM_API_KEY=your_ibm_cloud_api_key_here
IBM_PROJECT_ID=your_watsonx_project_id_here
IBM_MODEL_ID=meta-llama/llama-3-3-70b-instruct
IBM_WATSONX_URL=https://au-syd.ml.cloud.ibm.com
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

The API will be available locally at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Run the frontend:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## Testing

Backend tests are included for core deterministic intelligence components, including:

- Funding readiness engine
- Pitch extraction
- Pitch methodology

Run the backend test suite with:

```bash
pytest
```

---

## Screenshots

Screenshots of the following interfaces can be added here:

- Landing page
- Founder dashboard
- Startup profile
- Funding readiness assessment
- Pitch intelligence
- Improvement roadmap
- Investor matching
- AI Funding Advisor
- Investor dashboard
- Startup matching
- AI Startup Investment Brief

---

## Future Scope

Potential future enhancements include:

- Persistent AI advice history
- Persistent investment brief history
- Advanced startup analytics
- Investor portfolio intelligence
- Founder-investor communication workflows
- Notification systems
- Explainable ranking dashboards
- Additional AI-assisted due-diligence workflows
- Multilingual founder support

---

## Disclaimer

Fundora AI is a decision-support platform. Its AI-generated content is intended for informational and analytical assistance only and should not be considered financial, investment, legal, or professional advice.

Investment decisions should involve independent due diligence and appropriate professional consultation.

---

## IBM SkillsBuild Project

Fundora AI was developed as part of an IBM SkillsBuild learning and project experience.

The project demonstrates practical integration of:

- Generative AI
- IBM watsonx.ai
- Foundation models
- Full-stack application development
- REST API architecture
- Authentication and authorization
- Deterministic scoring methodologies
- Responsible AI-assisted decision support

---

## Author

**Mishty Giri**

B.Tech Computer Science student focused on AI, data science, cybersecurity, business analysis, and technology-driven product development.

---

## Repository

GitHub: `Mishty13/fundora-ai`

---

## License

This project is currently provided for educational, demonstration, and portfolio purposes.