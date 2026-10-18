const { performance } = require("node:perf_hooks");

const endpoint = process.argv[2] || "http://127.0.0.1:3000/recipes/1";
const warmupRequests = 5;
const measuredRequests = 30;
const thresholdMs = 2000;

async function requestRecipe() {
  const startedAt = performance.now();
  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(thresholdMs),
  });
  const recipe = await response.json();
  const durationMs = performance.now() - startedAt;

  if (!response.ok || recipe.message !== "Recipe Found" || !recipe.data?.id) {
    throw new Error(`Unexpected API response: HTTP ${response.status}`);
  }

  return durationMs;
}

async function main() {
  for (let index = 0; index < warmupRequests; index += 1) {
    await requestRecipe();
  }

  const durations = [];
  for (let index = 0; index < measuredRequests; index += 1) {
    durations.push(await requestRecipe());
  }

  durations.sort((left, right) => left - right);
  const percentile95 = durations[Math.ceil(durations.length * 0.95) - 1];
  const median = durations[Math.floor(durations.length / 2)];

  console.log(
    `API response latency: median=${median.toFixed(1)}ms, ` +
      `p95=${percentile95.toFixed(1)}ms, threshold=${thresholdMs}ms ` +
      `(${measuredRequests} measured requests)`
  );

  if (percentile95 >= thresholdMs) {
    throw new Error(
      `API p95 latency ${percentile95.toFixed(1)}ms exceeds ${thresholdMs}ms`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
