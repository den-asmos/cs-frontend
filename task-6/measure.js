import { ITERATIONS, WARMUP_ITERATIONS } from "./constants.js";

export const measure = (callback) => {
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    callback();
  }

  globalThis.gc?.();

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    callback();
  }

  return ((performance.now() - start) / ITERATIONS) * 1000;
};
