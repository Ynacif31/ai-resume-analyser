import { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { useAuthGuard } from "~/hooks/use-auth-guard";
import resumeService from "~/lib/resume.service";
import validationService from "~/lib/validation.service";
import logger from "~/lib/logger";

const Upload = () => {
    useAuthGuard();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
        setValidationErrors([]);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        
        const formData = new FormData(form);
        const companyName = (formData.get('company-name') as string) || '';
        const jobTitle = (formData.get('job-title') as string) || '';
        const jobDescription = (formData.get('job-description') as string) || '';

        const validation = validationService.validateUploadForm({
            companyName,
            jobTitle,
            jobDescription,
            file
        });

        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        if (!file) {
            setValidationErrors(['File is required']);
            return;
        }

        setIsProcessing(true);
        setValidationErrors([]);

        const result = await resumeService.uploadAndAnalyze(
            {
                companyName,
                jobTitle,
                jobDescription,
                file
            },
            setStatusText
        );

        if (result.success && result.resumeId) {
            navigate(`/resume/${result.resumeId}`);
        } else {
            const errorMessage = result.error || 'An error occurred during analysis. Please try again.';
            setStatusText('');
            setValidationErrors([errorMessage]);
            setIsProcessing(false);
            logger.error('Resume analysis failed:', errorMessage);
        }
    };

    return (
        <main className="page-background min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Optimize Your Resume with AI-Powered Insights</h1>
                    {isProcessing ? (
                        <>
                            <h2 className="text-primary-600">{statusText || 'Processing your resume...'}</h2>
                            <img src="/images/resume-scan.gif" className="w-full max-w-md mx-auto" alt="Processing resume" />
                        </>
                    ) : (
                        <h2>Upload your resume to receive an ATS compatibility score and personalized improvement recommendations.</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            {validationErrors.length > 0 && (
                                <div className="bg-badge-red border border-error-500/30 rounded-lg p-4">
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationErrors.map((error, index) => (
                                            <li key={index} className="text-badge-red-text text-sm">{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name (Optional)</label>
                                <input 
                                    type="text" 
                                    name="company-name" 
                                    placeholder="e.g., Google, Microsoft, Amazon" 
                                    id="company-name"
                                    aria-label="Company name"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title *</label>
                                <input 
                                    type="text" 
                                    name="job-title" 
                                    placeholder="e.g., Senior Software Engineer, Product Manager" 
                                    id="job-title"
                                    required
                                    aria-label="Job title"
                                    aria-required="true"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description *</label>
                                <textarea 
                                    rows={5} 
                                    name="job-description" 
                                    placeholder="Paste the job description here to get personalized recommendations..." 
                                    id="job-description"
                                    required
                                    aria-label="Job description"
                                    aria-required="true"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume *</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit" disabled={isProcessing}>
                                Analyze & Get Feedback
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload