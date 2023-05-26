import { GENESIS } from "@constants/block.constant";
import Block from "@core/block/block";
import { BlockData, BlockInfo } from "@core/block/block.interface";
import CryptoMoudle from "@core/crypto/crpyto.module";

describe("cryptoModule TEST", () => {
  let crypto: CryptoMoudle;
  let block: Block;

  beforeEach(() => {
    crypto = new CryptoMoudle();
    block = new Block(crypto);
  });

  describe("SHA256 TEST", () => {
    it("해쉬값이 32byte로 제대로 잘 만들어지는가", () => {
      const data = "hello world";
      const result = crypto.SHA256(data);
      console.log(result);
      // b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
      expect(result.length).toBe(64);
    });
  });

  describe("createBlockHash TEST", () => {
    describe("createBlockHash", () => {
      it("genesis block hash 생성하기", () => {
        const blockdata: BlockData = {
          version: GENESIS.version,
          height: GENESIS.height,
          timestamp: GENESIS.timestamp,
          previousHash: GENESIS.previousHash,
          merkleRoot: GENESIS.merkleRoot,
          nonce: GENESIS.nonce,
          difficulty: GENESIS.difficulty,
          data: "",
        };

        const hash = crypto.createBlockHash(blockdata);
        console.log(hash);
        // 84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370
        expect(hash).toHaveLength(64);
      });
    });
  });

  describe("merkleroot TEST", () => {
    it("merkelRoot 값이 제대로 생성되는가", () => {
      const data = GENESIS.data;
      const merkleRoot = crypto.merkleRoot(data);
      console.log(merkleRoot);
      expect(merkleRoot).toHaveLength(64);
    });
  });

  describe("block TEST", () => {
    it("createBlockInfo", () => {
      const newBlockInfo = block.createBlockInfo(GENESIS);
      console.log(newBlockInfo);
      expect(newBlockInfo.height).toBe(2);
    });

    it("createBlockData", () => {
      const data = "";
      const newBlockData = block.createBlockData(GENESIS, data);
      console.log(newBlockData);
      expect(newBlockData.height).toBe(GENESIS.height + 1);
    });

    it;
  });
});
