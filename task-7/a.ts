import { textDecoder, textEncoder } from "./codec.ts";
import { resizeBuffer } from "./utils.ts";

class StringBufferView {
  private _view: DataView;
  private _count: Uint32Array = new Uint32Array(1);

  constructor(buffer: ArrayBuffer, count: number) {
    this._view = new DataView(buffer);
    this._count[0] = count;
  }

  at(index: number): string | undefined {
    const normalizedIndex = index < 0 ? index + this._count[0] : index;
    if (normalizedIndex < 0 || index > this._count[0] - 1) {
      return undefined;
    }

    let offset = 0;
    for (let i = 0; i < normalizedIndex; i++) {
      offset += 4 + this._view.getUint32(offset, true);
    }

    const byteLength = this._view.getUint32(offset, true);
    return textDecoder.decode(new Uint8Array(this._view.buffer, offset + 4, byteLength));
  }

  get view(): DataView {
    return this._view;
  }

  get count(): number {
    return this._count[0];
  }
}

export const encodeStrings = (strings: string[], maxByteLength = 4096): StringBufferView => {
  const buffer = new ArrayBuffer(128, { maxByteLength });
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let offset = 0;

  for (const str of strings) {
    const encoded = textEncoder.encode(str);

    if (offset + 4 + encoded.byteLength > buffer.byteLength) {
      resizeBuffer(buffer);
    }

    view.setUint32(offset, encoded.byteLength, true);
    uint8.set(encoded, offset + 4);
    offset += 4 + encoded.byteLength;
  }

  return new StringBufferView(buffer, strings.length);
};

const decodeStrings = (data: StringBufferView): string[] => {
  const result = new Array<string>(data.count);
  let offset = 0;

  for (let i = 0; i < data.count; i++) {
    const byteLength = data.view.getUint32(offset, true);
    result[i] = textDecoder.decode(new Uint8Array(data.view.buffer, offset + 4, byteLength));
    offset += 4 + byteLength;
  }

  return result;
};
