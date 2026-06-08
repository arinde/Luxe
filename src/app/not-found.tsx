import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-500/10 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>

        {/* Subtitle */}
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-slate-400 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Button */}
        <Link href="/">
          <button className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Go Back Home
          </button>
        </Link>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm mb-4">Need help?</p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Contact Support
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/help" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
