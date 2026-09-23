import { ApiTestFormValues } from "../validators/api.validator";

export interface ApiTestResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  durationMs: number;
  error?: string;
}

export async function runApiTest(config: ApiTestFormValues): Promise<ApiTestResult> {
  const startTime = performance.now();
  
  try {
    const headersConfig: Record<string, string> = {};
    if (config.headers) {
      config.headers.forEach(h => {
        if (h.key) headersConfig[h.key] = h.value;
      });
    }

    const fetchOptions: RequestInit = {
      method: config.method,
      headers: headersConfig,
    };

    if (config.method !== "GET" && config.body) {
      fetchOptions.body = config.body;
      if (!headersConfig["Content-Type"]) {
        headersConfig["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(config.url, fetchOptions);
    const endTime = performance.now();
    
    let responseBody;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      durationMs: Math.round(endTime - startTime),
    };
  } catch (error: any) {
    const endTime = performance.now();
    return {
      status: 0,
      statusText: "Error",
      headers: {},
      body: null,
      durationMs: Math.round(endTime - startTime),
      error: error.message || "Failed to fetch",
    };
  }
}
