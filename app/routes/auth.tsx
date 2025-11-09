import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: 'ResumeAI | Sign In' },
    { name: 'description', content: 'Sign in to access your resume analysis dashboard and track your job applications.' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="page-background min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg md:max-w-xl">
                <div className="gradient-border shadow-xl">
                    <section className="flex flex-col gap-8 bg-white rounded-2xl p-12 md:p-16">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                                <svg 
                                    className="w-12 h-12 text-primary-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Welcome Back</h1>
                            <h2 className="text-lg md:text-xl text-gray-600 max-w-md">
                                {auth.isAuthenticated 
                                    ? "You're signed in. Access your resume dashboard to continue optimizing your job search."
                                    : "Sign in to access your resume dashboard and continue optimizing your job search."
                                }
                            </h2>
                        </div>
                        <div className="flex flex-col gap-3">
                            {isLoading ? (
                                <button className="auth-button animate-pulse" disabled>
                                    <p>Signing you in...</p>
                                </button>
                            ) : (
                                <>
                                    {auth.isAuthenticated ? (
                                        <>
                                            <button 
                                                className="auth-button hover:primary-gradient-hover transition-all" 
                                                onClick={() => navigate('/')}
                                            >
                                                <p>Go to Dashboard</p>
                                            </button>
                                            <button 
                                                className="secondary-button text-xl py-3.5 font-semibold" 
                                                onClick={auth.signOut}
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            className="auth-button hover:primary-gradient-hover transition-all" 
                                            onClick={auth.signIn}
                                        >
                                            <p>Sign In</p>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Auth