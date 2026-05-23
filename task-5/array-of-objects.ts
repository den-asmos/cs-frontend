import { AbstractPixelStream, type RGBA } from "./types.ts";

export class ArrayOfObjects extends AbstractPixelStream {
	data: Array<{ red: number; green: number; blue: number; alpha: number }>;

	constructor(width: number, height: number) {
		super(width, height);
		this.data = Array.from({ length: width * height }, () => ({
			red: 0,
			green: 0,
			blue: 0,
			alpha: 0,
		}));
	}

	getPixel(x: number, y: number): RGBA {
		const index = this.#getIndex(x, y);

		return [
			this.data[index].red,
			this.data[index].green,
			this.data[index].blue,
			this.data[index].alpha,
		];
	}

	setPixel(x: number, y: number, rgba: RGBA): RGBA {
		const index = this.#getIndex(x, y);

		this.data[index].red = rgba[0];
		this.data[index].green = rgba[1];
		this.data[index].blue = rgba[2];
		this.data[index].alpha = rgba[3];

		return rgba;
	}

	#getIndex(x: number, y: number): number {
		return y * this.width + x;
	}
}
