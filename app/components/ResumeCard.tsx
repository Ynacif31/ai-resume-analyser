import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000 overflow-hidden">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} /> 
                </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000 flex-1 overflow-hidden">
                <div className="w-full h-full overflow-hidden">
                    <img 
                        src={imagePath}
                        alt={`Resume for ${jobTitle} at ${companyName}`}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
            </div>
        </Link>
    );
}
export default ResumeCard;