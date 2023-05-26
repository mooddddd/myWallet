"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_constant_1 = require("@constants/block.constant");
const block_interface_1 = require("./block.interface");
class Block {
    constructor(cryto, workProof) {
        this.cryto = cryto;
        this.workProof = workProof;
    }
    createBlockInfo(previousBlock) {
        const newBlockInfo = new block_interface_1.BlockInfo();
        newBlockInfo.version = block_constant_1.VERSION;
        newBlockInfo.height = previousBlock.height + 1;
        newBlockInfo.timestamp = new Date().getTime();
        newBlockInfo.previousHash = previousBlock.hash;
        // nonce와 difficulty값은 마이닝시에 정해질 값이다.
        return newBlockInfo;
    }
    createBlockData(previousBlock, data) {
        const newBlockInfo = this.createBlockInfo(previousBlock);
        return Object.assign(Object.assign({}, newBlockInfo), { merkleRoot: this.cryto.merkleRoot(data), data });
    }
    createNewBlock(previousBlock, data, adjustmentBlock) {
        const blockData = this.createBlockData(previousBlock, data);
        const newBlock = this.workProof.run(blockData, adjustmentBlock);
        return newBlock;
    }
    isValidBlockHash(block) {
        this.cryto.isValidHash(block.hash);
        const validHash = this.cryto.createBlockHash(block);
        if (validHash !== block.hash)
            throw new Error(`블록 해시값이 올바르지 않습니다. 생성해시 : ${validHash} / 블록해시 : ${block.hash}`);
    }
}
exports.default = Block;
