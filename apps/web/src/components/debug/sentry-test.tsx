// File: apps/web/src/components/debug/sentry-test.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { Button } from '@nibblix/ui';
import { useState } from 'react';

export function SentryTest() {
  const [loading, setLoading] = useState(false);

  const throwError = () => {
    try {
      throw new Error('Test error from frontend component');
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  const triggerBackendError = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/debug/error');
      if (!res.ok) {
        throw new Error('Backend error test');
      }
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const triggerPromiseRejection = async () => {
    try {
      await new Promise((_, reject) => {
        reject(new Error('Test promise rejection'));
      });
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sentry Test Panel</h2>
      <div className="space-y-2">
        <Button 
          onClick={throwError}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Trigger Frontend Error
        </Button>
        
        <Button 
          onClick={() => void triggerBackendError()}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Trigger Backend Error'}
        </Button>
        
        <Button 
          onClick={() => void triggerPromiseRejection()}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Trigger Unhandled Promise Rejection
        </Button>

        <Button 
          onClick={() => {
            Sentry.captureMessage('Test manual event');
            Sentry.captureException(new Error('Test manual error'));
          }}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          Send Manual Event
        </Button>
      </div>
    </div>
  );
}