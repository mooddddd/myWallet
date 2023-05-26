"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Wallet {
    constructor(digitalSignature) {
        this.digitalSignature = digitalSignature;
        this.accounts = [];
    }
    // 계정(accounts, 지갑) 생성 => 개인키, 공개키, 어카운트 생성해줌!
    createWallet() {
        const privateKey = this.digitalSignature.createPrivateKey();
        const accounts = this.setWallet(privateKey);
        return accounts;
    }
    // privateKey를 받아서 그에 맞는 지갑 생성
    setWallet(privateKey) {
        const publicKey = this.digitalSignature.createPublicKey(privateKey);
        const account = this.digitalSignature.createAccount(publicKey);
        const accounts = {
            privateKey,
            publicKey,
            account,
        };
        this.accounts.push(accounts);
        return accounts;
    }
    // 해당 account의 잔액 계산
    getBalance(account) {
        const [response] = this.accounts.filter((v) => v.account === account);
        return response;
    }
    // 해당 accounts(계정, 지갑)정보 가져오기
    getAccounts() {
        const accounts = this.accounts.map((v) => v.account);
        return accounts;
    }
    // 해당 account의 privateKey 가져오기
    getPrivateKey(account) {
        return this.accounts.filter((v) => v.account === account)[0].account;
    }
    // 영수증 생성! sender의 정보는 이미 Accounts 배열에 저장되어 있음!
    createReceipt(received, amount) {
        const { account, publicKey, privateKey } = this.accounts[0];
        const sender = { account, publicKey };
        const receipt = this.digitalSignature.makeSign(privateKey, {
            sender,
            received,
            amount,
        });
        return receipt;
    }
    // 영수증에 서명하기
    signTheReceipt(receipt, privateKey) {
        return this.digitalSignature.makeSign(privateKey, receipt);
    }
    // 영수증이 올바른지 검증
    verifyRecepit(receipt) {
        return this.digitalSignature.verify(receipt);
    }
}
exports.default = Wallet;
