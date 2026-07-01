import { VfsNode, VfsState } from "../types/vfs";

const STORAGE_KEY = "stacklab:linux:vfs";

const createDefaultNodes = (): Record<string, VfsNode> => {
  const now = Date.now();
  return {
    "/": { name: "", path: "/", type: "dir", content: "", createdAt: now, updatedAt: now, permissions: "drwxr-xr-x", owner: "root", group: "root", size: 4096 },
    "/home": { name: "home", path: "/home", type: "dir", content: "", createdAt: now, updatedAt: now, permissions: "drwxr-xr-x", owner: "root", group: "root", size: 4096 },
    "/home/user": { name: "user", path: "/home/user", type: "dir", content: "", createdAt: now, updatedAt: now, permissions: "drwxr-xr-x", owner: "user", group: "user", size: 4096 },
    "/home/user/readme.txt": { name: "readme.txt", path: "/home/user/readme.txt", type: "file", content: "Welcome to StackLab Linux Simulator!\nTry basic commands like ls, pwd, cat, echo.", createdAt: now, updatedAt: now, permissions: "-rw-r--r--", owner: "user", group: "user", size: 79 },
  };
};

class VirtualFileSystem {
  private state: VfsState;

  constructor() {
    this.state = this.load();
  }

  private load(): VfsState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as VfsState;
      }
    } catch (e) {
      console.warn("VFS Load Error", e);
    }
    return { nodes: createDefaultNodes() };
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("VFS Save Error", e);
    }
  }

  reset() {
    this.state = { nodes: createDefaultNodes() };
    this.save();
  }

  getNode(path: string): VfsNode | undefined {
    return this.state.nodes[path];
  }

  listDir(path: string): VfsNode[] {
    const dir = this.getNode(path);
    if (!dir || dir.type !== "dir") return [];
    
    // Find immediate children
    const prefix = path === "/" ? "/" : path + "/";
    return Object.values(this.state.nodes).filter(n => {
      if (n.path === path) return false;
      if (!n.path.startsWith(prefix)) return false;
      const remainder = n.path.slice(prefix.length);
      return !remainder.includes("/");
    });
  }

  writeFile(path: string, content: string, append: boolean = false): boolean {
    const existing = this.getNode(path);
    const parts = path.split("/").filter(Boolean);
    const name = parts[parts.length - 1];
    
    // Ensure parent exists
    const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== "dir") return false;

    if (existing) {
      if (existing.type !== "file") return false;
      existing.content = append ? existing.content + content : content;
      existing.updatedAt = Date.now();
      existing.size = existing.content.length;
    } else {
      this.state.nodes[path] = {
        name,
        path,
        type: "file",
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        permissions: "-rw-r--r--",
        owner: "user",
        group: "user",
        size: content.length
      };
    }
    this.save();
    return true;
  }

  mkdir(path: string): boolean {
    if (this.getNode(path)) return false;
    const parts = path.split("/").filter(Boolean);
    const name = parts[parts.length - 1];
    const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== "dir") return false;

    this.state.nodes[path] = {
      name,
      path,
      type: "dir",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      permissions: "drwxr-xr-x",
      owner: "user",
      group: "user",
      size: 4096
    };
    this.save();
    return true;
  }

  chmod(path: string, permissions: string): boolean {
    const node = this.getNode(path);
    if (!node) return false;
    node.permissions = permissions;
    node.updatedAt = Date.now();
    this.save();
    return true;
  }

  chown(path: string, owner: string, group?: string): boolean {
    const node = this.getNode(path);
    if (!node) return false;
    node.owner = owner;
    if (group) node.group = group;
    node.updatedAt = Date.now();
    this.save();
    return true;
  }

  remove(path: string, recursive: boolean = false): boolean {
    if (path === "/" || path === "/home") return false; // Protected
    const node = this.getNode(path);
    if (!node) return false;

    if (node.type === "dir" && !recursive) {
      const children = this.listDir(path);
      if (children.length > 0) return false;
    }

    if (node.type === "dir" && recursive) {
      const prefix = path + "/";
      Object.keys(this.state.nodes).forEach(k => {
        if (k.startsWith(prefix)) {
          delete this.state.nodes[k];
        }
      });
    }

    delete this.state.nodes[path];
    this.save();
    return true;
  }

  cp(src: string, dest: string): boolean {
    const node = this.getNode(src);
    if (!node) return false;
    
    if (node.type === "dir") {
       // recursive copy omitted for simplicity, cp only files
       return false;
    }
    
    return this.writeFile(dest, node.content);
  }

  mv(src: string, dest: string): boolean {
    const node = this.getNode(src);
    if (!node) return false;
    if (src === "/" || src === "/home") return false;
    
    // Simple implementation: cp then rm
    // Note: This won't work well for directories natively without deep copy
    if (node.type === "dir") {
      // Just rename the paths in nodes
      const prefix = src + "/";
      const newNodes = { ...this.state.nodes };
      
      Object.keys(this.state.nodes).forEach(k => {
        if (k === src || k.startsWith(prefix)) {
          const newPath = dest + k.substring(src.length);
          const parts = newPath.split("/").filter(Boolean);
          newNodes[newPath] = {
            ...newNodes[k],
            name: parts[parts.length - 1],
            path: newPath
          };
          delete newNodes[k];
        }
      });
      this.state.nodes = newNodes;
      this.save();
      return true;
    } else {
      if (this.cp(src, dest)) {
         return this.remove(src);
      }
    }
    return false;
  }
}

export const vfs = new VirtualFileSystem();
