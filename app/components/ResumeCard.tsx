import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useImageLoader } from "~/hooks/use-image-loader";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { imageUrl, isLoading } = useImageLoader(imagePath);
    const overallScore = feedback?.overallScore ?? 0;

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    {feedback ? (
                        <ScoreCircle score={overallScore} />
                    ) : (
                        <div className="w-[100px] h-[100px] flex items-center justify-center">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="gradient-border animate-in fade-in duration-1000 flex items-center justify-center h-[350px] max-sm:h-[200px]">
                    <img src="/images/resume-scan-2.gif" className="w-[100px]" alt="Loading resume" />
                </div>
            ) : imageUrl ? (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            src={imageUrl}
                            alt={`Resume for ${companyName || jobTitle || 'application'}`}
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                        />
                    </div>
                </div>
            ) : null}
        </Link>
    )
}
export default ResumeCard