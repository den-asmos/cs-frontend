const cyclicLeftShift = (value: number, k: number) => {
	k &= 31;
	const overflow = value >>> (32 - k);
	value <<= k;

	return (value | overflow) >>> 0;
};

const cyclicRightShift = (value: number, k: number) => {
	k &= 31;
	const overflow = value << (32 - k);
	value = value >>> k;

	return (value | overflow) >>> 0;
};

console.log(
	cyclicLeftShift(0b10000000_00000000_00000000_00000001, 16)
		.toString(2)
		.padStart(32, "0"),
);

console.log(
	cyclicRightShift(0b10000000_00000000_00000000_00000001, 16)
		.toString(2)
		.padStart(32, "0"),
);
