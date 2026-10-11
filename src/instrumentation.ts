/**
 * Runs once when a new server process boots. instrumentation.ts is bundled
 * for both the Node.js and Edge runtimes, so the actual memory-logging code
 * (process.memoryUsage, setInterval) lives in a separate module and is only
 * ever imported on the Node.js side — a static top-level import here would
 * make Turbopack flag it as unsupported in the Edge Runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
