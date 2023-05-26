"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_interface_1 = require("./transaction.interface");
const transaction_interface_2 = require("./transaction.interface");
const transaction_interface_3 = require("./transaction.interface");
class Transaction {
    constructor(crypto) {
        this.crypto = crypto;
        this.REWARD = 50;
        this.transactionPool = [];
    }
    getPool() {
        return this.transactionPool;
    }
    addInPool(transaction) {
        this.transactionPool.push(transaction);
    }
    // 영수증 기반 트랜잭션
    createTxFromReceipt(receipt, myUTXOs) {
        if (!receipt.signature)
            throw new Error("Create TX form Receipt: 서명이 존재하지 않습니다.");
        const [txIns, balance] = this.createInsFromReceipt(myUTXOs, receipt.amount, receipt.signature);
        const txOuts = this.createOutsFromReceipt(receipt.received, receipt.amount, receipt.sender.account, balance);
        const transaction = {
            txIns,
            txOuts,
        };
        transaction.hash = this.serealizeTxRow(transaction);
        this.transactionPool.push(transaction);
        return transaction;
    }
    createOutsFromReceipt(received, amount, sender, balance) {
        const txOuts = [];
        txOuts.push({ account: received, amount });
        if (balance - amount > 0) {
            txOuts.push({ account: sender, amount: balance - amount });
        }
        const outAmount = txOuts.reduce((acc, txOut) => acc + txOut.amount, 0);
        if (balance !== outAmount)
            throw new Error("금액 오류");
        return txOuts;
    }
    createInsFromReceipt(myUTXOs, receiptAmount, signature) {
        let targetAmount = 0;
        const txIns = myUTXOs.reduce((accArr, utxo) => {
            const { amount, txOutId, txOutIndex } = utxo;
            if (targetAmount >= receiptAmount)
                return accArr;
            targetAmount += amount;
            accArr.push({ txOutIndex, txOutId, signature });
            return accArr;
        }, []);
        return [txIns, targetAmount];
    }
    // 코인베이스 트랜잭션
    createConinbase(account, latestBlockHeight) {
        const txIn = this.createTxIn(latestBlockHeight + 1);
        const txOut = this.createTxOut(account, this.REWARD);
        return this.createTxRow([txIn], [txOut]);
    }
    // 기본 트랜잭션 틀
    createTxOut(account, amount) {
        if (account.length != 40)
            throw new Error("TxOut 생성 에러 : Account 형식이 올바르지 않습니다.");
        const txOut = new transaction_interface_1.TxOut();
        txOut.account = account;
        txOut.amount = amount;
        return txOut;
    }
    serializeTxOut(txOut) {
        const { account, amount } = txOut;
        const meterial = [account, amount].join("");
        return this.crypto.SHA256(meterial);
    }
    createTxIn(txOutIndex, txOutId, signature) {
        const txIn = new transaction_interface_2.TxIn();
        txIn.txOutId = txOutId;
        txIn.txOutIndex = txOutIndex;
        txIn.signature = signature;
        return txIn;
    }
    serializeTxIn(txIn) {
        const { txOutIndex } = txIn;
        const meterial = [txOutIndex].join("");
        return this.crypto.SHA256(meterial);
    }
    createTxRow(txIns, txOuts) {
        const transactionRow = new transaction_interface_3.TransactionRow();
        transactionRow.txOuts = txOuts;
        transactionRow.txIns = txIns;
        transactionRow.hash = this.serealizeTxRow(transactionRow);
        return transactionRow;
    }
    serializeTx(arrData, callback) {
        return arrData.reduce((acc, item) => acc + callback(item), "");
    }
    serealizeTxRow(txRow) {
        // 예외처리 필요함
        const { txIns, txOuts } = txRow;
        const txOutsHash = this.serializeTx(txOuts, (item) => this.serializeTxOut(item));
        const txInsHash = this.serializeTx(txIns, (item) => this.serializeTxIn(item));
        return this.crypto.SHA256(txOutsHash + txInsHash);
    }
    // 트랜잭션 서버 연결시 필요한 메서드들
    // 새로운 row인지 아닌지 판별
    update(transaction) {
        const findFn = (tx) => transaction.hash === tx.hash;
        const index = this.transactionPool.findIndex(findFn);
        if (index !== -1)
            this.transactionPool.splice(index, 1);
    }
    // 배열의 각 객체에 update 메서드 사용
    sync(transactions) {
        if (typeof transactions === "string")
            return;
        transactions.forEach(this.update.bind(this));
    }
    // 받은 트랜잭션이 갖고 있는 트랜잭션 풀의 내용과 맞는지 안맞는지 판별 => 아닌 경우가 최신임!
    containTransaction(transaction) {
        return this.transactionPool.some((tx) => tx.hash === transaction.hash);
    }
}
exports.default = Transaction;
