export interface SubnetInfo {
  ip: string;
  mask: string;
  network: string;
  broadcast: string;
  hosts: number;
  firstHost: string;
  lastHost: string;
  cidr: number;
}

export function calculateSubnet(ipStr: string, cidr: number): SubnetInfo | null {
  try {
    const ipParts = ipStr.split(".").map(Number);
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
    if (cidr < 0 || cidr > 32) return null;

    const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    const maskInt = cidr === 0 ? 0 : ~((1 << (32 - cidr)) - 1);
    
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | ~maskInt;
    
    const intToStr = (int: number) => 
      [ (int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255 ].join(".");

    const hosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;

    return {
      ip: ipStr,
      mask: intToStr(maskInt),
      network: intToStr(networkInt),
      broadcast: intToStr(broadcastInt),
      hosts,
      firstHost: cidr >= 31 ? "N/A" : intToStr(networkInt + 1),
      lastHost: cidr >= 31 ? "N/A" : intToStr(broadcastInt - 1),
      cidr
    };
  } catch {
    return null;
  }
}
