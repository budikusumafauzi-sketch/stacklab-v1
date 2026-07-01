export interface PingResult {
  seq: number;
  time: number;
  status: "success" | "timeout";
}

export async function simulatePing(_host: string, count: number = 4): Promise<PingResult[]> {
  const results: PingResult[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Simulate delay between pings
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate 5% timeout chance
    const isTimeout = Math.random() < 0.05;
    
    // Simulate latency (20ms - 120ms)
    const latency = Math.floor(Math.random() * 100) + 20;
    
    results.push({
      seq: i,
      time: latency,
      status: isTimeout ? "timeout" : "success"
    });
  }
  
  return results;
}
