import { measureArrayOperations } from "./benchmarks/array-operations.js";
import { measureCircularBufferOperations } from "./benchmarks/circular-buffer-operations.js";

const runBenchmarks = () => {
  measureArrayOperations();
  measureCircularBufferOperations();
};

runBenchmarks();
