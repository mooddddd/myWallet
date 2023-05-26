"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_1 = __importDefault(require("merkle"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoMoudle {
    SHA256(data) {
        const hash = crypto_js_1.default.SHA256(data).toString();
        return hash;
    }
    createBlockHash(blockData) {
        const { version, height, timestamp, merkleRoot, previousHash, difficulty, nonce, } = blockData;
        const dataString = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`;
        return this.SHA256(dataString);
    }
    merkleRoot(data) {
        if (typeof data === "string") {
            return (0, merkle_1.default)("sha256").sync([data]).root();
        }
        else if (Array.isArray(data)) {
            const sync = data.filter(() => { }).map(() => { });
            return (0, merkle_1.default)("sha256").sync([sync]).root();
        }
    }
    isValidHash(hash) {
        const hexRegExp = /^[0-9a-fA-f]{64}$/;
        if (!hexRegExp.test(hash))
            throw new Error(`해쉬값이 올바르지 않습니다. Current HASH : ${hash} `);
    }
    hashToBinary(hash) {
        let binary = "";
        for (let i = 0; i < hash.length; i += 2) {
            const hexByte = hash.substr(i, 2);
            const decimal = parseInt(hexByte, 16);
            const binaryByte = decimal.toString(2).padStart(8, "0");
            binary += binaryByte;
        }
        return binary;
    }
    createReceipHash(receipt) {
        const { sender: { publicKey }, received, amount, } = receipt;
        const hashMaterial = [publicKey, received, amount].join("");
        return this.SHA256(hashMaterial);
    }
}
exports.default = CryptoMoudle;
