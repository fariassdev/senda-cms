import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 *
 * Used by monitoring systems and load balancers to verify application health.
 * No authentication required for monitoring accessibility.
 *
 * @returns JSON response with status and timestamp
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
    },
    { status: 200 },
  );
}
