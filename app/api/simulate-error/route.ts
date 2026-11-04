import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = parseInt(searchParams.get('status') || '500', 10);
  const type = searchParams.get('type') || 'INTERNAL_SERVER_ERROR';
  const customMessage = searchParams.get('message');

  const errorCatalog: Record<number, { code: string; defaultMsg: string }> = {
    400: { code: 'BAD_REQUEST', defaultMsg: 'Invalid report parameters provided in request payload' },
    401: { code: 'UNAUTHORIZED', defaultMsg: 'Authentication token is expired or invalid' },
    403: { code: 'FORBIDDEN', defaultMsg: 'User does not have permission to access client reporting data' },
    404: { code: 'NOT_FOUND', defaultMsg: 'Requested report dataset not found on storage cluster' },
    422: { code: 'UNPROCESSABLE_ENTITY', defaultMsg: 'CSV schema validation failed for Shopify & GA4 metrics' },
    429: { code: 'TOO_MANY_REQUESTS', defaultMsg: 'API rate limit exceeded (120 req/min). Please back off' },
    500: { code: 'INTERNAL_SERVER_ERROR', defaultMsg: 'Database connection pool timed out while compiling analytics' },
    502: { code: 'BAD_GATEWAY', defaultMsg: 'Upstream microservice (analytics-engine-v2) failed to respond' },
    503: { code: 'SERVICE_UNAVAILABLE', defaultMsg: 'Report generation cluster is undergoing scheduled maintenance' },
    504: { code: 'GATEWAY_TIMEOUT', defaultMsg: 'Gateway timed out waiting for AI summary response (>30000ms)' },
  };

  const info = errorCatalog[status] || { code: type, defaultMsg: 'An unexpected system fault occurred' };
  const message = customMessage || info.defaultMsg;

  return NextResponse.json(
    {
      success: false,
      error: {
        code: info.code,
        status,
        message,
        timestamp: new Date().toISOString(),
        requestId: `req_${Math.random().toString(36).substring(2, 12)}`,
        traceId: `trace_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        service: 'reportli-saas-core',
      },
    },
    { status }
  );
}

export async function POST(req: NextRequest) {
  return GET(req);
}
