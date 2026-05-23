import { SIZES } from "../constants.js";
import { CircularBuffer } from "../circular-buffer.js";
import { measure } from "../measure.js";

const createArray = (size) => {
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = i;
  }
  return array;
};

const createCircularBuffer = (size) => {
  const cb = new CircularBuffer(size);
  for (let i = 0; i < size; i++) {
    cb.push(i);
  }
  return cb;
};

const measureUnshift = () => {
  console.log(`\n=== Unshift ===`);
  const stats = [];

  for (const size of SIZES) {
    const arrayStats = measure(() => {
      const array = createArray(0);
      for (let i = 0; i < size; i++) {
        array.unshift(i);
      }
    });

    const cbStats = measure(() => {
      const cb = createCircularBuffer(0);
      for (let i = 0; i < size; i++) {
        cb.unshift(i);
      }
    });

    stats.push({
      ["Размер"]: size,
      ["Circular Buffer (мкс)"]: cbStats.toFixed(2),
      ["Array (мкс)"]: arrayStats.toFixed(2),
      ["Разница"]: `x${(arrayStats / cbStats).toFixed(1)}`,
    });
  }

  console.table(stats);
};

const measureShift = () => {
  console.log(`\n=== Shift ===`);
  const stats = [];

  for (const size of SIZES) {
    const arrayStats = measure(() => {
      const array = createArray(size);
      while (array.length > 0) {
        array.shift();
      }
    });

    const cbStats = measure(() => {
      const cb = createCircularBuffer(size);
      while (cb.length > 0) {
        cb.shift();
      }
    });

    stats.push({
      ["Размер"]: size,
      ["Circular Buffer (мкс)"]: cbStats.toFixed(2),
      ["Array (мкс)"]: arrayStats.toFixed(2),
      ["Разница"]: `x${(arrayStats / cbStats).toFixed(1)}`,
    });
  }

  console.table(stats);
};

export const measureCircularBufferOperations = () => {
  measureUnshift();
  measureShift();
};
