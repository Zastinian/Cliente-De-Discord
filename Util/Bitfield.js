const BitfieldInvalid = require("../Errors/BitfieldInvalid");

class Bitfield {
  constructor(bit = this.constructor.defaultBit) {
    this.bitfield = this.constructor.resolve(bit);
  }

  any(...bit) {
    return (
      (this.bitfield & this.constructor.resolve(bit)) !==
      this.constructor.defaultBit
    );
  }

  has(...bit) {
    bit = this.constructor.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  add(...bit) {
    bit = this.constructor.resolve(bit);
    this.bitfield |= bit;
    return this;
  }

  remove(...bits) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }

    if (Object.isFrozen(this))
      return new this.cache.constructor(total & ~total);
    this.bitfield &= ~total;
    return this;
  }

  toArray() {
    return Object.keys(this.constructor.FLAGS).filter((o) => this.has(o));
  }

  toString() {
    return this.bitfield.toString();
  }

  serialize() {
    let obj = {};
    for (let [index, val] of Object.entries(this.constructor.FLAGS)) {
      if (this.has(index)) {
        obj[index] = val;
      }
    }

    return obj;
  }

  freeze() {
    return Object.freeze(this);
  }

  static resolve(bit) {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return bit;
    if (bit instanceof Bitfield) return bit.bitfield;
    if (Array.isArray(bit))
      return bit
        ?.map((o) => this.resolve(o))
        .reduce((a, b) => a | b, defaultBit);
    if (typeof bit === "string") {
      if (typeof this.FLAGS[bit] !== "undefined") return this.FLAGS[bit];
      if (!isNaN(bit))
        return typeof defaultBit === "bigint" ? BigInt(bit) : Number(bit);
    }

    throw new BitfieldInvalid({
      message: `El bifield que has especificado no es válido o no se encuentra`,
      bit: bit,
    });
  }
}

Bitfield.FLAGS = {};

Bitfield.defaultBit = 0n;

module.exports = Bitfield;
