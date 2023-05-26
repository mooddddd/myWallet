import { IBlock } from "@core/block/block.interface";
import { TransactionRow } from "@core/transaction/transaction.interface";

// export const latestBlock = "latestBlock";
// export const allBlock = "allBlock";
// export const receivedChain = "receivedChain";
// export const receivedTransaction = "receivedTransaction";

export type MessageType =
  | "latestBlock"
  | "allBlock"
  | "receivedChain"
  | "receivedTransaction";

export type Payload = IBlock | IBlock[] | TransactionRow;

export interface MessageData {
  type: MessageType;
  payload: Payload;
}
