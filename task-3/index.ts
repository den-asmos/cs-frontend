class BCD {
	private size: number;
	private data: Uint8Array;

	constructor(value: number | bigint) {
		if (value === 0 || value === 0n) {
			this.size = 1;
			this.data = new Uint8Array([0]);
			return;
		}

		const digits = [];

		if (typeof value === "bigint") {
			while (value > 0n) {
				digits.push(Number(value % 10n));
				value /= 10n;
			}
		} else {
			while (value > 0) {
				digits.push(value % 10);
				value = (value / 10) | 0;
			}
		}

		digits.reverse();

		this.size = digits.length;
		this.data = new Uint8Array(Math.ceil(digits.length / 2));

		let index = 0;

		while (index < digits.length) {
			this.data[index >> 1] = (digits[index] << 4) | (digits[index + 1] ?? 0);
			index += 2;
		}
	}

	toNumber(): number {
		const mask = (1 << 4) - 1;
		let result = 0;
		let power = this.size - 1;

		for (let i = 0; i < this.data.length; i++) {
			const byte = this.data[i];
			result += ((byte >> 4) & mask) * 10 ** power--;

			if ((i + 1) * 2 <= this.size) {
				result += (byte & mask) * 10 ** power--;
			}
		}

		return result;
	}

	toBigint(): bigint {
		const mask = (1 << 4) - 1;
		let result = 0n;
		let power = BigInt(this.size) - 1n;

		for (let i = 0; i < this.data.length; i++) {
			const byte = this.data[i];
			result += BigInt((byte >> 4) & mask) * 10n ** power--;

			if ((i + 1) * 2 <= this.size) {
				result += BigInt(byte & mask) * 10n ** power--;
			}
		}

		return result;
	}

	toString(): string {
		const mask = (1 << 4) - 1;
		let result = "";

		for (let i = 0; i < this.data.length; i++) {
			const byte = this.data[i];
			result += (byte >> 4) & mask;

			if ((i + 1) * 2 <= this.size) {
				result += byte & mask;
			}
		}

		return result;
	}

	at(index: number): number {
		const normalizedIndex = index < 0 ? index + this.size : index;
		const byte = this.data[normalizedIndex >> 1];
		const mask = (1 << 4) - 1;

		return normalizedIndex % 2 ? byte & mask : (byte >> 4) & mask;
	}
}

const n = new BCD(65536n);

console.log(n.toNumber());
console.log(n.toBigint());
console.log(n.toString());

console.log(n.at(0));
console.log(n.at(1));

console.log(n.at(-1));
console.log(n.at(-2));
