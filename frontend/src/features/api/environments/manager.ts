import { ApiEnvironment } from "../types";

const STORAGE_KEY = "stacklab:api:environments";
const ACTIVE_KEY = "stacklab:api:active_environment";

class EnvironmentManager {
  private environments: ApiEnvironment[] = [
    { id: "default", name: "Default", variables: { host: "https://jsonplaceholder.typicode.com" } }
  ];
  private activeId: string = "default";
  private listeners: (() => void)[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) this.environments = JSON.parse(data);
      
      const active = localStorage.getItem(ACTIVE_KEY);
      if (active) this.activeId = active;
    } catch {
      // Keep defaults
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.environments));
    localStorage.setItem(ACTIVE_KEY, this.activeId);
    this.notify();
  }

  getEnvironments() { return structuredClone(this.environments); }
  getActiveEnvironment() { 
    const env = this.environments.find(e => e.id === this.activeId) || this.environments[0];
    return structuredClone(env);
  }
  
  setActive(id: string) {
    this.activeId = id;
    this.save();
  }

  addEnvironment(name: string) {
    const env: ApiEnvironment = { id: crypto.randomUUID(), name, variables: {} };
    this.environments.push(env);
    this.save();
    return env;
  }

  setVariable(envId: string, key: string, value: string) {
    const env = this.environments.find(e => e.id === envId);
    if (env) {
      env.variables[key] = value;
      this.save();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    listener();
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify() { this.listeners.forEach(l => l()); }
}

export const environmentManager = new EnvironmentManager();
