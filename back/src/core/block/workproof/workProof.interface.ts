import { Difficulty, Height, Timestamp } from "types/block";
import { BlockData, IBlock } from "../block.interface";

export interface ProofOfWorkProps {
  blockData: BlockData;
  adjustmentBlock: IBlock;
}

export interface DifficultyProps {
  height: Height;
  currentTime: Timestamp;
  adjTime: Timestamp;
  difficulty: Difficulty;
}

export interface ProofOfStakeProps {}

export type ProofProps = ProofOfStakeProps | ProofOfWorkProps;

export interface Proof {
  execute(props: ProofProps): IBlock;
}
