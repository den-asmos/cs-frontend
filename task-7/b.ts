import { textDecoder, textEncoder } from "./codec.ts";
import { resizeBuffer } from "./utils.ts";

class StringBufferView {
  private _buffer: ArrayBuffer;
  private _view: DataView;
  private _count: Uint32Array = new Uint32Array(1);

  constructor(buffer: ArrayBuffer, count: number) {
    this._buffer = buffer;
    this._view = new DataView(buffer);
    this._count[0] = count;
  }

  at(index: number): string | undefined {
    const normalizedIndex = index < 0 ? index + this._count[0] : index;
    if (normalizedIndex < 0 || normalizedIndex > this._count[0] - 1) {
      return undefined;
    }

    const offset = normalizedIndex * 8;

    return textDecoder.decode(
      new Uint8Array(
        this._view.buffer,
        this._view.getUint32(offset + 4, true),
        this._view.getUint32(offset, true),
      ),
    );
  }

  set(index: number, value: string): void {
    const normalizedIndex = index < 0 ? index + this._count[0] : index;
    if (normalizedIndex < 0 || normalizedIndex > this._count[0] - 1) {
      return;
    }

    const encoded = textEncoder.encode(value);
    const offset = normalizedIndex * 8;

    const lastStringOffset = (this._count[0] - 1) * 8;
    const lastStringLength = this._view.getUint32(lastStringOffset, true);
    const lastStringDataOffset = this._view.getUint32(lastStringOffset + 4, true);

    const dataOffset = lastStringDataOffset + lastStringLength;

    if (dataOffset + encoded.byteLength > this._buffer.byteLength) {
      resizeBuffer(this._buffer);
    }

    this._view.setUint32(offset, encoded.byteLength, true);
    this._view.setUint32(offset + 4, dataOffset, true);

    new Uint8Array(this._buffer).set(encoded, dataOffset);
  }

  get buffer(): ArrayBuffer {
    return this._buffer;
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

  let indexOffset = 0;
  let dataOffset = strings.length * 8;

  for (const str of strings) {
    const encoded = textEncoder.encode(str);

    if (dataOffset + encoded.byteLength > buffer.byteLength) {
      resizeBuffer(buffer);
    }

    view.setUint32(indexOffset, encoded.byteLength, true);
    view.setUint32(indexOffset + 4, dataOffset, true);
    uint8.set(encoded, dataOffset);

    indexOffset += 8;
    dataOffset += encoded.byteLength;
  }

  return new StringBufferView(buffer, strings.length);
};

const decodeStrings = (data: StringBufferView): string[] => {
  const result = new Array<string>(data.count);
  let offset = 0;

  for (let i = 0; i < data.count; i++) {
    result[i] = textDecoder.decode(
      new Uint8Array(
        data.view.buffer,
        data.view.getUint32(offset + 4, true),
        data.view.getUint32(offset, true),
      ),
    );
    offset += 8;
  }

  return result;
};
