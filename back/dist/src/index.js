"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("@core/block/block"));
const proofOfWork_1 = __importDefault(require("@core/block/workproof/proofOfWork"));
const workProof_1 = __importDefault(require("@core/block/workproof/workProof"));
const chain_1 = __importDefault(require("@core/chain/chain"));
const crpyto_module_1 = __importDefault(require("@core/crypto/crpyto.module"));
const ingChain_1 = __importDefault(require("@core/ingChain"));
const transaction_1 = __importDefault(require("@core/transaction/transaction"));
const unspent_1 = __importDefault(require("@core/transaction/unspent"));
const digitalSignature_1 = __importDefault(require("@core/wallet/digitalSignature"));
const wallet_1 = __importDefault(require("@core/wallet/wallet"));
const app_1 = __importDefault(require("@serve/app"));
const message_1 = __importDefault(require("@serve/message"));
const p2p_1 = __importDefault(require("@serve/p2p"));
const crypto = new crpyto_module_1.default();
const proof = new proofOfWork_1.default(crypto);
const workProof = new workProof_1.default(proof);
const chain = new chain_1.default();
const block = new block_1.default(crypto, workProof);
const transaction = new transaction_1.default(crypto);
const unspent = new unspent_1.default();
const digitalSignaure = new digitalSignature_1.default(crypto);
const accounts = new wallet_1.default(digitalSignaure);
const mood = new ingChain_1.default(chain, block, transaction, unspent, accounts);
const message = new message_1.default(mood);
const p2p = new p2p_1.default(message);
const app = (0, app_1.default)(mood, p2p);
const { account } = accounts.createWallet();
mood.mineBlock(account);
const port = 8545;
app.listen(port, () => {
    console.log(`server start! app port: ${port}`);
    p2p.listen(8555);
});
