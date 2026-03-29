const instructions = {
	"SET A": 0,
	"PRINT A": 1,
	"IFN A": 2,
	RET: 3,
	"DEC A": 4,
	JMP: 5,
};

const argumentCount = {
	0: 0,
	1: 0,
	2: 1,
	3: 1,
	4: 0,
	5: 1,
};

const execute = (program) => {
	const variables = {};
	let index = 0;

	while (index < program.length) {
		switch (program[index]) {
			case instructions["SET A"]: {
				variables["A"] = program[++index];
				break;
			}
			case instructions["PRINT A"]: {
				console.log(variables["A"]);
				break;
			}
			case instructions["IFN A"]: {
				if (variables["A"] !== 0) {
					const nextCommand = program[index + 1];
					index += 1 + argumentCount[nextCommand];
				}
				break;
			}
			case instructions["RET"]: {
				return program[++index];
			}
			case instructions["DEC A"]: {
				variables["A"] -= 1;
				break;
			}
			case instructions["JMP"]: {
				index = program[index + 1] - 1;
				break;
			}
			default: {
				throw new Error(`Unknown command ${program[index]}`);
			}
		}

		index++;
	}
};

const commands = [
	instructions["SET A"],
	10,
	instructions["PRINT A"],
	instructions["IFN A"],
	instructions["RET"],
	0,
	instructions["DEC A"],
	instructions["JMP"],
	2,
];

execute(commands);
