/**
 * Validation service for form inputs and data validation
 */
import { FILE_CONFIG } from "~/constants/config";

interface UploadFormData {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File | null;
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

interface ValidationService {
    validateUploadForm: (data: UploadFormData) => ValidationResult;
    validateResumeId: (id: string | undefined) => boolean;
    validateFeedback: (feedback: unknown) => feedback is Feedback;
}

const validationService: ValidationService = {};

/**
 * Validates upload form data
 * @param data - Form data to validate
 * @returns Validation result with isValid flag and array of error messages
 */
validationService.validateUploadForm = (data: UploadFormData): ValidationResult => {
    const errors: string[] = [];

    if (!data.file) {
        errors.push('Resume file is required');
    } else {
        if (data.file.type !== FILE_CONFIG.ALLOWED_TYPES[0]) {
            errors.push('Only PDF files are allowed');
        }
        if (data.file.size > FILE_CONFIG.MAX_SIZE_BYTES) {
            errors.push(`File size must be less than ${FILE_CONFIG.MAX_SIZE_MB}MB`);
        }
    }

    if (!data.jobTitle?.trim()) {
        errors.push('Job title is required');
    }

    if (!data.jobDescription?.trim()) {
        errors.push('Job description is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates resume ID parameter
 * @param id - Resume ID to validate
 * @returns True if valid UUID format
 */
validationService.validateResumeId = (id: string | undefined): boolean => {
    if (!id) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

/**
 * Validates feedback structure from AI response
 * @param feedback - Feedback object to validate
 * @returns True if feedback structure is valid
 */
validationService.validateFeedback = (feedback: unknown): feedback is Feedback => {
    if (!feedback || typeof feedback !== 'object') {
        return false;
    }

    const fb = feedback as Record<string, unknown>;

    if (typeof fb.overallScore !== 'number' || fb.overallScore < 0 || fb.overallScore > 100) {
        return false;
    }

    const requiredCategories = ['ATS', 'toneAndStyle', 'content', 'structure', 'skills'];
    
    for (const category of requiredCategories) {
        if (!fb[category] || typeof fb[category] !== 'object') {
            return false;
        }

        const cat = fb[category] as Record<string, unknown>;
        if (typeof cat.score !== 'number' || cat.score < 0 || cat.score > 100) {
            return false;
        }
        if (!Array.isArray(cat.tips)) {
            return false;
        }
    }

    return true;
};

export default validationService;
