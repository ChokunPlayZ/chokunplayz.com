import { Link } from '@tanstack/react-router'
import { Home, AlertCircle } from 'lucide-react'

export function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) px-6">
            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-(--accent)/10 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '1s' }}
                />
            </div>

            <div className="relative z-10 glass-panel max-w-lg w-full p-8 md:p-12 text-center rounded-3xl border-(--accent)/20 shadow-2xl">
                <div className="mb-6 inline-flex p-4 rounded-full bg-(--bg-secondary) text-(--error)">
                    <AlertCircle className="w-12 h-12" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) to-(--text-secondary) mb-4">
                    Page Not Found
                </h1>

                <p className="text-xl text-(--text-secondary) mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-(--accent) text-white font-medium hover:brightness-110 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}
