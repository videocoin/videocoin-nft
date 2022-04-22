const BN = require('bn.js');

const encode = (data, alphabet, bitsPerChar) => {
    const pad = alphabet[alphabet.length - 1] === '='
    const mask = (1 << bitsPerChar) - 1
    let out = ''

    let bits = 0 // Number of bits currently in the buffer
    let buffer = 0 // Bits waiting to be written out, MSB first
    for (let i = 0; i < data.length; ++i) {
        // Slurp data into the buffer:
        buffer = (buffer << 8) | data[i]
        bits += 8

        // Write out as much as we can:
        while (bits > bitsPerChar) {
            bits -= bitsPerChar
            out += alphabet[mask & (buffer >> bits)]
        }
    }

    // Partial character:
    if (bits) {
        out += alphabet[mask & (buffer << (bitsPerChar - bits))]
    }

    return out
}


const encodeBN = (data, alphabet, bitsPerChar) => {
    const mask = (1 << bitsPerChar) - 1
    let out = ''

    const header = new BN('01551220', 16);
    const word = new BN('ff', 16)

    let bits = 0 // Number of bits currently in the buffer
    let buffer = 0 // Bits waiting to be written out, MSB first
    for (let i = 0; i < 36; ++i) {
        let bt;
        if (i < 4) {
            bt = header.shrn(4 * 8 - (i + 1) * 8).and(word).toNumber();
        } else {
            bt = data.shrn(32 * 8 - (i - 3) * 8).and(word).toNumber();
        }
        // Slurp data into the buffer:
        buffer = (buffer << 8) | bt
        bits += 8;

        // Write out as much as we can:
        while (bits > bitsPerChar) {
            bits -= bitsPerChar
            out += alphabet[mask & (buffer >> bits)]
        }
    }

    // Partial character:
    if (bits) {
        out += alphabet[mask & (buffer << (bitsPerChar - bits))]
    }

    return out
}

const buff = Buffer.from('01551220eb3fc29e6eda71da58131a581848d4b07355c350a5aae3268f5b271c1bdf286d', 'hex');
const b = encode(buff, 'abcdefghijklmnopqrstuvwxyz234567', 5);
console.log(b);

const bn = encodeBN(new BN('eb3fc29e6eda71da58131a581848d4b07355c350a5aae3268f5b271c1bdf286d', 16), 'abcdefghijklmnopqrstuvwxyz234567', 5);
console.log(bn);