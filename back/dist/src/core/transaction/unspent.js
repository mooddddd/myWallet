"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Unspent {
    constructor() {
        this.UTXOs = [];
    }
    getUnspentTxPool() {
        return this.UTXOs;
    }
    createUTXO(hash) {
        return (txOut, txOutIndex) => {
            const { amount, account } = txOut;
            this.UTXOs.push({ txOutId: hash, txOutIndex, account, amount });
        };
    }
    myUTXOs(account) {
        const myUTXOs = this.UTXOs.filter((utxo) => utxo.account === account);
        return myUTXOs;
    }
    getAmount(myUTXOs) {
        return myUTXOs.reduce((acc, utxo) => acc + utxo.amount, 0);
    }
    isAmount(account, sendAmount) {
        const myUTXOs = this.myUTXOs(account);
        const totalAmount = this.getAmount(myUTXOs);
        if (totalAmount < sendAmount)
            return true;
        return false;
    }
    // 싱크 맞추고 업데이트 및 삭제
    sync(transactions) {
        if (typeof transactions === "string")
            return;
        transactions.forEach(this.update.bind(this));
    }
    update(transaction) {
        const { txIns, txOuts, hash } = transaction;
        if (!hash)
            throw new Error("UTXO Update Error: 해시값이 없습니다");
        txOuts.forEach(this.createUTXO(hash));
        txIns.forEach(this.delete.bind(this));
    }
    delete(txIn) {
        const { txOutId, txOutIndex } = txIn;
        const index = this.UTXOs.findIndex((utxo) => {
            return utxo.txOutId === txOutId && utxo.txOutIndex === txOutIndex;
        });
        if (index !== -1)
            this.UTXOs.splice(index, 1);
    }
}
exports.default = Unspent;
