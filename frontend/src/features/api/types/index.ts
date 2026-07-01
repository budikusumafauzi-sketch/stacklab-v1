import { ApiRequest } from "../../../types/api";

export interface CollectionRequest extends ApiRequest {
  id: string;
  name: string;
}

export interface ApiCollection {
  id: string;
  name: string;
  requests: CollectionRequest[];
}

export interface ApiEnvironment {
  id: string;
  name: string;
  variables: Record<string, string>;
}
