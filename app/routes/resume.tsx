import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import { useImageLoader } from "~/hooks/use-image-loader";
import resumeService from "~/lib/resume.service";
import validationService from "~/lib/validation.service";
import logger from "~/lib/logger";

export const meta = () => ([
    { title: 'ResumeAI | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    useAuthGuard();
    const { fs } = usePuterStore();
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { imageUrl: imageUrlFromHook, isLoading: imageLoading } = useImageLoader(
        resume?.imagePath || ''
    );

    useEffect(() => {
        if (!id || !validationService.validateResumeId(id)) {
            setError('Invalid resume ID');
            setIsLoading(false);
            return;
        }

        let resumeUrlToCleanup: string | null = null;

        const loadResume = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const loadedResume = await resumeService.loadResume(id);
                
                if (!loadedResume) {
                    setError('Resume not found');
                    setIsLoading(false);
                    return;
                }

                setResume(loadedResume);

                const resumeBlob = await fs.read(loadedResume.resumePath);
                if (!resumeBlob) {
                    throw new Error('Failed to load resume PDF');
                }

                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                const url = URL.createObjectURL(pdfBlob);
                resumeUrlToCleanup = url;
                setResumeUrl(url);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load resume';
                setError(errorMessage);
                logger.error('Failed to load resume:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadResume();

        return () => {
            if (resumeUrlToCleanup) {
                URL.revokeObjectURL(resumeUrlToCleanup);
            }
        };
    }, [id, fs]);

    if (isLoading || imageLoading) {
        return (
            <main className="!pt-0 min-h-screen flex items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading resume" />
            </main>
        );
    }

    if (error || !resume) {
        return (
            <main className="!pt-0 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error || 'Resume not found'}</p>
                    <Link to="/" className="primary-button w-fit">
                        Back to Homepage
                    </Link>
                </div>
            </main>
        );
    }

    const feedback = resume.feedback;

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button" aria-label="Back to homepage">
                    <img src="/icons/back.svg" alt="" className="w-2.5 h-2.5" aria-hidden="true" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section page-background h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrlFromHook && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="Open resume PDF in new tab">
                                <img
                                    src={imageUrlFromHook}
                                    className="w-full h-full object-contain rounded-2xl"
                                    alt={`Resume preview for ${resume.companyName || resume.jobTitle || 'application'}`}
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h2 className="text-4xl !text-black font-bold mb-6">Detailed Resume Analysis</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <img src="/images/resume-scan-2.gif" className="w-full" alt="Processing resume" />
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume