import { useState, useMemo } from "react";
import { calculateSubnet } from "../calculators/subnet";

export function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState("24");
  
  const result = useMemo(() => {
    const cidrNum = parseInt(cidr, 10);
    return calculateSubnet(ip, cidrNum);
  }, [ip, cidr]);

  return (
    <div className="space-y-4 p-4 bg-background border border-border rounded-md">
      <h3 className="text-sm font-semibold">Subnet Calculator</h3>
      <div className="flex flex-col items-center gap-2">
        <input 
          className="w-full min-w-0 px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 text-center"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="IP Address"
        />
        <div className="flex items-center justify-center text-muted-foreground shrink-0 font-bold">/</div>
        <input 
          className="w-full min-w-0 shrink-0 px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 text-center"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          placeholder="CIDR"
          type="number"
          min="0"
          max="32"
        />
      </div>

      {result ? (
        <div className="space-y-3 text-sm mt-4 p-3 bg-secondary/20 rounded-md">
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">Network</span> <span className="font-mono break-all">{result.network}/{result.cidr}</span></div>
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">Netmask</span> <span className="font-mono break-all">{result.mask}</span></div>
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">Broadcast</span> <span className="font-mono break-all">{result.broadcast}</span></div>
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">Hosts</span> <span className="font-mono break-all">{result.hosts}</span></div>
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">First Host</span> <span className="font-mono break-all">{result.firstHost}</span></div>
          <div className="flex flex-col gap-1"><span className="text-muted-foreground text-xs uppercase tracking-wider">Last Host</span> <span className="font-mono break-all">{result.lastHost}</span></div>
        </div>
      ) : (
        <div className="text-sm text-red-500 mt-4 p-3 bg-red-500/10 rounded-md">
          Invalid IP or CIDR notation.
        </div>
      )}
    </div>
  );
}
