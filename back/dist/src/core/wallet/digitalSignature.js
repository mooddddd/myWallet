"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const elliptic_1 = __importDefault(require("elliptic"));
class DigitalSignature {
    constructor(crypto) {
        this.crypto = crypto;
        this.ec = new elliptic_1.default.ec("secp256k1");
    }
    // 계정을 만들면 가장 먼저 개인키가 랜덤으로 생성, 개인키로 공개키를 생성, 공개키로 어카운트 생성
    createPrivateKey() {
        return (0, crypto_1.randomBytes)(32).toString("hex");
    }
    createPublicKey(privateKey) {
        const keyPair = this.ec.keyFromPrivate(privateKey);
        const publicKey = keyPair.getPublic().encode("hex", true);
        return publicKey;
    }
    createAccount(publicKey) {
        const buffer = Buffer.from(publicKey);
        const account = buffer.slice(26).toString();
        return account;
    }
    makeSign(privateKey, receipt) {
        const keypair = this.ec.keyFromPrivate(privateKey);
        const receiptHash = this.crypto.createReceipHash(receipt);
        const signature = keypair.sign(receiptHash, "hex").toDER("hex");
        receipt.signature = signature;
        return receipt;
    }
    verify(receipt) {
        const { sender: { publicKey }, signature, } = receipt;
        if (!publicKey || !signature)
            throw new Error("Receipt Verify Error: 영수증 내용이 올바르지 않습니다.");
        const receiptHash = this.crypto.createReceipHash(receipt);
        return this.ec.verify(receiptHash, signature, this.ec.keyFromPublic(publicKey, "hex"));
    }
}
exports.default = DigitalSignature;
