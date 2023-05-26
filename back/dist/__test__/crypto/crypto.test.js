"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_constant_1 = require("@constants/block.constant");
const block_1 = __importDefault(require("@core/block/block"));
const crpyto_module_1 = __importDefault(require("@core/crypto/crpyto.module"));
describe("cryptoModule TEST", () => {
    let crypto;
    let block;
    beforeEach(() => {
        crypto = new crpyto_module_1.default();
        block = new block_1.default(crypto);
    });
    describe("SHA256 TEST", () => {
        it("해쉬값이 32byte로 제대로 잘 만들어지는가", () => {
            const data = "hello world";
            const result = crypto.SHA256(data);
            console.log(result);
            // b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
            expect(result.length).toBe(64);
        });
    });
    describe("createBlockHash TEST", () => {
        describe("createBlockHash", () => {
            it("genesis block hash 생성하기", () => {
                const blockdata = {
                    version: block_constant_1.GENESIS.version,
                    height: block_constant_1.GENESIS.height,
                    timestamp: block_constant_1.GENESIS.timestamp,
                    previousHash: block_constant_1.GENESIS.previousHash,
                    merkleRoot: block_constant_1.GENESIS.merkleRoot,
                    nonce: block_constant_1.GENESIS.nonce,
                    difficulty: block_constant_1.GENESIS.difficulty,
                    data: "",
                };
                const hash = crypto.createBlockHash(blockdata);
                console.log(hash);
                // 84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370
                expect(hash).toHaveLength(64);
            });
        });
    });
    describe("merkleroot TEST", () => {
        it("merkelRoot 값이 제대로 생성되는가", () => {
            const data = block_constant_1.GENESIS.data;
            const merkleRoot = crypto.merkleRoot(data);
            console.log(merkleRoot);
            expect(merkleRoot).toHaveLength(64);
        });
    });
    describe("block TEST", () => {
        it("createBlockInfo", () => {
            const newBlockInfo = block.createBlockInfo(block_constant_1.GENESIS);
            console.log(newBlockInfo);
            expect(newBlockInfo.height).toBe(2);
        });
        it("createBlockData", () => {
            const data = "";
            const newBlockData = block.createBlockData(block_constant_1.GENESIS, data);
            console.log(newBlockData);
            expect(newBlockData.height).toBe(block_constant_1.GENESIS.height + 1);
        });
        it;
    });
});
