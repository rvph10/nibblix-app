import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate a backend error
    throw new Error('Test error from backend API');
  } catch (error) {
    // Capture the error in Sentry
    Sentry.captureException(error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}