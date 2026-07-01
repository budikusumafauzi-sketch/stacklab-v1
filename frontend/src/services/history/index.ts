import { ApiRequest, ApiResponse } from "../../types/api";
import { SqlResult } from "../../types/sql";

export interface HistoryEntry<T = unknown> {
  id: string;
  timestamp: number;
  data: T;
}

export class HistoryManager<T = unknown> {
  private history: HistoryEntry<T>[] = [];
  private listeners: ((history: HistoryEntry<T>[]) => void)[] = [];

  constructor(private maxEntries: number = 50) {}

  add(data: T) {
    const entry: HistoryEntry<T> = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data
    };
    this.history = [entry, ...this.history].slice(0, this.maxEntries);
    this.notify();
    return entry.id;
  }

  clear() {
    this.history = [];
    this.notify();
  }

  getHistory() {
    return [...this.history];
  }

  subscribe(listener: (history: HistoryEntry<T>[]) => void) {
    this.listeners.push(listener);
    listener([...this.history]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.history]));
  }
}

export interface ApiHistoryEntry {
  request: ApiRequest;
  response: ApiResponse;
}

export interface SqlHistoryEntry {
  query: string;
  result: SqlResult;
}

export const apiHistory = new HistoryManager<ApiHistoryEntry>();
export const sqlHistory = new HistoryManager<SqlHistoryEntry>();
