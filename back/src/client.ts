import Block from "@core/block/block";
import ProofOfWork from "@core/block/workproof/proofOfWork";
import WorkProof from "@core/block/workproof/workProof";
import Chain from "@core/chain/chain";
import CryptoModule from "@core/crypto/crpyto.module";
import Ingchain from "@core/ingChain";
import Transaction from "@core/transaction/transaction";
import Unspent from "@core/transaction/unspent";
import DigitalSignature from "@core/wallet/digitalSignature";
import Wallet from "@core/wallet/wallet";
import Message from "@serve/message";
import P2PNetwork from "@serve/p2p";

const chain = new Chain();
const crypto = new CryptoModule();
const Proof = new ProofOfWork(crypto);
const workProof = new WorkProof(Proof);
const block = new Block(crypto, workProof);
const transaction = new Transaction(crypto);
const unspent = new Unspent();
const digitalSigniture = new DigitalSignature(crypto);
const accounts = new Wallet(digitalSigniture);

const mood = new Ingchain(chain, block, transaction, unspent, accounts);
const message = new Message(mood);

const p2p = new P2PNetwork(message);
p2p.listen(8556);
p2p.connect(8555, "127.0.0.1");
