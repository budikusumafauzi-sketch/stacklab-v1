import { useState } from "react";
import { simulatePing, PingResult } from "../api/tools";
import { Button } from "../../../components/ui/button";

export function PingSimulator() {
  const [host, setHost] = useState("google.com");
  const [results, setResults] = useState<PingResult[]>([]);
  const [running, setRunning] = useState(false);

  const handlePing = async () => {
    setRunning(true);
    setResults([]);
    const res = await simulatePing(host, 4);
    setResults(res);
    setRunning(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 rounded-md shadow-inner text-green-500 font-mono text-sm">
      <div className="flex items-center mb-6 max-w-md gap-4">
        <input 
          className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 px-3 py-2 outline-none rounded focus:border-green-500"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          disabled={running}
          placeholder="Target Host or IP"
        />
        <Button onClick={handlePing} disabled={running} className="bg-green-600 hover:bg-green-700 text-white">
          {running ? "Pinging..." : "Execute Ping"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {results.length > 0 && (
          <div className="space-y-1">
            <p className="text-zinc-400 mb-2">PING {host} (192.0.2.1) 56(84) bytes of data.</p>
            {results.map((r) => (
              <p key={r.seq} className={r.status === "timeout" ? "text-red-400" : "text-zinc-300"}>
                {r.status === "success" 
                  ? `64 bytes from ${host}: icmp_seq=${r.seq} ttl=115 time=${r.time} ms` 
                  : `Request timeout for icmp_seq ${r.seq}`}
              </p>
            ))}
            <p className="text-zinc-400 mt-4">--- {host} ping statistics ---</p>
            <p className="text-zinc-400">
              {results.length} packets transmitted, {results.filter(r => r.status === "success").length} received,{" "}
              {Math.round((results.filter(r => r.status === "timeout").length / results.length) * 100)}% packet loss
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
