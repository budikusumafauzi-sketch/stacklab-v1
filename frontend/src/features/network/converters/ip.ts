export function ipToHex(ipStr: string): string | null {
  const parts = ipStr.split(".");
  if (parts.length !== 4) return null;
  const hexParts = parts.map(p => {
    const num = parseInt(p, 10);
    if (isNaN(num) || num < 0 || num > 255) return null;
    return num.toString(16).padStart(2, '0');
  });
  if (hexParts.includes(null)) return null;
  return "0x" + (hexParts as string[]).join("").toUpperCase();
}

export function ipToBinary(ipStr: string): string | null {
  const parts = ipStr.split(".");
  if (parts.length !== 4) return null;
  const binParts = parts.map(p => {
    const num = parseInt(p, 10);
    if (isNaN(num) || num < 0 || num > 255) return null;
    return num.toString(2).padStart(8, '0');
  });
  if (binParts.includes(null)) return null;
  return (binParts as string[]).join(".");
}
