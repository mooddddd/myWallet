"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_constant_1 = require("@constants/block.constant");
class Chain {
    constructor() {
        this.chain = [block_constant_1.GENESIS];
        this.INTERVAL = block_constant_1.DIFFICULTY_ADJUSTMENT_INTERVAL;
    }
    get() {
        return this.chain;
    }
    length() {
        return this.chain.length;
    }
    clear() {
        return this.chain.splice(1);
    }
    latestBlock() {
        return this.chain[this.length() - 1];
    }
    addInChain(receivedChain) {
        this.chain.push(receivedChain);
        return this.latestBlock();
    }
    getBlock(callbackFn) {
        const findBlock = this.chain.find(callbackFn);
        if (!findBlock)
            throw new Error("chain-getBlock : 블록을 찾을 수 없습니다.");
        return findBlock;
    }
    getBlockByHash(hash) {
        return this.getBlock((block) => block.hash === hash);
    }
    getBlockByHeight(height) {
        return this.getBlock((block) => block.height === height);
    }
    getAdjustmentBlock() {
        const { height } = this.latestBlock();
        const findHeight = height < this.INTERVAL
            ? 1
            : Math.floor(height / this.INTERVAL) * this.INTERVAL;
        return this.getBlockByHeight(findHeight);
    }
    serialize() {
        return JSON.stringify(this.chain);
    }
    deserialize(chunk) {
        return JSON.parse(chunk);
    }
    isValidChain(newBlock, previousBlock) {
        if (previousBlock.height + 1 !== newBlock.height)
            return false;
        if (previousBlock.hash !== newBlock.hash)
            return false;
        return true;
    }
    isValidAllChain(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];
            const isValidBlock = this.isValidChain(currentBlock, previousBlock);
            if (!isValidBlock)
                return false;
            return true;
        }
    }
}
exports.default = Chain;
