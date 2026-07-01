export type FileType = "file" | "dir";

export interface VfsNode {
  name: string;
  path: string;
  type: FileType;
  content: string; // empty string if directory
  createdAt: number;
  updatedAt: number;
  permissions: string;
  owner?: string;
  group?: string;
  size?: number;
}

export interface VfsState {
  nodes: Record<string, VfsNode>; // Key is absolute path
}
