import { AbstractPixelStream, type RGBA } from "./types.ts";

export class ArrayOfArrays extends AbstractPixelStream {
	data: Array<RGBA>;

	constructor(width: number, height: number) {
		super(width, height);
		this.data = Array.from({ length: width * height }, () => [0, 0, 0, 0]);
	}

	getPixel(x: number, y: number): RGBA {
		const index = this.#getIndex(x, y);

		return [
			this.data[index][0],
			this.data[index][1],
			this.data[index][2],
			this.data[index][3],
		];
	}

	setPixel(x: number, y: number, rgba: RGBA): RGBA {
		const index = this.#getIndex(x, y);

		this.data[index][0] = rgba[0];
		this.data[index][1] = rgba[1];
		this.data[index][2] = rgba[2];
		this.data[index][3] = rgba[3];

		return rgba;
	}

	#getIndex(x: number, y: number): number {
		return y * this.width + x;
	}
}
