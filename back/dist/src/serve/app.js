"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
exports.default = (blockChain, p2p) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.send(`hello Wallet`);
    });
    // account 추가 => 객채인 accounts가 벗겨저서 리턴
    app.put("/accounts", (req, res) => {
        try {
            const account = blockChain.accounts.createWallet();
            res.json(Object.assign({}, account));
        }
        catch (e) {
            throw Error(`PUT ACCOUNT ERROR`);
        }
    });
    // account 조회 => account 리스트가 배열형태로 리턴됨
    app.get("/accounts", (req, res) => {
        try {
            const accounts = blockChain.accounts.getAccounts();
            res.json(accounts);
        }
        catch (e) {
            throw Error(`GET ACCOUNT ERROR`);
        }
    });
    // 블럭 캐기 => 프론트에서 account를 담아서 날리면 해당 계정에 리워드로 50씩 추가됨
    app.post("/mineBlock", (req, res) => {
        try {
            const { account } = req.body;
            const newBlock = blockChain.mineBlock(account);
            // 블록을 마이닝 하면 그 정보를 연결되어 있는 소켓에게 뿌림
            // p2p.broadcast(p2p.message.getAllBlockMessage());
            res.json(newBlock);
        }
        catch (e) {
            throw Error(`MINE BLOCK ERROR`);
        }
    });
    // 프론트에서 넘어온 account로 해당 어카운트의 잔액 찾기
    app.post("/getBalance", (req, res) => {
        try {
            const { account } = req.body;
            const balance = blockChain.getBalance(account);
            console.log(account, balance);
            res.json({ balance });
        }
        catch (e) {
            throw Error(`GET BALANCE ERROR`);
        }
    });
    // 다른 계정과의 거래가 생기면 거래에 대한 트랜잭션을 생성, 프론트에서는 영수증 변수로 내용을 받는다.
    app.post("/transaction", (req, res) => {
        try {
            const { sender, received } = req.body;
            const amount = parseInt(req.body.amount);
            const { publicKey, privateKey } = blockChain.accounts.getBalance(sender);
            const receipt = blockChain.accounts.signTheReceipt({
                sender: { account: sender, publicKey },
                received,
                amount,
            }, privateKey);
            const transaction = blockChain.sendTransaction(receipt);
            p2p.broadcast(p2p.message.getReceivedTransactionMessage(transaction));
            // 해당 거래에 대한 트랜잭션 로우를 반환해준다.
            res.json({ transaction });
        }
        catch (e) {
            throw Error(`CREATE TRANSACTION ERROR`);
        }
    });
    // 다른 피어가 내 서버에 접속하기 위해 아래 라우터로 들어오면 됨
    app.post("/addPeer", (req, res) => {
        try {
            const { host, port } = req.body;
            p2p.connect(parseInt(port), host);
            res.send(`connection`);
        }
        catch (e) {
            throw Error(`ADD PEER ERROR`);
        }
    });
    // 현재 연결되어 있는 피어들 목록
    app.get("/peers", (req, res) => {
        try {
            const socket = p2p.sockets.map((socket) => `${socket.remoteAddress}:${socket.remotePort}`);
            res.json(socket);
        }
        catch (e) {
            throw Error(`GET PEER LIST ERROR`);
        }
    });
    // 현재 내가 가지고 있는 체인을 반환해줌
    app.get("mychain", (req, res) => {
        try {
            res.json(blockChain.chain.get());
        }
        catch (e) {
            throw Error(`GET MY CHAIN LIST ERROR`);
        }
    });
    // app.get()
    return app;
};
