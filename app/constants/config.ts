/**
 * Application configuration constants
 */
export const FILE_CONFIG = {
    MAX_SIZE_BYTES: 20 * 1024 * 1024,
    MAX_SIZE_MB: 20,
    ALLOWED_TYPES: ['application/pdf'],
    ALLOWED_EXTENSIONS: ['.pdf']
} as const;

export const PDF_CONFIG = {
    RENDER_SCALE: 4,
    FIRST_PAGE_ONLY: true
} as const;

export const SCORE_THRESHOLDS = {
    EXCELLENT: 70,
    GOOD: 50,
    NEEDS_IMPROVEMENT: 0
} as const;

export const STATUS_MESSAGES = {
    UPLOADING_FILE: 'Uploading the file...',
    CONVERTING_TO_IMAGE: 'Converting to image...',
    UPLOADING_IMAGE: 'Uploading the image...',
    PREPARING_DATA: 'Preparing data...',
    ANALYZING: 'Analyzing...',
    ANALYSIS_COMPLETE: 'Analysis complete, redirecting...',
    ERROR_UPLOAD_FILE: 'Error: Failed to upload file',
    ERROR_CONVERT_PDF: 'Error: Failed to convert PDF to image',
    ERROR_UPLOAD_IMAGE: 'Error: Failed to upload image',
    ERROR_ANALYZE_RESUME: 'Error: Failed to analyze resume'
} as const;
