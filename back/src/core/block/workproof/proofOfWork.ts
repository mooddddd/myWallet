import {
  BLOCK_GENERATION_INTERVAL,
  DIFFICULTY_ADJUSTMENT_INTERVAL,
} from "@constants/block.constant";
import { IBlock } from "../block.interface";
import {
  DifficultyProps,
  Proof,
  ProofOfWorkProps,
} from "./workProof.interface";
import CryptoMoudle from "@core/crypto/crpyto.module";

class ProofOfWork implements Proof {
  constructor(private readonly crypto: CryptoMoudle) {}

  execute(props: ProofOfWorkProps): IBlock {
    const { blockData, adjustmentBlock } = props;
    let block: IBlock = { ...blockData, hash: "" };
    // blockData에는 merkleRoot와 data가 들어가 있음

    do {
      block.nonce += 1;
      block.timestamp = new Date().getTime();
      const difficultyProps = this.getDifficultyProps(block, adjustmentBlock);
      block.difficulty = this.getDifficulty(difficultyProps);
      block.hash = this.crypto.createBlockHash(block);
    } while (
      !this.crypto
        .hashToBinary(block.hash)
        .startsWith("0".repeat(block.difficulty))
    );

    return block as IBlock;
  }

  getDifficultyProps(block: IBlock, adjustmentBlock: IBlock): DifficultyProps {
    const { height, timestamp: currentTime } = block;
    // height는 블럭의 높이에 따라 adjustmentBlock은 달라지기 때문에 필요하다.
    // 1~19까지는 제네시스 블럭,
    // 20번째 블럭부터는 자신의 블럭 높이에 -10을 한 블럭이 adjustmentBlock이 된다.
    const { difficulty, timestamp: adjTime } = adjustmentBlock;

    return { height, currentTime, difficulty, adjTime };
  }

  getDifficulty(props: DifficultyProps): number {
    const { height, currentTime, difficulty, adjTime } = props;

    if (height <= 0)
      throw new Error("getDifficulty Error: 블럭의 높이가 0 이하입니다.");
    // 높이 1~9까지는 difficulty를 0, 10~19까지는 1로 고정해준다. 20부터는 걸린 시간에 따라 난이도값이 달라진다.
    if (height < 10) return 0;
    if (height < 20) return 1;
    if (height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0) return difficulty;

    const timeTaken = currentTime - adjTime;
    const timeExpected =
      BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;

    if (timeTaken < timeExpected / 2) return difficulty + 1; // 걸린 시간이 (예상시간/2)보다 짧을 떄
    if (timeTaken > timeExpected * 2) return difficulty - 1; // 걸린 시간이 (예상시간*2)보다 길 때

    return difficulty;
  }
}

export default ProofOfWork;
