import { SIZES } from "../constants.js";
import { measure } from "../measure.js";

const create = {
  packed: (size) => {
    return Array.from({ length: size }, (_, index) => index);
  },
  holey: (size) => {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = i;
    }
    return array;
  },
};
const TYPES = Object.keys(create);

const measureAdd = () => {
  for (const type of TYPES) {
    console.log(`\n=== Добавление в ${type} array ===`);
    const stats = [];

    for (const size of SIZES) {
      const pushStats = measure(() => {
        const array = create[type](0);
        for (let i = 0; i < size; i++) {
          array.push(i);
        }
      });

      const unshiftStats = measure(() => {
        const array = create[type](0);
        for (let i = 0; i < size; i++) {
          array.unshift(i);
        }
      });

      stats.push({
        ["Размер"]: size,
        ["Push (мкс)"]: pushStats.toFixed(2),
        ["Unshift (мкс)"]: unshiftStats.toFixed(2),
        ["Разница"]: `x${(unshiftStats / pushStats).toFixed(0)}`,
      });
    }

    console.table(stats);
  }
};

const measureRemove = () => {
  for (const type of TYPES) {
    console.log(`\n=== Удаление из ${type} array ===`);
    const stats = [];

    for (const size of SIZES) {
      const popStats = measure(() => {
        const array = create[type](size);
        while (array.length > 0) {
          array.pop();
        }
      });

      const shiftStats = measure(() => {
        const array = create[type](size);
        while (array.length > 0) {
          array.shift();
        }
      });

      stats.push({
        ["Размер"]: size,
        ["Pop (мкс)"]: popStats.toFixed(2),
        ["Shift (мкс)"]: shiftStats.toFixed(2),
        ["Разница"]: `x${(shiftStats / popStats).toFixed(0)}`,
      });
    }

    console.table(stats);
  }
};

export const measureArrayOperations = () => {
  measureAdd();
  measureRemove();
};
