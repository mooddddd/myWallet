import { randomBytes } from "crypto";
import elliptic from "elliptic";
import { Receipt } from "./wallet.interface";
import CryptoMoudle from "@core/crypto/crpyto.module";

class DigitalSignature {
  private readonly ec = new elliptic.ec("secp256k1");
  constructor(private readonly crypto: CryptoMoudle) {}
  // 계정을 만들면 가장 먼저 개인키가 랜덤으로 생성, 개인키로 공개키를 생성, 공개키로 어카운트 생성
  createPrivateKey() {
    return randomBytes(32).toString("hex");
  }
  createPublicKey(privateKey: string) {
    const keyPair = this.ec.keyFromPrivate(privateKey);
    const publicKey = keyPair.getPublic().encode("hex", true);
    return publicKey;
  }
  createAccount(publicKey: string) {
    const buffer = Buffer.from(publicKey);
    const account = buffer.slice(26).toString();
    return account;
  }

  makeSign(privateKey: string, receipt: Receipt): Receipt {
    const keypair = this.ec.keyFromPrivate(privateKey);
    const receiptHash = this.crypto.createReceipHash(receipt);
    const signature = keypair.sign(receiptHash, "hex").toDER("hex");
    receipt.signature = signature;
    return receipt;
  }

  verify(receipt: Receipt): boolean {
    const {
      sender: { publicKey },
      signature,
    } = receipt;

    if (!publicKey || !signature)
      throw new Error("Receipt Verify Error: 영수증 내용이 올바르지 않습니다.");

    const receiptHash = this.crypto.createReceipHash(receipt);

    return this.ec.verify(
      receiptHash,
      signature,
      this.ec.keyFromPublic(publicKey, "hex")
    );
  }
}

export default DigitalSignature;
