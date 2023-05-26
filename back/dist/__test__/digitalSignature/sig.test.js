"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crpyto_module_1 = __importDefault(require("@core/crypto/crpyto.module"));
const digitalSignature_1 = __importDefault(require("@core/wallet/digitalSignature"));
describe("sig TEST", () => {
    describe("create public key", () => {
        let crpyto;
        let digitalSignature;
        beforeEach(() => {
            crpyto = new crpyto_module_1.default();
            digitalSignature = new digitalSignature_1.default(crpyto);
        });
        it("Public Key from privateKey", () => {
            const privateKey = "9d37fcb17e898fe6569970adf2beeeaca3286e27254aae9df7ffa10a7161e294";
            const publicKey = digitalSignature.createPublicKey(privateKey);
            expect(publicKey).toBe("024e06f068a1b76958f91ce25ba45350193ebb2a61a61b7f869771bcbef0726d8e");
        });
        it("Account from PrivateKey", () => {
            const privateKey = "9d37fcb17e898fe6569970adf2beeeaca3286e27254aae9df7ffa10a7161e294";
            const publicKey = digitalSignature.createPublicKey(privateKey);
            const account = digitalSignature.createAccount(publicKey);
            expect(account).toBe("a45350193ebb2a61a61b7f869771bcbef0726d8e");
        });
    });
});
