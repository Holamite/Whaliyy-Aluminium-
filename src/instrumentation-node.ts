/**
 * Lightweight memory heartbeat so Render's log stream can be correlated
 * against the dashboard's memory graph and OOM-restart timestamps without
 * needing a separate monitoring service. No request data, no secrets.
 */
const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

function logMemory(label: string) {
  const { rss, heapUsed } = process.memoryUsage();
  console.log(`[memory] ${label} rss=${mb(rss)}MB heapUsed=${mb(heapUsed)}MB`);
}

logMemory("boot");
setInterval(() => logMemory("heartbeat"), 5 * 60 * 1000);

export {};
