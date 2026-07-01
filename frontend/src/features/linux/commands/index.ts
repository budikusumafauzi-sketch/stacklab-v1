import { ProcessState } from "../types/terminal";
import { vfs } from "../filesystem/vfs";

export type CommandHandler = (args: string[], state: ProcessState) => { output: string; error?: boolean; newState?: Partial<ProcessState> };

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate().toString().padStart(2, ' ')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function resolvePath(cwd: string, target: string): string {
    if (target.startsWith("/")) return target;
    if (target === "~") return "/home/user";
    
    const cwdParts = cwd === "/" ? [] : cwd.split("/").filter(Boolean);
    const targetParts = target.split("/").filter(Boolean);
    
    for (const part of targetParts) {
      if (part === ".") continue;
      if (part === "..") {
        cwdParts.pop();
      } else {
        cwdParts.push(part);
      }
    }
    
    return "/" + cwdParts.join("/");
}

export const builtins: Record<string, CommandHandler> = {
  pwd: (_args, state) => ({ output: state.cwd }),
  
  ls: (args, state) => {
    let target = state.cwd;
    const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
    const longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al");
    const pathArgs = args.filter(a => !a.startsWith("-"));
    
    if (pathArgs.length > 0) {
      target = resolvePath(state.cwd, pathArgs[0]);
    }
    
    let nodes = vfs.listDir(target);
    if (!showAll) nodes = nodes.filter(n => !n.name.startsWith("."));
    
    if (longFormat) {
      const lines = nodes.map(n => {
        const typeChar = n.type === "dir" ? "d" : "-";
        const perms = n.permissions.startsWith("d") || n.permissions.startsWith("-") ? n.permissions.substring(1) : n.permissions;
        const owner = n.owner || "user";
        const group = n.group || "user";
        const size = (n.size || 0).toString().padStart(5, " ");
        const date = formatDate(n.updatedAt);
        const name = n.type === "dir" ? `<span class="text-blue-400 font-bold">${n.name}</span>` : n.name;
        return `${typeChar}${perms} 1 ${owner} ${group} ${size} ${date} ${name}`;
      });
      return { output: lines.join("\n") };
    }
    
    const output = nodes.map(n => n.type === "dir" ? `<span class="text-blue-400 font-bold">${n.name}/</span>` : n.name).join("  ");
    return { output };
  },

  tree: (args, state) => {
    let target = state.cwd;
    if (args[0] && !args[0].startsWith("-")) {
      target = resolvePath(state.cwd, args[0]);
    }
    
    const renderTree = (path: string, prefix: string = ""): string[] => {
      const nodes = vfs.listDir(path).filter(n => !n.name.startsWith("."));
      let lines: string[] = [];
      nodes.forEach((n, i) => {
        const isLast = i === nodes.length - 1;
        const marker = isLast ? "└── " : "├── ";
        const name = n.type === "dir" ? `<span class="text-blue-400 font-bold">${n.name}</span>` : n.name;
        lines.push(`${prefix}${marker}${name}`);
        if (n.type === "dir") {
          lines = lines.concat(renderTree(n.path, prefix + (isLast ? "    " : "│   ")));
        }
      });
      return lines;
    };
    
    const targetNode = vfs.getNode(target);
    if (!targetNode) return { output: `tree: ${target}: No such file or directory`, error: true };
    
    const rootName = targetNode.name || "/";
    const lines = [rootName, ...renderTree(target)];
    return { output: lines.join("\n") };
  },

  rmdir: (args, state) => {
    if (!args[0]) return { output: "rmdir: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    if (!node) return { output: `rmdir: failed to remove '${args[0]}': No such file or directory`, error: true };
    if (node.type !== "dir") return { output: `rmdir: failed to remove '${args[0]}': Not a directory`, error: true };
    
    const children = vfs.listDir(resolved);
    if (children.length > 0) return { output: `rmdir: failed to remove '${args[0]}': Directory not empty`, error: true };
    
    vfs.remove(resolved, false);
    return { output: "" };
  },

  cp: (args, state) => {
    if (args.length < 2) return { output: "cp: missing file operand", error: true };
    const src = resolvePath(state.cwd, args[0]);
    const dest = resolvePath(state.cwd, args[1]);
    const success = vfs.cp(src, dest);
    if (!success) return { output: `cp: cannot copy '${args[0]}' to '${args[1]}': No such file or directory or is a directory`, error: true };
    return { output: "" };
  },

  mv: (args, state) => {
    if (args.length < 2) return { output: "mv: missing file operand", error: true };
    const src = resolvePath(state.cwd, args[0]);
    const dest = resolvePath(state.cwd, args[1]);
    const success = vfs.mv(src, dest);
    if (!success) return { output: `mv: cannot move '${args[0]}' to '${args[1]}': No such file or directory`, error: true };
    return { output: "" };
  },

  find: (args, state) => {
    let target = state.cwd;
    let namePattern: string | undefined;
    
    if (args[0] && !args[0].startsWith("-")) {
      target = resolvePath(state.cwd, args[0]);
      const nameIndex = args.indexOf("-name");
      if (nameIndex !== -1 && args[nameIndex + 1]) {
        namePattern = args[nameIndex + 1];
      }
    } else {
      const nameIndex = args.indexOf("-name");
      if (nameIndex !== -1 && args[nameIndex + 1]) {
        namePattern = args[nameIndex + 1];
      }
    }
    
    const results: string[] = [];
    const search = (path: string) => {
      const node = vfs.getNode(path);
      if (!node) return;
      if (!namePattern || node.name === namePattern || (namePattern.startsWith("*") && node.name.endsWith(namePattern.substring(1)))) {
        results.push(path);
      }
      if (node.type === "dir") {
        const children = vfs.listDir(path);
        children.forEach(c => search(c.path));
      }
    };
    
    search(target);
    return { output: results.join("\n") };
  },

  locate: (args) => {
    if (!args[0]) return { output: "locate: missing operand", error: true };
    const pattern = args[0].toLowerCase();
    
    // Cheat and access state directly, or add a method to vfs.
    // For simplicity, we just use the global vfs instance.
    const state = (vfs as any).state;
    const results = Object.keys(state.nodes).filter(k => k.toLowerCase().includes(pattern));
    return { output: results.join("\n") };
  },

  cd: (args, state) => {
    const target = args[0] || "/home/user";
    const resolved = resolvePath(state.cwd, target);
    const node = vfs.getNode(resolved);
    
    if (!node) return { output: `cd: ${target}: No such file or directory`, error: true };
    if (node.type !== "dir") return { output: `cd: ${target}: Not a directory`, error: true };
    
    return { output: "", newState: { cwd: resolved } };
  },

  clear: () => ({ output: "__CLEAR__" }),

  echo: (args) => ({ output: args.join(" ") }),

  whoami: (_args, state) => ({ output: state.user }),
  
  hostname: () => ({ output: "stacklab" }),
  
  uname: (args) => {
    if (args.includes("-a")) return { output: "Linux stacklab 5.15.0-76-generic #83-Ubuntu SMP x86_64 x86_64 x86_64 GNU/Linux" };
    return { output: "Linux" };
  },

  date: () => ({ output: new Date().toString() }),
  
  cal: () => {
    const d = new Date();
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();
    const header = `      ${month} ${year}`.padEnd(20, " ");
    const days = "Su Mo Tu We Th Fr Sa";
    // Mock static calendar for simplicity of simulation
    const mockCal = `    1  2  3  4  5  6\n 7  8  9 10 11 12 13\n14 15 16 17 18 19 20\n21 22 23 24 25 26 27\n28 29 30 31`;
    return { output: `${header}\n${days}\n${mockCal}` };
  },

  history: (_args, state) => {
    if (!state.commandHistory) return { output: "" };
    const lines = state.commandHistory.map((cmd, idx) => `${(idx + 1).toString().padStart(4, " ")}  ${cmd}`);
    return { output: lines.join("\n") };
  },

  help: () => {
    const cmds = Object.keys(builtins).filter(k => !k.startsWith("__")).sort().join("  ");
    return { output: `StackLab Linux Simulator\nAvailable commands:\n\n${cmds}\n\nNote: This is a simulation. Commands run in an in-memory virtual filesystem.` };
  },

  stat: (args, state) => {
    if (!args[0]) return { output: "stat: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    if (!node) return { output: `stat: cannot stat '${args[0]}': No such file or directory`, error: true };
    
    return { output: `  File: ${node.name || "/"}\n  Size: ${node.size || 4096}       Blocks: 8          IO Block: 4096   ${node.type === 'dir' ? 'directory' : 'regular file'}\nDevice: 801h/2049d      Inode: ${Math.floor(Math.random() * 1000000)}   Links: 1\nAccess: (${node.permissions}/${node.owner})  Uid: ( 1000/   ${node.owner})   Gid: ( 1000/   ${node.group})\nAccess: ${new Date(node.updatedAt).toISOString().replace("T", " ")}\nModify: ${new Date(node.updatedAt).toISOString().replace("T", " ")}\nChange: ${new Date(node.createdAt).toISOString().replace("T", " ")}` };
  },

  file: (args, state) => {
    if (!args[0]) return { output: "file: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    if (!node) return { output: `${args[0]}: cannot open (No such file or directory)`, error: true };
    if (node.type === "dir") return { output: `${args[0]}: directory` };
    
    let type = "ASCII text";
    if (node.name.endsWith(".json")) type = "JSON data";
    if (node.name.endsWith(".js") || node.name.endsWith(".ts")) type = "JavaScript source";
    if (node.name.endsWith(".md")) type = "Markdown document";
    return { output: `${args[0]}: ${type}` };
  },

  du: (args, state) => {
    let target = state.cwd;
    if (args[0] && !args[0].startsWith("-")) target = resolvePath(state.cwd, args[0]);
    
    let total = 0;
    const calc = (path: string) => {
      const node = vfs.getNode(path);
      if (!node) return 0;
      let s = node.size || 4096;
      if (node.type === "dir") {
         const children = vfs.listDir(path);
         children.forEach(c => s += calc(c.path));
      }
      return s;
    };
    total = calc(target);
    return { output: `${Math.ceil(total / 1024)}\t${target}` };
  },

  df: () => {
    return { output: `Filesystem     1K-blocks    Used Available Use% Mounted on\nvfs-tmpfs         512000    1024    510976   1% /` };
  },

  chmod: (args, state) => {
    if (args.length < 2) return { output: "chmod: missing operand", error: true };
    const perms = args[0];
    const target = resolvePath(state.cwd, args[1]);
    
    // Very naive permission mapping just for visual simulation
    let newPerms = "-rwxrwxrwx";
    if (/^[0-7]{3,4}$/.test(perms)) {
       const p = perms.slice(-3);
       const mapChar = (num: string, chars: string) => {
          const n = parseInt(num, 10);
          return `${n & 4 ? chars[0] : '-'}${n & 2 ? chars[1] : '-'}${n & 1 ? chars[2] : '-'}`;
       };
       newPerms = `-${mapChar(p[0], "rwx")}${mapChar(p[1], "rwx")}${mapChar(p[2], "rwx")}`;
    }
    
    const node = vfs.getNode(target);
    if (!node) return { output: `chmod: cannot access '${args[1]}': No such file or directory`, error: true };
    
    if (node.type === "dir") {
      newPerms = "d" + newPerms.substring(1);
    }
    
    vfs.chmod(target, newPerms);
    return { output: "" };
  },

  chown: (args, state) => {
    if (args.length < 2) return { output: "chown: missing operand", error: true };
    const parts = args[0].split(":");
    const owner = parts[0];
    const group = parts[1];
    const target = resolvePath(state.cwd, args[1]);
    
    const node = vfs.getNode(target);
    if (!node) return { output: `chown: cannot access '${args[1]}': No such file or directory`, error: true };
    
    vfs.chown(target, owner, group);
    return { output: "" };
  },

  umask: (args) => {
    if (args.length === 0) return { output: "0022" };
    return { output: "" };
  },

  grep: (args, state) => {
    if (args.length < 2) return { output: "grep: missing operand", error: true };
    const pattern = args[0];
    const target = resolvePath(state.cwd, args[1]);
    const node = vfs.getNode(target);
    if (!node) return { output: `grep: ${args[1]}: No such file or directory`, error: true };
    if (node.type === "dir") return { output: `grep: ${args[1]}: Is a directory`, error: true };
    
    try {
      const regex = new RegExp(pattern);
      const lines = node.content.split("\n");
      const matches = lines.filter(l => regex.test(l));
      return { output: matches.join("\n") };
    } catch {
      return { output: "grep: invalid regex pattern", error: true };
    }
  },

  wc: (args, state) => {
    if (args.length < 1) return { output: "wc: missing operand", error: true };
    const target = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(target);
    if (!node) return { output: `wc: ${args[0]}: No such file or directory`, error: true };
    if (node.type === "dir") return { output: `wc: ${args[0]}: Is a directory\n      0       0       0 ${args[0]}`, error: true };
    
    const lines = node.content.split("\n").length;
    const words = node.content.split(/\s+/).filter(Boolean).length;
    const chars = node.content.length;
    
    return { output: `${lines.toString().padStart(7, ' ')} ${words.toString().padStart(7, ' ')} ${chars.toString().padStart(7, ' ')} ${args[0]}` };
  },

  ps: () => {
    return { output: `  PID TTY          TIME CMD\n 1337 pts/0    00:00:00 bash\n 4242 pts/0    00:00:00 ps` };
  },

  top: () => {
    return { output: `top - 12:34:56 up 1 day,  2:34,  1 user,  load average: 0.00, 0.01, 0.05\nTasks:   2 total,   1 running,   1 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   1024.0 total,    512.0 free,    256.0 used,    256.0 buff/cache\nMiB Swap:      0.0 total,      0.0 free,      0.0 used.    512.0 avail Mem\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1337 user      20   0   12345   1234   1234 R   0.0   0.1   0:00.01 bash\n 4242 user      20   0   12345   1234   1234 R   0.0   0.1   0:00.01 top` };
  },

  kill: (args) => {
    if (!args[0]) return { output: "kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]", error: true };
    return { output: "" };
  },

  ping: (args) => {
    if (!args[0]) return { output: "ping: missing host operand", error: true };
    const target = args[0];
    return { output: `PING ${target} (192.168.1.1) 56(84) bytes of data.\n64 bytes from ${target} (192.168.1.1): icmp_seq=1 ttl=64 time=12.3 ms\n64 bytes from ${target} (192.168.1.1): icmp_seq=2 ttl=64 time=11.2 ms\n64 bytes from ${target} (192.168.1.1): icmp_seq=3 ttl=64 time=10.5 ms\n64 bytes from ${target} (192.168.1.1): icmp_seq=4 ttl=64 time=11.1 ms\n\n--- ${target} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3004ms\nrtt min/avg/max/mdev = 10.5/11.27/12.3/0.64 ms` };
  },

  curl: (args) => {
    if (!args[0]) return { output: "curl: try 'curl --help' for more information", error: true };
    return { output: `<!DOCTYPE html>\n<html>\n<head><title>Mock Page</title></head>\n<body><h1>It works!</h1></body>\n</html>` };
  },

  wget: (args, state) => {
    if (!args[0]) return { output: "wget: missing URL\nUsage: wget [OPTION]... [URL]...", error: true };
    const url = args[args.length - 1];
    const filename = url.split("/").pop() || "index.html";
    const resolved = resolvePath(state.cwd, filename);
    vfs.writeFile(resolved, `<!DOCTYPE html>\n<html>\n<head><title>Mock Page</title></head>\n<body><h1>It works!</h1></body>\n</html>`);
    return { output: `--2026-06-30 12:34:56--  ${url}\nResolving host... 192.168.1.1\nConnecting to 192.168.1.1:80... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 95 [text/html]\nSaving to: '${filename}'\n\n     0K                                                       100% 1.23M=0s\n\n2026-06-30 12:34:56 (1.23 MB/s) - '${filename}' saved [95/95]` };
  },

  ip: (args) => {
    if (args[0] === "addr") {
      return { output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff\n    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0\n       valid_lft forever preferred_lft forever` };
    }
    return { output: "Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }" };
  },

  ifconfig: () => {
    return { output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255\n        ether 02:42:ac:11:00:02  txqueuelen 1000  (Ethernet)\n        RX packets 12345  bytes 1234567 (1.1 MiB)\n        RX errors 0  dropped 0  overruns 0  frame 0\n        TX packets 54321  bytes 7654321 (7.3 MiB)\n        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0\n\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0\n        loop  txqueuelen 1000  (Local Loopback)\n        RX packets 1337  bytes 123456 (120.5 KiB)\n        RX errors 0  dropped 0  overruns 0  frame 0\n        TX packets 1337  bytes 123456 (120.5 KiB)\n        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0` };
  },

  zip: (args, state) => {
    if (args.length < 2) return { output: "zip error: Nothing to do!", error: true };
    const zipFile = resolvePath(state.cwd, args[0]);
    vfs.writeFile(zipFile, "Mock zip content");
    return { output: `  adding: ${args.slice(1).join(" ")} (stored 0%)` };
  },

  unzip: (args, state) => {
    if (!args[0]) return { output: "unzip:  cannot find or open, missing file", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    if (!node) return { output: `unzip:  cannot find or open ${args[0]}`, error: true };
    
    const extractTo = resolvePath(state.cwd, "extracted.txt");
    vfs.writeFile(extractTo, "Mock extracted content");
    return { output: `Archive:  ${args[0]}\n  inflating: extracted.txt` };
  },

  tar: (args, state) => {
    if (args.length < 2) return { output: "tar: You must specify one of the '-Acdtrux', '--delete' or '--test-label' options\nTry 'tar --help' or 'tar --usage' for more information.", error: true };
    if (args[0].includes("c")) {
      const tarFile = resolvePath(state.cwd, args[1]);
      vfs.writeFile(tarFile, "Mock tar content");
      return { output: "" };
    }
    if (args[0].includes("x")) {
       const tarFile = resolvePath(state.cwd, args[1]);
       if (!vfs.getNode(tarFile)) return { output: `tar: ${args[1]}: Cannot open: No such file or directory\ntar: Error is not recoverable: exiting now`, error: true };
       const extractTo = resolvePath(state.cwd, "tar_extracted.txt");
       vfs.writeFile(extractTo, "Mock tar extracted content");
       return { output: "" };
    }
    return { output: "" };
  },

  env: (_args, state) => {
    const lines = Object.entries(state.env).map(([k, v]) => `${k}=${v}`);
    return { output: lines.join("\n") };
  },

  export: (args, state) => {
    if (!args[0]) return { output: "" };
    const newEnv = { ...state.env };
    args.forEach(arg => {
      const [k, ...v] = arg.split("=");
      if (k && v.length > 0) {
        newEnv[k] = v.join("=");
      }
    });
    return { output: "", newState: { env: newEnv } };
  },

  alias: (args, state) => {
    if (!args[0]) {
      const aliases = state.aliases || {};
      const lines = Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`);
      return { output: lines.join("\n") };
    }
    const newAliases = { ...(state.aliases || {}) };
    args.forEach(arg => {
      const parts = arg.split("=");
      if (parts.length > 1) {
         const k = parts[0];
         let v = parts.slice(1).join("=");
         if (v.startsWith("'") && v.endsWith("'")) v = v.substring(1, v.length - 1);
         if (v.startsWith('"') && v.endsWith('"')) v = v.substring(1, v.length - 1);
         newAliases[k] = v;
      }
    });
    return { output: "", newState: { aliases: newAliases } };
  },

  man: (args) => {
    if (!args[0]) return { output: "What manual page do you want?", error: true };
    return { output: `No manual entry for ${args[0]}\n(This is a simulated environment. Manual pages are not included.)` };
  },

  exit: () => {
    return { output: "logout\n\n[Process completed]\nRefresh the page to restart the terminal.", error: true };
  },

  reset: () => {
    vfs.reset();
    return { output: "__CLEAR__", newState: { cwd: "/home/user", commandHistory: [], aliases: {}, env: {} } };
  },

  cat: (args, state) => {
    if (!args[0]) return { output: "cat: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    
    if (!node) return { output: `cat: ${args[0]}: No such file or directory`, error: true };
    if (node.type !== "file") return { output: `cat: ${args[0]}: Is a directory`, error: true };
    
    return { output: node.content };
  },
  
  head: (args, state) => {
    let lines = 10;
    let fileIndex = 0;
    if (args[0] === "-n" && args[1]) {
      lines = parseInt(args[1], 10) || 10;
      fileIndex = 2;
    }
    if (!args[fileIndex]) return { output: "head: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[fileIndex]);
    const node = vfs.getNode(resolved);
    if (!node || node.type !== "file") return { output: `head: ${args[fileIndex]}: No such file`, error: true };
    const contentLines = node.content.split("\n").slice(0, lines);
    return { output: contentLines.join("\n") };
  },

  tail: (args, state) => {
    let lines = 10;
    let fileIndex = 0;
    if (args[0] === "-n" && args[1]) {
      lines = parseInt(args[1], 10) || 10;
      fileIndex = 2;
    }
    if (!args[fileIndex]) return { output: "tail: missing operand", error: true };
    const resolved = resolvePath(state.cwd, args[fileIndex]);
    const node = vfs.getNode(resolved);
    if (!node || node.type !== "file") return { output: `tail: ${args[fileIndex]}: No such file`, error: true };
    const contentLines = node.content.split("\n");
    return { output: contentLines.slice(Math.max(contentLines.length - lines, 0)).join("\n") };
  },

  less: (args, state) => {
    if (!args[0]) return { output: "missing filename", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    const node = vfs.getNode(resolved);
    if (!node || node.type !== "file") return { output: `${args[0]}: No such file`, error: true };
    return { output: node.content + "\n<span class='text-zinc-500'>(END)</span>" };
  },

  nano: (args, state) => {
    if (!args[0]) return { output: "nano: missing filename", error: true };
    const resolved = resolvePath(state.cwd, args[0]);
    let node = vfs.getNode(resolved);
    let content = "";
    if (node && node.type === "dir") return { output: `nano: ${args[0]} is a directory`, error: true };
    if (node) {
      content = node.content;
    } else {
      vfs.writeFile(resolved, "");
    }
    return { output: "", newState: { editingFile: resolved, editingContent: content } };
  },

  __internal_save: (args) => {
    const file = args[0];
    const contentBase64 = args[1];
    if (file && contentBase64 !== undefined) {
      vfs.writeFile(file, atob(contentBase64));
    }
    return { output: "" };
  },
  
  mkdir: (args, state) => {
     if (!args[0]) return { output: "mkdir: missing operand", error: true };
     const resolved = resolvePath(state.cwd, args[0]);
     const success = vfs.mkdir(resolved);
     if (!success) return { output: `mkdir: cannot create directory '${args[0]}': File exists or invalid path`, error: true };
     return { output: "" };
  },

  touch: (args, state) => {
     if (!args[0]) return { output: "touch: missing file operand", error: true };
     const resolved = resolvePath(state.cwd, args[0]);
     const success = vfs.writeFile(resolved, "");
     if (!success) return { output: `touch: cannot touch '${args[0]}': Permission denied or invalid path`, error: true };
     return { output: "" };
  },

  rm: (args, state) => {
     if (!args[0]) return { output: "rm: missing operand", error: true };
     const recursive = args.includes("-r") || args.includes("-rf");
     const targets = args.filter(a => !a.startsWith("-"));
     
     for (const target of targets) {
       const resolved = resolvePath(state.cwd, target);
       const node = vfs.getNode(resolved);
       if (!node) return { output: `rm: cannot remove '${target}': No such file or directory`, error: true };
       if (node.type === "dir" && !recursive) return { output: `rm: cannot remove '${target}': Is a directory`, error: true };
       vfs.remove(resolved, recursive);
     }
     return { output: "" };
  }
};
