/**
 * Custom hook for authentication guard
 * Redirects to auth page if user is not authenticated
 */
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

interface UseAuthGuardOptions {
    redirectTo?: string;
    requireAuth?: boolean;
}

/**
 * Hook to guard routes that require authentication
 * @param options - Configuration options
 * @returns Authentication state and loading status
 */
export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
    const { redirectTo = '/auth', requireAuth = true } = options;
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && requireAuth && !auth.isAuthenticated) {
            const currentPath = window.location.pathname;
            const nextParam = currentPath !== '/' ? `?next=${currentPath}` : '';
            navigate(`${redirectTo}${nextParam}`);
        }
    }, [isLoading, auth.isAuthenticated, navigate, redirectTo, requireAuth]);

    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading
    };
};
