import { ApiCollection, CollectionRequest } from "../types";
import { ApiRequest } from "../../../types/api";

const STORAGE_KEY = "stacklab:api:collections";

class CollectionsManager {
  private collections: ApiCollection[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.collections = JSON.parse(data);
      }
    } catch {
      this.collections = [];
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.collections));
    this.notify();
  }

  getCollections() {
    return [...this.collections];
  }

  addCollection(name: string) {
    const col: ApiCollection = { id: crypto.randomUUID(), name, requests: [] };
    this.collections.push(col);
    this.save();
    return col;
  }

  removeCollection(id: string) {
    this.collections = this.collections.filter(c => c.id !== id);
    this.save();
  }

  addRequestToCollection(collectionId: string, request: ApiRequest, name: string = "New Request") {
    const col = this.collections.find(c => c.id === collectionId);
    if (col) {
      const colReq: CollectionRequest = {
        ...request,
        id: crypto.randomUUID(),
        name
      };
      col.requests.push(colReq);
      this.save();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    listener();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const collectionsManager = new CollectionsManager();
