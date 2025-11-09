import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-success-600'
        : score > 49
            ? 'text-warning-600' : 'text-error-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 w-full hover:shadow-xl transition-shadow">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-dark-300">Overall Resume Score</h2>
                    <p className="text-sm text-gray-500">
                        Comprehensive evaluation based on tone, content, structure, and skills alignment.
                    </p>
                </div>
            </div>

            <Category title="Professional Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content Quality" score={feedback.content.score} />
            <Category title="Document Structure" score={feedback.structure.score} />
            <Category title="Skills Alignment" score={feedback.skills.score} />
        </div>
    )
}
export default Summary