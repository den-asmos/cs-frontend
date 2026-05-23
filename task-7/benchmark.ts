import { encodeStrings as encodeA } from "./a.ts";
import { encodeStrings as encodeB } from "./b.ts";

const ITERATIONS = 1_000_000;
const WARMUP_ITERATIONS = 1000;
const STRINGS = [
  "Hello",
  "world",
  "Привет",
  "мир",
  "!",
  "",
  "Meow",
  "some string",
  "some other string",
  "very very long string",
  "another very very very long string",
  "one more very very very long string",
  "ещё одна очень очень очень длинная строка",
];

const bufferA = encodeA(STRINGS);
const bufferB = encodeB(STRINGS);

const measurePerformance = (callback: () => void): number => {
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    callback();
  }

  const start = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    callback();
  }

  return performance.now() - start;
};

const getStats = (a: () => number, b: () => number, label: string) => {
  const timeA = a();
  const timeB = b();
  const ratio = timeA / timeB;

  console.log(`\n${label}:`);
  console.log(`Время A: ${timeA.toFixed(2)} ms`);
  console.log(`Время B: ${timeB.toFixed(2)} ms`);
  console.log(`Разница: x${ratio.toFixed(2)}\n`);
};

getStats(
  () =>
    measurePerformance(() => {
      for (let i = 0; i < STRINGS.length; i++) {
        bufferA.at(i);
      }
    }),
  () =>
    measurePerformance(() => {
      for (let i = 0; i < STRINGS.length; i++) {
        bufferB.at(i);
      }
    }),
  "Последовательный доступ",
);

getStats(
  () =>
    measurePerformance(() => {
      bufferA.at(STRINGS.length - 1);
    }),
  () =>
    measurePerformance(() => {
      bufferB.at(STRINGS.length - 1);
    }),
  "Доступ к последнему элементу",
);

const randomIndex = Math.floor(Math.random() * STRINGS.length);

getStats(
  () =>
    measurePerformance(() => {
      bufferA.at(randomIndex);
    }),
  () =>
    measurePerformance(() => {
      bufferB.at(randomIndex);
    }),
  "Произвольный доступ",
);
