/**
 * Custom hook for loading images from file system
 * Handles memory cleanup by revoking object URLs
 */
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import logger from "~/lib/logger";

interface UseImageLoaderResult {
    imageUrl: string;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook to load image from file system path
 * Automatically handles URL cleanup to prevent memory leaks
 * @param imagePath - Path to the image file
 * @returns Image URL, loading state, and error state
 */
export const useImageLoader = (imagePath: string): UseImageLoaderResult => {
    const { fs } = usePuterStore();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!imagePath) {
            setIsLoading(false);
            return;
        }

        let url: string | null = null;
        let cancelled = false;

        const loadImage = async (): Promise<void> => {
            try {
                setIsLoading(true);
                setError(null);
                
                const blob = await fs.read(imagePath);
                
                if (!blob) {
                    throw new Error('Failed to load image: blob is null');
                }

                if (cancelled) return;

                url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (err) {
                if (!cancelled) {
                    const errorMessage = err instanceof Error 
                        ? err.message 
                        : 'Unknown error occurred while loading image';
                    setError(errorMessage);
                    logger.error('Failed to load image:', err);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            cancelled = true;
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [imagePath, fs]);

    return { imageUrl, isLoading, error };
};
