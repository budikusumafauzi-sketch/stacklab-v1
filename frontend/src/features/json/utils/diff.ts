export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  text: string;
  lineNum?: number;
}

export function computeJsonDiff(oldStr: string, newStr: string): DiffLine[] {
  try {
    const o = JSON.stringify(JSON.parse(oldStr), null, 2).split('\n');
    const n = JSON.stringify(JSON.parse(newStr), null, 2).split('\n');
    const result: DiffLine[] = [];
    
    let i = 0, j = 0;
    while(i < o.length || j < n.length) {
       if (i < o.length && j < n.length && o[i] === n[j]) {
         result.push({ type: "unchanged", text: o[i], lineNum: j+1 });
         i++; j++;
       } else if (i < o.length && !n.includes(o[i])) {
         result.push({ type: "removed", text: o[i], lineNum: i+1 });
         i++;
       } else if (j < n.length && !o.includes(n[j])) {
         result.push({ type: "added", text: n[j], lineNum: j+1 });
         j++;
       } else {
         if (i < o.length) { result.push({ type: "removed", text: o[i], lineNum: i+1 }); i++; }
         if (j < n.length) { result.push({ type: "added", text: n[j], lineNum: j+1 }); j++; }
       }
    }
    return result;
  } catch {
    return [];
  }
}
