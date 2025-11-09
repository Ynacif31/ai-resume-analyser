import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import resumeService from "~/lib/resume.service";
import logger from "~/lib/logger";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResumeAI - Elevate Your Job Search" },
    { name: "description", content: "Track your applications and optimize your resume with AI-powered insights. Get intelligent feedback to enhance your profile and land your dream job." },
  ];
}

export default function Home() {
  useAuthGuard();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        setError(null);
        const loadedResumes = await resumeService.listResumes();
        setResumes(loadedResumes);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load resumes';
        setError(errorMessage);
        logger.error('Failed to load resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, []);

  return <main className="page-background min-h-screen">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Elevate Your Job Search: Track Applications & Optimize Your Resume</h1>
        {!loadingResumes && resumes?.length === 0 ? (
          <h2>Get started by uploading your first resume to receive AI-powered insights and actionable feedback.</h2>
        ) : (
          <h2>Gain a competitive edge with intelligent analysis. Review your submissions and receive personalized recommendations to enhance your profile.</h2>
        )}
      </div>
      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading resumes" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <p className="text-error-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="primary-button w-fit text-xl font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {!loadingResumes && !error && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && !error && resumes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Your Resume
          </Link>
        </div>
      )}
    </section>
  </main>
}