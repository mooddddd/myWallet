import { SignatureInput } from "elliptic";
import {
  TransactionData,
  TransactionPool,
  TxOut,
  UnspentTxOut,
} from "./transaction.interface";
import { TxIn } from "./transaction.interface";
import { TransactionRow } from "./transaction.interface";
import CryptoMoudle from "@core/crypto/crpyto.module";
import { Receipt } from "@core/wallet/wallet.interface";

class Transaction {
  private readonly REWARD = 50;
  private readonly transactionPool: TransactionPool = [];

  constructor(private readonly crypto: CryptoMoudle) {}

  getPool() {
    return this.transactionPool;
  }
  addInPool(transaction: TransactionRow) {
    this.transactionPool.push(transaction);
  }

  // 영수증 기반 트랜잭션
  createTxFromReceipt(receipt: Receipt, myUTXOs: UnspentTxOut[]) {
    if (!receipt.signature)
      throw new Error("Create TX form Receipt: 서명이 존재하지 않습니다.");

    const [txIns, balance] = this.createInsFromReceipt(
      myUTXOs,
      receipt.amount,
      receipt.signature
    );
    const txOuts = this.createOutsFromReceipt(
      receipt.received,
      receipt.amount,
      receipt.sender.account,
      balance
    );
    const transaction: TransactionRow = {
      txIns,
      txOuts,
    };

    transaction.hash = this.serealizeTxRow(transaction);
    this.transactionPool.push(transaction);
    return transaction;
  }

  createOutsFromReceipt(
    received: string,
    amount: number,
    sender: string,
    balance: number
  ) {
    const txOuts: TxOut[] = [];

    txOuts.push({ account: received, amount });
    if (balance - amount > 0) {
      txOuts.push({ account: sender, amount: balance - amount });
    }
    const outAmount = txOuts.reduce(
      (acc, txOut: TxOut) => acc + txOut.amount,
      0
    );
    if (balance !== outAmount) throw new Error("금액 오류");

    return txOuts;
  }

  createInsFromReceipt(
    myUTXOs: UnspentTxOut[],
    receiptAmount: number,
    signature: SignatureInput
  ): [TxIn[], number] {
    let targetAmount = 0;
    const txIns = myUTXOs.reduce((accArr: TxIn[], utxo: UnspentTxOut) => {
      const { amount, txOutId, txOutIndex } = utxo;

      if (targetAmount >= receiptAmount) return accArr;
      targetAmount += amount;
      accArr.push({ txOutIndex, txOutId, signature });

      return accArr;
    }, [] as TxIn[]);
    return [txIns, targetAmount];
  }

  // 코인베이스 트랜잭션
  createConinbase(account: string, latestBlockHeight: number): TransactionRow {
    const txIn = this.createTxIn(latestBlockHeight + 1);
    const txOut = this.createTxOut(account, this.REWARD);
    return this.createTxRow([txIn], [txOut]);
  }

  // 기본 트랜잭션 틀
  createTxOut(account: string, amount: number): TxOut {
    if (account.length != 40)
      throw new Error("TxOut 생성 에러 : Account 형식이 올바르지 않습니다.");

    const txOut = new TxOut();
    txOut.account = account;
    txOut.amount = amount;
    return txOut;
  }
  serializeTxOut(txOut: TxOut) {
    const { account, amount } = txOut;
    const meterial = [account, amount].join("");
    return this.crypto.SHA256(meterial);
  }

  createTxIn(
    txOutIndex: number,
    txOutId?: string,
    signature?: SignatureInput
  ): TxIn {
    const txIn = new TxIn();
    txIn.txOutId = txOutId;
    txIn.txOutIndex = txOutIndex;
    txIn.signature = signature;
    return txIn;
  }
  serializeTxIn(txIn: TxIn) {
    const { txOutIndex } = txIn;
    const meterial = [txOutIndex].join("");
    return this.crypto.SHA256(meterial);
  }

  createTxRow(txIns: TxIn[], txOuts: TxOut[]): TransactionRow {
    const transactionRow = new TransactionRow();
    transactionRow.txOuts = txOuts;
    transactionRow.txIns = txIns;
    transactionRow.hash = this.serealizeTxRow(transactionRow);
    return transactionRow;
  }

  serializeTx<T>(arrData: T[], callback: (item: T) => string) {
    return arrData.reduce((acc: string, item: T) => acc + callback(item), "");
  }

  serealizeTxRow(txRow: TransactionRow) {
    // 예외처리 필요함
    const { txIns, txOuts } = txRow;
    const txOutsHash = this.serializeTx<TxOut>(txOuts, (item) =>
      this.serializeTxOut(item)
    );
    const txInsHash = this.serializeTx<TxIn>(txIns, (item) =>
      this.serializeTxIn(item)
    );

    return this.crypto.SHA256(txOutsHash + txInsHash);
  }

  // 트랜잭션 서버 연결시 필요한 메서드들
  // 새로운 row인지 아닌지 판별
  update(transaction: TransactionRow) {
    const findFn = (tx: TransactionRow) => transaction.hash === tx.hash;
    const index = this.transactionPool.findIndex(findFn);
    if (index !== -1) this.transactionPool.splice(index, 1);
  }
  // 배열의 각 객체에 update 메서드 사용
  sync(transactions: TransactionData) {
    if (typeof transactions === "string") return;
    transactions.forEach(this.update.bind(this));
  }
  // 받은 트랜잭션이 갖고 있는 트랜잭션 풀의 내용과 맞는지 안맞는지 판별 => 아닌 경우가 최신임!
  containTransaction(transaction: TransactionRow): boolean {
    return this.transactionPool.some(
      (tx: TransactionRow) => tx.hash === transaction.hash
    );
  }
}

export default Transaction;
