# ResumeAI - AI-Powered Resume Analysis Platform

A modern, full-stack web application for analyzing resumes with AI-powered insights, ATS compatibility scoring, and personalized feedback to help job seekers optimize their resumes.

## 🚀 Features

- **AI-Powered Analysis**: Get comprehensive feedback on your resume using Claude Sonnet 4
- **ATS Compatibility Score**: Understand how well your resume will perform in Applicant Tracking Systems
- **Multi-Category Evaluation**: Detailed analysis across:
  - Professional Tone & Style
  - Content Quality
  - Document Structure
  - Skills Alignment
- **Resume Tracking**: Manage multiple resumes and track applications
- **Professional UI**: Clean, modern interface with responsive design
- **Real-time Processing**: Live status updates during resume analysis

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router 7** - Full-stack framework with SSR
- **TypeScript 5.9** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management

### Build Tools
- **Vite 7** - Fast build tool and dev server
- **TypeScript** - Static type checking

### Libraries
- **PDF.js** - PDF processing and conversion
- **React Dropzone** - File upload with drag & drop
- **clsx & tailwind-merge** - CSS class utilities

### Backend & Services
- **Puter.com SDK** - Cloud platform providing:
  - Authentication (OAuth)
  - File System (storage)
  - AI API (Claude Sonnet 4)
  - Key-Value Store (data persistence)

## 📋 Prerequisites

- Node.js 18+ 
- npm, pnpm, or bun
- Puter.com account (for cloud services)

## 🏃 Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📁 Project Structure

```
app/
├── components/          # React components
│   ├── ErrorBoundary.tsx
│   ├── ResumeCard.tsx
│   ├── Summary.tsx
│   ├── ATS.tsx
│   └── ...
├── routes/             # Page routes
│   ├── home.tsx
│   ├── upload.tsx
│   ├── resume.tsx
│   └── auth.tsx
├── lib/                # Core libraries
│   ├── resume.service.ts
│   ├── validation.service.ts
│   ├── pdf2img.ts
│   ├── puter.ts
│   └── logger.ts
├── hooks/              # Custom React hooks
│   ├── use-auth-guard.ts
│   └── use-image-loader.ts
├── constants/          # Configuration and constants
│   └── config.ts
├── types/              # TypeScript type definitions
│   └── index.d.ts
└── app.css             # Global styles
```

## 🎨 Design System

The application uses a professional blue color palette:

- **Primary Colors**: Corporate blue (#2563EB, #1D4ED8)
- **Neutral Colors**: Gray scale for text and backgrounds
- **Status Colors**: Green (success), Yellow (warning), Red (error)
- **Typography**: Mona Sans and Inter fonts

## 🔐 Authentication

Authentication is handled through Puter.com OAuth. Users must sign in to:
- Upload and analyze resumes
- View their resume dashboard
- Access personalized feedback

## 📝 Usage

1. **Sign In**: Authenticate using Puter.com OAuth
2. **Upload Resume**: Upload a PDF resume with job details
3. **Get Analysis**: Receive AI-powered feedback and ATS score
4. **Review Feedback**: Explore detailed recommendations by category
5. **Track Applications**: Manage multiple resumes and applications

## 🐛 Error Handling

The application includes comprehensive error handling:
- API error recovery with automatic cleanup
- User-friendly error messages
- Error boundaries for React component errors
- Validation for all user inputs

## 📦 Key Dependencies

- `react-router`: ^7.9.2
- `react`: ^19.1.1
- `typescript`: ^5.9.2
- `tailwindcss`: ^4.1.13
- `zustand`: ^5.0.8
- `pdfjs-dist`: ^5.4.394

## 🚢 Deployment

The application can be deployed to any platform supporting Node.js:

- **Vercel**
- **Netlify**
- **Railway**
- **Fly.io**
- **AWS/Google Cloud/Azure**

Build output structure:
```
build/
├── client/    # Static assets
└── server/    # Server-side code
```

## 📄 License

Private project - All rights reserved

## 👨‍💻 Development

Built with modern web technologies following best practices:
- Clean Code principles
- SOLID design patterns
- Service Module Pattern
- Component-based architecture
- Type-safe development

---

Built with ❤️ using React Router 7, TypeScript, and Tailwind CSS.
