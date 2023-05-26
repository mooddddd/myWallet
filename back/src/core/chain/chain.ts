import {
  DIFFICULTY_ADJUSTMENT_INTERVAL,
  GENESIS,
} from "@constants/block.constant";
import { IBlock } from "@core/block/block.interface";

class Chain {
  private readonly chain: IBlock[] = [GENESIS];
  private readonly INTERVAL: number = DIFFICULTY_ADJUSTMENT_INTERVAL;

  get(): IBlock[] {
    return this.chain;
  }
  length(): number {
    return this.chain.length;
  }
  clear(): IBlock[] {
    return this.chain.splice(1);
  }
  latestBlock(): IBlock {
    return this.chain[this.length() - 1];
  }

  addInChain(receivedChain: IBlock) {
    this.chain.push(receivedChain);
    return this.latestBlock();
  }

  getBlock(callbackFn: (block: IBlock) => boolean): IBlock {
    const findBlock = this.chain.find(callbackFn);
    if (!findBlock)
      throw new Error("chain-getBlock : 블록을 찾을 수 없습니다.");
    return findBlock;
  }
  getBlockByHash(hash: string): IBlock {
    return this.getBlock((block: IBlock) => block.hash === hash);
  }
  getBlockByHeight(height: number): IBlock {
    return this.getBlock((block: IBlock) => block.height === height);
  }

  getAdjustmentBlock(): IBlock {
    const { height } = this.latestBlock();
    const findHeight =
      height < this.INTERVAL
        ? 1
        : Math.floor(height / this.INTERVAL) * this.INTERVAL;

    return this.getBlockByHeight(findHeight);
  }

  serialize(): string {
    return JSON.stringify(this.chain);
  }
  deserialize(chunk: string) {
    return JSON.parse(chunk);
  }

  isValidChain(newBlock: IBlock, previousBlock: IBlock): boolean {
    if (previousBlock.height + 1 !== newBlock.height) return false;
    if (previousBlock.hash !== newBlock.hash) return false;
    return true;
  }
  isValidAllChain(chain: IBlock[]) {
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];
      const isValidBlock = this.isValidChain(currentBlock, previousBlock);
      if (!isValidBlock) return false;
      return true;
    }
  }
}
export default Chain;
