export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface ApiHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiParam {
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiRequest {
  method: HttpMethod;
  url: string;
  headers: ApiHeader[];
  params: ApiParam[];
  body: string;
  bodyType: "json" | "raw" | "form";
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  timeMs: number;
  sizeBytes: number;
}
