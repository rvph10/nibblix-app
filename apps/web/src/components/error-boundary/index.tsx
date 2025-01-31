'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 p-8">
            <h1 className="text-4xl font-bold text-red-600">
              Something went wrong!
            </h1>
            <p className="text-lg text-foreground/80">
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 text-left text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}