export const resizeBuffer = (buffer: ArrayBuffer) => {
  const needed = buffer.byteLength * 2;
  if (needed > buffer.maxByteLength) {
    throw new RangeError(
      `Failed to encode: max buffer size of ${buffer.maxByteLength} was exceeded`,
    );
  }
  buffer.resize(needed);
};
