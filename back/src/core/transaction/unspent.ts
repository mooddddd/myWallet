import {
  TransactionData,
  TransactionRow,
  TxIn,
  TxOut,
  UnspentTxOut,
  UnspentTxOutPool,
} from "./transaction.interface";

class Unspent {
  private readonly UTXOs: UnspentTxOutPool = [];

  getUnspentTxPool() {
    return this.UTXOs;
  }

  createUTXO(hash: string) {
    return (txOut: TxOut, txOutIndex: number) => {
      const { amount, account } = txOut;
      this.UTXOs.push({ txOutId: hash, txOutIndex, account, amount });
    };
  }

  myUTXOs(account: string): UnspentTxOut[] {
    const myUTXOs = this.UTXOs.filter((utxo) => utxo.account === account);
    return myUTXOs;
  }

  getAmount(myUTXOs: UnspentTxOut[]) {
    return myUTXOs.reduce((acc, utxo) => acc + utxo.amount, 0);
  }

  isAmount(account: string, sendAmount: number) {
    const myUTXOs = this.myUTXOs(account);
    const totalAmount = this.getAmount(myUTXOs);
    if (totalAmount < sendAmount) return true;
    return false;
  }

  // 싱크 맞추고 업데이트 및 삭제
  sync(transactions: TransactionData) {
    if (typeof transactions === "string") return;
    transactions.forEach(this.update.bind(this));
  }
  update(transaction: TransactionRow): void {
    const { txIns, txOuts, hash } = transaction;
    if (!hash) throw new Error("UTXO Update Error: 해시값이 없습니다");

    txOuts.forEach(this.createUTXO(hash));
    txIns.forEach(this.delete.bind(this));
  }
  delete(txIn: TxIn) {
    const { txOutId, txOutIndex } = txIn;
    const index = this.UTXOs.findIndex((utxo: UnspentTxOut) => {
      return utxo.txOutId === txOutId && utxo.txOutIndex === txOutIndex;
    });

    if (index !== -1) this.UTXOs.splice(index, 1);
  }
}

export default Unspent;
