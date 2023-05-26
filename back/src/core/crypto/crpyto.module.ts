import merkle from "merkle";
import cryptojs from "crypto-js";
import { Hash } from "types/block";
import { TransactionData } from "@core/transaction/transaction.interface";
import { BlockData } from "@core/block/block.interface";
import { Receipt } from "@core/wallet/wallet.interface";

class CryptoMoudle {
  SHA256(data: string): Hash {
    const hash = cryptojs.SHA256(data).toString();
    return hash;
  }

  createBlockHash(blockData: BlockData) {
    const {
      version,
      height,
      timestamp,
      merkleRoot,
      previousHash,
      difficulty,
      nonce,
    } = blockData;

    const dataString = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`;
    return this.SHA256(dataString);
  }

  merkleRoot(data: TransactionData) {
    if (typeof data === "string") {
      return merkle("sha256").sync([data]).root();
    } else if (Array.isArray(data)) {
      const sync = data.filter(() => {}).map(() => {});
      return merkle("sha256").sync([sync]).root();
    }
  }

  isValidHash(hash: Hash) {
    const hexRegExp = /^[0-9a-fA-f]{64}$/;
    if (!hexRegExp.test(hash))
      throw new Error(`해쉬값이 올바르지 않습니다. Current HASH : ${hash} `);
  }

  hashToBinary(hash: Hash): string {
    let binary = "";
    for (let i = 0; i < hash.length; i += 2) {
      const hexByte = hash.substr(i, 2);
      const decimal = parseInt(hexByte, 16);
      const binaryByte = decimal.toString(2).padStart(8, "0");
      binary += binaryByte;
    }

    return binary;
  }

  createReceipHash(receipt: Receipt) {
    const {
      sender: { publicKey },
      received,
      amount,
    } = receipt;
    const hashMaterial = [publicKey, received, amount].join("");
    return this.SHA256(hashMaterial);
  }
}

export default CryptoMoudle;
