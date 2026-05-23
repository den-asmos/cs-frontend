import { ArrayOfArrays } from "./array-of-arrays.ts";
import { ArrayOfObjects } from "./array-of-objects.ts";
import { FlatArray } from "./flat-array.ts";
import { TypedArray } from "./typed-array.ts";
import { type PixelStream, RGBA, TraverseMode } from "./types.ts";

type Stats = {
  ["Тип"]: string;
  ["По строкам (ms)"]: string;
  ["По столбцам (ms)"]: string;
  ["Get Pixel (ms)"]: string;
};

const BLACK_COLOR: RGBA = [0, 0, 0, 255];
const ITERATIONS = 10;
const sizes = [10, 100, 1000, 2000];

const pixelStreams = [FlatArray, ArrayOfArrays, ArrayOfObjects, TypedArray];

const fillArray = <T extends PixelStream>(arr: T, size: number) => {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      arr.setPixel(x, y, BLACK_COLOR);
    }
  }
};

const measurePerformance = <T extends PixelStream>(arr: T, size: number, type: string): Stats => {
  (globalThis as any).gc();
  fillArray<T>(arr, size);

  let sum = 0;
  for (let i = 0; i < ITERATIONS; i++) {
    arr.forEach(TraverseMode.RowMajor, (rgba) => {
      sum += rgba[0] + rgba[1] + rgba[2] + rgba[3];
    });
    arr.forEach(TraverseMode.ColMajor, (rgba) => {
      sum += rgba[0] + rgba[1] + rgba[2] + rgba[3];
    });
  }

  (globalThis as any).gc();

  let rowSum = 0;
  const rowStart = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    arr.forEach(TraverseMode.RowMajor, (rgba) => {
      rowSum += rgba[0] + rgba[1] + rgba[2] + rgba[3];
    });
  }
  const rowTime = (performance.now() - rowStart) / ITERATIONS;

  (globalThis as any).gc();

  let colSum = 0;
  const colStart = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    arr.forEach(TraverseMode.ColMajor, (rgba) => {
      colSum += rgba[0] + rgba[1] + rgba[2] + rgba[3];
    });
  }
  const colTime = (performance.now() - colStart) / ITERATIONS;

  (globalThis as any).gc();

  let getPixelSum = 0;
  const getPixelStart = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    for (let index = 0; index < size * size; index++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      const pixel = arr.getPixel(x, y);
      getPixelSum += pixel[0] + pixel[1] + pixel[2] + pixel[3];
    }
  }
  const getPixelTime = (performance.now() - getPixelStart) / ITERATIONS;

  return {
    ["Тип"]: type,
    ["По строкам (ms)"]: rowTime.toFixed(2),
    ["По столбцам (ms)"]: colTime.toFixed(2),
    ["Get Pixel (ms)"]: getPixelTime.toFixed(2),
  };
};

for (const size of sizes) {
  console.log(`\nРазмер матрицы: ${size}x${size} (${(size * size).toLocaleString()} элементов)`);

  const stats: Stats[] = [];

  for (const pixelStream of pixelStreams) {
    const entity = new pixelStream(size, size);
    const entityStats = measurePerformance(entity, size, pixelStream.name);
    stats.push(entityStats);
  }

  console.table(stats);
}
