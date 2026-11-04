export interface SimulatedErrorEvent {
  id: string;
  category: 'Network / Fetch' | 'API 5xx Server' | 'API 4xx Client' | 'Runtime TypeError' | 'Unhandled Promise' | 'Syntax / Parsing' | 'Rate Limit & Auth';
  title: string;
  message: string;
  endpoint?: string;
  httpStatus?: number;
  timestamp: string;
  stack?: string;
  rawError?: unknown;
}

const ERROR_TEMPLATES: Array<{
  category: SimulatedErrorEvent['category'];
  title: string;
  generate: () => { message: string; endpoint?: string; httpStatus?: number; action: () => Promise<void> | void };
}> = [
  {
    category: 'Network / Fetch',
    title: 'TypeError: Failed to fetch (Network Failure)',
    generate: () => {
      const deadHost = `https://api-unreachable-dead-host-${Math.random().toString(36).substring(2, 8)}.invalid/v1/sync`;
      return {
        message: `TypeError: Failed to fetch from ${deadHost}`,
        endpoint: deadHost,
        action: async () => {
          try {
            await fetch(deadHost, { mode: 'cors' });
          } catch (err) {
            console.error('[Reportli Activity Error] Network fetch failed:', err);
            // Re-throw asynchronously so window.onerror / tracking script detects it
            setTimeout(() => {
              throw new TypeError(`Failed to fetch: Connection refused at ${deadHost}`);
            }, 0);
          }
        },
      };
    },
  },
  {
    category: 'Network / Fetch',
    title: 'Network Timeout (AbortController)',
    generate: () => {
      const endpoint = `https://httpbin.org/delay/10?t=${Date.now()}`;
      return {
        message: `DOMException: The operation was aborted due to timeout after 1500ms on ${endpoint}`,
        endpoint,
        action: async () => {
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 100);
          try {
            await fetch(endpoint, { signal: controller.signal });
          } catch (err) {
            console.error('[Reportli Activity Error] Abort/Timeout error:', err);
            setTimeout(() => {
              throw new DOMException(`Request to ${endpoint} timed out after 1500ms`, 'TimeoutError');
            }, 0);
          }
        },
      };
    },
  },
  {
    category: 'API 5xx Server',
    title: 'HTTP 500 Internal Server Error (DB Pool Exhausted)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=500&type=DB_CONNECTION_EXHAUSTED&t=${Date.now()}`;
      return {
        message: 'HTTP 500 Internal Server Error: Database connection pool timed out while compiling analytics',
        endpoint,
        httpStatus: 500,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] API 500 Failure:', data);
          setTimeout(() => {
            const err = new Error(`[API 500] Database connection pool timed out on /api/reports/compile (req_${Math.random().toString(36).substring(2, 9)})`);
            throw err;
          }, 0);
        },
      };
    },
  },
  {
    category: 'API 5xx Server',
    title: 'HTTP 502 Bad Gateway (Upstream Analytics Cluster Down)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=502&type=BAD_GATEWAY&t=${Date.now()}`;
      return {
        message: 'HTTP 502 Bad Gateway: Upstream microservice (analytics-engine-v2) failed to respond',
        endpoint,
        httpStatus: 502,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] API 502 Bad Gateway:', data);
          setTimeout(() => {
            throw new Error(`[HTTP 502] Bad Gateway: Upstream cluster failed while synthesizing client report.`);
          }, 0);
        },
      };
    },
  },
  {
    category: 'API 5xx Server',
    title: 'HTTP 504 Gateway Timeout (Shopify Sync Worker)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=504&type=GATEWAY_TIMEOUT&t=${Date.now()}`;
      return {
        message: 'HTTP 504 Gateway Timeout: Gateway timed out waiting for Shopify sync response (>30000ms)',
        endpoint,
        httpStatus: 504,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] API 504 Timeout:', data);
          setTimeout(() => {
            throw new Error(`[HTTP 504 Gateway Timeout] Shopify store sync worker failed to return in 30000ms`);
          }, 0);
        },
      };
    },
  },
  {
    category: 'API 4xx Client',
    title: 'HTTP 422 Unprocessable Entity (CSV Schema Validation Failed)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=422&type=CSV_SCHEMA_INVALID&t=${Date.now()}`;
      return {
        message: 'HTTP 422 Unprocessable Entity: CSV schema validation failed for Shopify & GA4 metrics header [Missing column "roas_target"]',
        endpoint,
        httpStatus: 422,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] API 422 Validation Error:', data);
          setTimeout(() => {
            throw new Error(`[HTTP 422] Schema mismatch: Unable to map Shopify orders to GA4 sessions`);
          }, 0);
        },
      };
    },
  },
  {
    category: 'Rate Limit & Auth',
    title: 'HTTP 429 Too Many Requests (Rate Limit Exceeded)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=429&type=RATE_LIMIT_EXCEEDED&t=${Date.now()}`;
      return {
        message: 'HTTP 429 Too Many Requests: Organization report export quota reached (120 req/min). Retry-After: 60s',
        endpoint,
        httpStatus: 429,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] API 429 Rate Limit:', data);
          setTimeout(() => {
            throw new Error(`[Rate Limit 429] Exceeded maximum automated report pulls for tier Pro`);
          }, 0);
        },
      };
    },
  },
  {
    category: 'Rate Limit & Auth',
    title: 'HTTP 401 Unauthorized (Invalid Workspace Key)',
    generate: () => {
      const endpoint = `/api/simulate-error?status=401&type=TOKEN_EXPIRED&t=${Date.now()}`;
      return {
        message: 'HTTP 401 Unauthorized: Bearer token for workspace_rpl_live_ASy3hbZ0zJYjkrvwbrun8g2PQW has expired. Re-authentication required.',
        endpoint,
        httpStatus: 401,
        action: async () => {
          const res = await fetch(endpoint);
          const data = await res.json().catch(() => ({}));
          console.error('[Reportli Activity Error] Auth 401 Error:', data);
          setTimeout(() => {
            throw new Error(`[Auth 401] Session expired for active workspace. Reportli tracking credential rejected.`);
          }, 0);
        },
      };
    },
  },
  {
    category: 'Runtime TypeError',
    title: "TypeError: Cannot read properties of undefined (reading 'conversionRate')",
    generate: () => {
      const reportId = Math.floor(Math.random() * 90000) + 10000;
      return {
        message: `TypeError: Cannot read properties of undefined (reading 'conversionRate') at ClientReportProcessor.calculateMetrics (report_${reportId}.js:142:28)`,
        action: () => {
          console.error(`[Reportli Activity Error] TypeError in report processing`);
          setTimeout(() => {
            const rawObj: any = undefined;
            // Deliberately trigger authentic TypeError
            rawObj.conversionRate.toFixed(2);
          }, 0);
        },
      };
    },
  },
  {
    category: 'Runtime TypeError',
    title: "ReferenceError: activeClientWorkspace is not defined",
    generate: () => {
      return {
        message: "ReferenceError: activeClientWorkspace is not defined at DashboardPage.syncAccounts (DashboardLayout.tsx:88:14)",
        action: () => {
          console.error(`[Reportli Activity Error] ReferenceError dispatched`);
          setTimeout(() => {
            throw new ReferenceError("activeClientWorkspace is not defined at DashboardPage.syncAccounts");
          }, 0);
        },
      };
    },
  },
  {
    category: 'Unhandled Promise',
    title: 'UnhandledPromiseRejection: Report generation pipeline worker crashed',
    generate: () => {
      const trace = `pipe_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return {
        message: `UnhandledPromiseRejection: Error: Pipeline worker [${trace}] terminated unexpectedly with exit code 137 (OOM killed during PDF compile)`,
        action: () => {
          console.error(`[Reportli Activity Error] Unhandled Promise Rejection for worker ${trace}`);
          // Dispatches an unhandled rejection that triggers window.onunhandledrejection
          Promise.reject(new Error(`[Unhandled Rejection] PDF compilation pipeline [${trace}] aborted: Out of memory.`));
        },
      };
    },
  },
  {
    category: 'Syntax / Parsing',
    title: "SyntaxError: Unexpected token '<', '<!DOCTYPE html>' is not valid JSON",
    generate: () => {
      return {
        message: "SyntaxError: Unexpected token '<', '<!DOCTYPE html>...' is not valid JSON at Response.json()",
        action: () => {
          console.error(`[Reportli Activity Error] JSON parsing failure`);
          setTimeout(() => {
            JSON.parse("<!DOCTYPE html><html><body><h1>500 Error</h1></body></html>");
          }, 0);
        },
      };
    },
  },
  {
    category: 'Unhandled Promise',
    title: 'UnhandledPromiseRejection: GA4 Token Exchange Failure',
    generate: () => {
      const oauthState = Math.random().toString(36).substring(2, 10);
      return {
        message: `UnhandledPromiseRejection: OAuthError: Google Analytics 4 token exchange failed with state=${oauthState}: invalid_grant`,
        action: () => {
          console.error(`[Reportli Activity Error] GA4 OAuth Grant Failed`);
          Promise.reject(new Error(`OAuth 2.0 Error: invalid_grant while refreshing GA4 metrics for client (${oauthState})`));
        },
      };
    },
  },
];

let lastIndex = -1;

export async function triggerSimulatedError(forcedCategory?: string): Promise<SimulatedErrorEvent> {
  // Filter by category if requested, else select a new random one different from previous
  const candidates = forcedCategory && forcedCategory !== 'ALL'
    ? ERROR_TEMPLATES.filter(t => t.category === forcedCategory)
    : ERROR_TEMPLATES;

  let chosenIndex = Math.floor(Math.random() * candidates.length);
  if (candidates.length > 1 && chosenIndex === lastIndex && !forcedCategory) {
    chosenIndex = (chosenIndex + 1) % candidates.length;
  }
  lastIndex = chosenIndex;

  const item = candidates[chosenIndex] || ERROR_TEMPLATES[0];
  const { message, endpoint, httpStatus, action } = item.generate();

  const errorEvent: SimulatedErrorEvent = {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category: item.category,
    title: item.title,
    message,
    endpoint,
    httpStatus,
    timestamp: new Date().toLocaleTimeString(),
    stack: `Error: ${message}\n    at triggerSimulatedError (error-generator.ts:240:15)\n    at HTMLButtonElement.dispatch (ErrorSimulator.tsx:92:7)`,
  };

  // Run the error triggering action
  try {
    await action();
  } catch (caughtErr) {
    console.error('[Reportli Error Simulator Action Catch]', caughtErr);
  }

  return errorEvent;
}

export function getAllErrorCategories(): string[] {
  return Array.from(new Set(ERROR_TEMPLATES.map(t => t.category)));
}
