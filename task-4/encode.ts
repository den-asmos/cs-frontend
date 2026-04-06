import {
	decodingAlternative,
	decodingDefault,
	encodingAlternative,
	encodingDefault,
} from "./dictionary.ts";

const BYTE_MASK = 0b1111_1111;
const FIVE_BIT_MASK = 0b0001_1111;

class Encoding {
	static encode(text: string): Uint8Array {
		const codes: number[] = [];

		for (const char of text) {
			const lower = char.toLowerCase();
			const isUpperCase = lower !== char;

			const altCode = encodingAlternative[lower];
			const code = altCode ?? encodingDefault[lower];
			if (code === undefined) {
				console.warn(`Unknown character: ${lower}`);
				continue;
			}

			if (isUpperCase) {
				codes.push(encodingAlternative["UP"]);
			}
			if (altCode !== undefined) {
				codes.push(encodingAlternative["ALT"]);
			}

			codes.push(code);
		}

		const packed = this.#pack(codes);

		const result = new Uint8Array(packed.length + 2);
		result[0] = (codes.length >> 8) & BYTE_MASK;
		result[1] = codes.length & BYTE_MASK;
		result.set(packed, 2);

		return result;
	}

	static decode(bytes: Uint8Array): string {
		if (bytes.length < 2) {
			console.error("Invalid input");
			return "";
		}

		const codes = this.#unpack(bytes);
		let result = "";
		let isUpperCase = false;

		for (let i = 0; i < codes.length; i++) {
			let code = codes[i];

			if (code === encodingAlternative["UP"]) {
				isUpperCase = true;
				continue;
			}

			let char: string | undefined;

			if (code === encodingAlternative["ALT"]) {
				i++;
				char = decodingAlternative[codes[i]];
			} else {
				char = decodingDefault[codes[i]];
			}

			result += isUpperCase ? char.toUpperCase() : char;
			isUpperCase = false;
		}

		return result;
	}

	static #pack(codes: number[]): number[] {
		let bits = 0;
		let bitCount = 0;
		const result: number[] = [];

		for (const code of codes) {
			bits = (bits << 5) | code;
			bitCount += 5;

			while (bitCount >= 8) {
				bitCount -= 8;
				result.push((bits >> bitCount) & BYTE_MASK);
			}
		}

		if (bitCount > 0) {
			result.push((bits << (8 - bitCount)) & BYTE_MASK);
		}

		return result;
	}

	static #unpack(bytes: Uint8Array): number[] {
		let bits = 0;
		let bitCount = 0;
		const result: number[] = [];

		const length = (bytes[0] << 8) | bytes[1];
		const encoded = bytes.subarray(2);

		for (const byte of encoded) {
			bits = (bits << 8) | byte;
			bitCount += 8;

			while (bitCount >= 5) {
				bitCount -= 5;
				result.push((bits >> bitCount) & FIVE_BIT_MASK);

				if (result.length === length) {
					return result;
				}
			}
		}

		return result;
	}
}

const bytes = Encoding.encode("Какая-то строка :)");
console.log(Encoding.decode(bytes));
