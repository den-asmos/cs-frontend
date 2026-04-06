const encodingDefault: Record<string, number> = {
	а: 0,
	б: 1,
	в: 2,
	г: 3,
	д: 4,
	е: 5,
	ж: 6,
	з: 7,
	и: 8,
	й: 9,
	к: 10,
	л: 11,
	м: 12,
	н: 13,
	о: 14,
	п: 15,
	р: 16,
	с: 17,
	т: 18,
	у: 19,
	х: 20,
	ц: 21,
	ч: 22,
	ш: 23,
	щ: 24,
	ы: 25,
	ь: 26,
	э: 27,
	ю: 28,
	я: 29,
};

const encodingAlternative: Record<string, number> = {
	"0": 0,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	".": 10,
	",": 11,
	";": 12,
	":": 13,
	"-": 14,
	"?": 15,
	"!": 16,
	"(": 17,
	")": 18,
	'"': 19,
	" ": 20,
	"\t": 21,
	"\n": 22,
	ë: 23,
	ф: 24,
	ъ: 25,
	UP: 30,
	ALT: 31,
};

const decodingDefault: Record<number, string> = {};
Object.entries(encodingDefault).forEach(
	([key, value]) => (decodingDefault[value] = key),
);

const decodingAlternative: Record<number, string> = {};
Object.entries(encodingAlternative).forEach(
	([key, value]) => (decodingAlternative[value] = key),
);

export {
	decodingAlternative,
	decodingDefault,
	encodingAlternative,
	encodingDefault,
};
