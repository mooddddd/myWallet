import Block from "@core/block/block";
import ProofOfWork from "@core/block/workproof/proofOfWork";
import WorkProof from "@core/block/workproof/workProof";
import Chain from "@core/chain/chain";
import CryptoMoudle from "@core/crypto/crpyto.module";
import IngChain from "@core/ingChain";
import Transaction from "@core/transaction/transaction";
import Unspent from "@core/transaction/unspent";
import DigitalSignature from "@core/wallet/digitalSignature";
import Wallet from "@core/wallet/wallet";
import App from "@serve/app";
import Message from "@serve/message";
import P2PNetwork from "@serve/p2p";

const crypto = new CryptoMoudle();
const proof = new ProofOfWork(crypto);
const workProof = new WorkProof(proof);
const chain = new Chain();
const block = new Block(crypto, workProof);
const transaction = new Transaction(crypto);
const unspent = new Unspent();
const digitalSignaure = new DigitalSignature(crypto);
const accounts = new Wallet(digitalSignaure);
const mood = new IngChain(chain, block, transaction, unspent, accounts);
const message = new Message(mood);
const p2p = new P2PNetwork(message);
const app = App(mood, p2p);

const { account } = accounts.createWallet();
mood.mineBlock(account);

const port = 8545;

app.listen(port, () => {
  console.log(`server start! app port: ${port}`);
  p2p.listen(8555);
});
