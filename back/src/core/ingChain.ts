import Block from "./block/block";
import { IBlock } from "./block/block.interface";
import Chain from "./chain/chain";
import Transaction from "./transaction/transaction";
import { TransactionRow } from "./transaction/transaction.interface";
import Unspent from "./transaction/unspent";
import Wallet from "./wallet/wallet";
import { Receipt } from "./wallet/wallet.interface";

class IngChain {
  constructor(
    public readonly chain: Chain,
    public readonly block: Block,
    private readonly transaction: Transaction,
    private readonly unspent: Unspent,
    readonly accounts: Wallet
  ) {}

  // 블럭 마이닝
  mineBlock(account: string) {
    const latestBlock = this.chain.latestBlock();
    const adjBlock = this.chain.getAdjustmentBlock();
    const transactions = this.transaction.getPool();
    const coinbase = this.transaction.createConinbase(
      account,
      latestBlock.height
    );
    const newBlock = this.block.createNewBlock(
      latestBlock,
      [coinbase, ...transactions],
      adjBlock
    );

    this.chain.addInChain(newBlock);
    console.log(`IngChain - mineBlock success : 블럭이 생성되었습니다.`);

    this.unspent.sync(newBlock.data);
    this.transaction.sync(newBlock.data);

    return this.chain.latestBlock();
  }

  sendTransaction(receipt: Receipt) {
    const isValid = this.accounts.verifyRecepit(receipt);
    if (!isValid) throw Error(`sendTransaction : 올바르지 않은 영수증입니다.`);

    const myUTXOs = this.unspent.myUTXOs(receipt.sender.account);
    const sender_balance = this.unspent.getAmount(myUTXOs);
    if (sender_balance < receipt.amount)
      throw Error(`sendTransaction : 잔액이 부족합니다.`);

    const tx = this.transaction.createTxFromReceipt(receipt, myUTXOs);
    return tx;
  }

  getBalance(account: string) {
    const myUTXOs = this.unspent.myUTXOs(account);
    const balance = this.unspent.getAmount(myUTXOs);
    return balance;
  }

  addBlockInChain(receivedBlock: IBlock): boolean {
    this.block.isValidBlockHash(receivedBlock);

    const isValid = this.chain.isValidChain(
      receivedBlock,
      this.chain.latestBlock()
    );
    if (!isValid) return false;

    this.chain.addInChain(receivedBlock);
    console.log(
      `Ingchain - success add block: 블록 내용이 체인에 추가되었습니다.`
    );
    return true;
  }

  // 최신 체인이 오면 원래 있던 체인(배열) 싹 지우고 다시 업데이트해서 싱크 맞춤
  replaceChain(receivedChain: IBlock[]): void {
    // 1) 수신받은 체인이 제네시스 블럭뿐이면 리턴
    if ((receivedChain.length = 1)) return;

    const isValidChain = this.chain.isValidAllChain(receivedChain);
    // 2) 수신 받은 체인이 검증되지 않았으면 리턴
    if (!isValidChain) return;

    const cclb = this.chain.latestBlock(); // 갖고 있는 최신 블럭
    const rclb = receivedChain[receivedChain.length - 1]; // 받은 체인 중 가장 최신 블럭
    if (rclb.height <= cclb.height) {
      // 3) 받은 체인의 최신 블럭보다 내가 가지고 있는 블럭이 더 최신이거나 같으면(높이가 더 높거나 같으면) 리턴
      console.log(
        `replaceChain: 현재 갖고 있는 블럭의 길이가 더 길거나 같습니다.`
      );
      return;
    }

    // 수신받은 체인이 더 최신일 경우 아래 코드 작동
    this.chain.clear(); // 내 체인 비우기
    receivedChain.shift(); // 보낸 체인의 제네시스 블럭 지워줌
    receivedChain.forEach((block) => {
      this.chain.addInChain.bind(this.chain);
      this.unspent.sync(block.data);
    });
    console.log(`replace Chain Success: 체인이 변경되었습니다.`);
  }

  replaceTransaction(receivedTx: TransactionRow) {
    // 트랜잭션 풀에 있는 앤지 아닌지 검증. false인 경우에는 새로운 트랜잭션이기 때문에 pool에 추가해줘야 함
    const withTx = this.transaction.containTransaction(receivedTx);
    if (withTx) return;

    this.transaction.addInPool(receivedTx);
    console.log(`replce Tx: ${receivedTx}내용이 추가되었습니다. `);
  }
}
export default IngChain;
