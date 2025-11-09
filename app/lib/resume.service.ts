/**
 * Resume service module
 * Handles business logic for resume operations
 */
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";
import { STATUS_MESSAGES } from "~/constants/config";
import validationService from "~/lib/validation.service";
import logger from "~/lib/logger";

interface UploadResumeData {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
}

interface UploadResumeResult {
    success: boolean;
    resumeId?: string;
    error?: string;
}

interface ResumeService {
    uploadAndAnalyze: (
        data: UploadResumeData,
        onStatusChange?: (status: string) => void
    ) => Promise<UploadResumeResult>;
    loadResume: (resumeId: string) => Promise<Resume | null>;
    listResumes: () => Promise<Resume[]>;
}

const resumeService: ResumeService = {};

/**
 * Uploads and analyzes a resume
 * @param data - Resume upload data
 * @param onStatusChange - Callback for status updates
 * @returns Result with success status and resume ID or error message
 */
resumeService.uploadAndAnalyze = async (
    data: UploadResumeData,
    onStatusChange?: (status: string) => void
): Promise<UploadResumeResult> => {
    const { fs, ai, kv } = usePuterStore.getState();

    try {
        onStatusChange?.(STATUS_MESSAGES.UPLOADING_FILE);
        const uploadedFile = await fs.upload([data.file]);
        
        if (!uploadedFile) {
            throw new Error(STATUS_MESSAGES.ERROR_UPLOAD_FILE);
        }

        onStatusChange?.(STATUS_MESSAGES.CONVERTING_TO_IMAGE);
        const imageResult = await convertPdfToImage(data.file);
        
        if (!imageResult.file || imageResult.error) {
            throw new Error(imageResult.error || STATUS_MESSAGES.ERROR_CONVERT_PDF);
        }

        onStatusChange?.(STATUS_MESSAGES.UPLOADING_IMAGE);
        const uploadedImage = await fs.upload([imageResult.file]);
        
        if (!uploadedImage) {
            throw new Error(STATUS_MESSAGES.ERROR_UPLOAD_IMAGE);
        }

        onStatusChange?.(STATUS_MESSAGES.PREPARING_DATA);
        const uuid = generateUUID();
        const resumeData = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: data.companyName,
            jobTitle: data.jobTitle,
            jobDescription: data.jobDescription,
            feedback: null as Feedback | null,
        };

        await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

        onStatusChange?.(STATUS_MESSAGES.ANALYZING);
        
        let feedbackResponse: AIResponse | undefined;
        try {
            feedbackResponse = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ 
                    jobTitle: data.jobTitle, 
                    jobDescription: data.jobDescription 
                })
            );
        } catch (apiError) {
            logger.error('API call failed:', apiError);
            await kv.delete(`resume:${uuid}`);
            throw new Error('Failed to connect to AI service. Please try again.');
        }

        if (!feedbackResponse) {
            await kv.delete(`resume:${uuid}`);
            throw new Error(STATUS_MESSAGES.ERROR_ANALYZE_RESUME);
        }

        if (!feedbackResponse.message || !feedbackResponse.message.content) {
            await kv.delete(`resume:${uuid}`);
            throw new Error('Invalid response from AI service');
        }

        const feedbackText = typeof feedbackResponse.message.content === 'string'
            ? feedbackResponse.message.content
            : feedbackResponse.message.content[0]?.text || '';

        if (!feedbackText) {
            await kv.delete(`resume:${uuid}`);
            throw new Error('Empty feedback response from AI');
        }

        let parsedFeedback: Feedback;
        try {
            parsedFeedback = JSON.parse(feedbackText);
        } catch (parseError) {
            logger.error('Failed to parse AI feedback:', parseError);
            await kv.delete(`resume:${uuid}`);
            throw new Error('Invalid feedback format from AI. Please try again.');
        }

        if (!validationService.validateFeedback(parsedFeedback)) {
            await kv.delete(`resume:${uuid}`);
            throw new Error('Invalid feedback structure from AI. Please try again.');
        }

        resumeData.feedback = parsedFeedback;
        await kv.set(`resume:${uuid}`, JSON.stringify(resumeData));

        onStatusChange?.(STATUS_MESSAGES.ANALYSIS_COMPLETE);
        logger.log('Resume analysis completed:', { resumeId: uuid });

        return {
            success: true,
            resumeId: uuid
        };
    } catch (error) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error occurred';
        logger.error('Failed to upload and analyze resume:', error);
        return {
            success: false,
            error: errorMessage
        };
    }
};

/**
 * Loads a resume by ID
 * @param resumeId - Resume ID to load
 * @returns Resume data or null if not found
 */
resumeService.loadResume = async (resumeId: string): Promise<Resume | null> => {
    const { kv } = usePuterStore.getState();

    try {
        if (!validationService.validateResumeId(resumeId)) {
            logger.warn('Invalid resume ID format:', resumeId);
            return null;
        }

        const resumeData = await kv.get(`resume:${resumeId}`);
        
        if (!resumeData) {
            return null;
        }

        const parsed = JSON.parse(resumeData) as Resume;
        return parsed;
    } catch (error) {
        logger.error('Failed to load resume:', error);
        return null;
    }
};

/**
 * Lists all resumes for the current user
 * @returns Array of resumes
 */
resumeService.listResumes = async (): Promise<Resume[]> => {
    const { kv } = usePuterStore.getState();

    try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];

        if (!resumes || resumes.length === 0) {
            return [];
        }

        const parsedResumes = resumes
            .map((resume) => {
                try {
                    return JSON.parse(resume.value) as Resume;
                } catch (error) {
                    logger.error('Failed to parse resume:', error);
                    return null;
                }
            })
            .filter((resume): resume is Resume => resume !== null);

        return parsedResumes;
    } catch (error) {
        logger.error('Failed to list resumes:', error);
        return [];
    }
};

export default resumeService;
