export class CircularBuffer {
  #buffer;
  #start;
  #end;
  #length;
  #capacity;

  constructor(capacity = 32) {
    this.#buffer = new Array(capacity);
    this.#start = 0;
    this.#end = 0;
    this.#length = 0;
    this.#capacity = capacity;
  }

  push(value) {
    if (this.#length === this.#capacity) {
      this.resize(this.#capacity * 2);
    }

    this.#buffer[this.#end] = value;
    this.#end = (this.#end + 1) % this.#capacity;
    this.#length += 1;
  }

  pop() {
    if (this.#length === 0) {
      return;
    }

    this.#end = (this.#end + this.#capacity - 1) % this.#capacity;
    const value = this.#buffer[this.#end];
    this.#buffer[this.#end] = undefined;
    this.#length -= 1;

    return value;
  }

  unshift(value) {
    if (this.#length === this.#capacity) {
      this.resize(this.#capacity * 2);
    }

    this.#start = (this.#start + this.#capacity - 1) % this.#capacity;
    this.#buffer[this.#start] = value;
    this.#length += 1;
  }

  shift() {
    if (this.#length === 0) {
      return;
    }

    const value = this.#buffer[this.#start];
    this.#buffer[this.#start] = undefined;
    this.#start = (this.#start + 1) % this.#capacity;
    this.#length -= 1;

    return value;
  }

  resize(newCapacity) {
    const newBuffer = new Array(newCapacity);
    for (let i = 0; i < this.#length; i++) {
      newBuffer[i] = this.#buffer[(this.#start + i) % this.#capacity];
    }
    this.#start = 0;
    this.#end = this.#length;
    this.#buffer = newBuffer;
    this.#capacity = newCapacity;
  }

  get length() {
    return this.#length;
  }
}
