import { VERSION } from "@constants/block.constant";
import { BlockData, BlockInfo, IBlock } from "./block.interface";
import { TransactionData } from "@core/transaction/transaction.interface";
import CryptoMoudle from "@core/crypto/crpyto.module";
import WorkProof from "./workproof/workProof";

class Block {
  constructor(
    private readonly cryto: CryptoMoudle,
    private readonly workProof: WorkProof
  ) {}

  createBlockInfo(previousBlock: IBlock): BlockInfo {
    const newBlockInfo = new BlockInfo();

    newBlockInfo.version = VERSION;
    newBlockInfo.height = previousBlock.height + 1;
    newBlockInfo.timestamp = new Date().getTime();
    newBlockInfo.previousHash = previousBlock.hash;
    // nonce와 difficulty값은 마이닝시에 정해질 값이다.

    return newBlockInfo;
  }

  createBlockData(previousBlock: IBlock, data: TransactionData): BlockData {
    const newBlockInfo = this.createBlockInfo(previousBlock);
    return {
      // 리턴값으로는 해쉬를 제외한 모든 정보들이 들어가있어야 한다(넌스, 난이도값은 제외).
      // 여기서 생성된 값으로 해쉬를 만든다.-
      ...newBlockInfo,
      merkleRoot: this.cryto.merkleRoot(data),
      data,
    } as BlockData;
  }

  createNewBlock(
    previousBlock: IBlock,
    data: TransactionData,
    adjustmentBlock: IBlock
  ) {
    const blockData = this.createBlockData(previousBlock, data);
    const newBlock = this.workProof.run(blockData, adjustmentBlock);

    return newBlock;
  }

  isValidBlockHash(block: IBlock) {
    this.cryto.isValidHash(block.hash);
    const validHash = this.cryto.createBlockHash(block);
    if (validHash !== block.hash)
      throw new Error(
        `블록 해시값이 올바르지 않습니다. 생성해시 : ${validHash} / 블록해시 : ${block.hash}`
      );
  }
}

export default Block;
