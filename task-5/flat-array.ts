import { AbstractPixelStream, type RGBA } from "./types.ts";

export class FlatArray extends AbstractPixelStream {
	data: Array<number>;

	constructor(width: number, height: number) {
		super(width, height);
		this.data = new Array<number>(width * height * 4).fill(0);
	}

	getPixel(x: number, y: number): RGBA {
		const index = this.#getIndex(x, y);

		return [
			this.data[index],
			this.data[index + 1],
			this.data[index + 2],
			this.data[index + 3],
		];
	}

	setPixel(x: number, y: number, rgba: RGBA): RGBA {
		const index = this.#getIndex(x, y);

		this.data[index] = rgba[0];
		this.data[index + 1] = rgba[1];
		this.data[index + 2] = rgba[2];
		this.data[index + 3] = rgba[3];

		return rgba;
	}

	#getIndex(x: number, y: number): number {
		return (y * this.width + x) * 4;
	}
}
