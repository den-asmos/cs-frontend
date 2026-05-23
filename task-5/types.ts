export type RGBA = [red: number, green: number, blue: number, alpha: number];

export enum TraverseMode {
  RowMajor,
  ColMajor,
}

export interface PixelStream {
  getPixel(x: number, y: number): RGBA;
  setPixel(x: number, y: number, rgba: RGBA): RGBA;
  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void;
}

export abstract class AbstractPixelStream implements PixelStream {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  abstract getPixel(x: number, y: number): RGBA;
  abstract setPixel(x: number, y: number, rgba: RGBA): RGBA;

  forEach(mode: TraverseMode, callback: (rgba: RGBA, x: number, y: number) => void): void {
    if (mode === TraverseMode.RowMajor) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    } else {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          callback(this.getPixel(x, y), x, y);
        }
      }
    }
  }
}
