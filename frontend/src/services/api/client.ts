import { ApiRequest, ApiResponse } from "../../types/api";

export const apiClient = {
  send: async (request: ApiRequest): Promise<ApiResponse> => {
    const startTime = performance.now();
    
    const headers = new Headers();
    request.headers.filter(h => h.enabled && h.key).forEach(h => {
      headers.append(h.key, h.value);
    });

    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
       const endTime = performance.now();
       return {
         status: 0,
         statusText: "Invalid URL",
         headers: {},
         body: "The provided URL is invalid.",
         timeMs: Math.round(endTime - startTime),
         sizeBytes: 0
       };
    }

    request.params.filter(p => p.enabled && p.key).forEach(p => {
      url.searchParams.append(p.key, p.value);
    });

    const fetchOptions: RequestInit = {
      method: request.method,
      headers
    };

    if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
      fetchOptions.body = request.body;
      if (request.bodyType === 'json' && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
      }
    }

    try {
      const res = await fetch(url.toString(), fetchOptions);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const bodyText = await res.text();
      const sizeBytes = new Blob([bodyText]).size;

      return {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: bodyText,
        timeMs,
        sizeBytes
      };
    } catch (err: unknown) {
      const e = err as Error;
      const endTime = performance.now();
      return {
        status: 0,
        statusText: "Network Error",
        headers: {},
        body: e.message,
        timeMs: Math.round(endTime - startTime),
        sizeBytes: 0
      };
    }
  }
};
