import { useState } from "react";
import { ipToHex, ipToBinary } from "../converters/ip";

export function IpConverter() {
  const [ip, setIp] = useState("192.168.1.1");
  
  const hex = ipToHex(ip);
  const binary = ipToBinary(ip);

  return (
    <div className="space-y-4 p-4 bg-background border border-border rounded-md">
      <h3 className="text-sm font-semibold">IP Converter</h3>
      <div>
        <input 
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="IPv4 Address"
        />
      </div>

      {hex && binary ? (
        <div className="space-y-2 text-sm mt-4 p-3 bg-secondary/20 rounded-md">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Hexadecimal</span> 
            <span className="font-mono bg-background p-1.5 rounded border border-border break-all">{hex}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Binary</span> 
            <span className="font-mono bg-background p-1.5 rounded border border-border break-all">{binary}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-red-500 mt-4 p-3 bg-red-500/10 rounded-md">
          Invalid IPv4 Address.
        </div>
      )}
    </div>
  );
}
