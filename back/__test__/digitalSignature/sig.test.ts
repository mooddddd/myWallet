import CryptoMoudle from "@core/crypto/crpyto.module";
import DigitalSignature from "@core/wallet/digitalSignature";

describe("sig TEST", () => {
  describe("create public key", () => {
    let crpyto: CryptoMoudle;
    let digitalSignature: DigitalSignature;

    beforeEach(() => {
      crpyto = new CryptoMoudle();
      digitalSignature = new DigitalSignature(crpyto);
    });

    it("Public Key from privateKey", () => {
      const privateKey =
        "9d37fcb17e898fe6569970adf2beeeaca3286e27254aae9df7ffa10a7161e294";
      const publicKey = digitalSignature.createPublicKey(privateKey);
      expect(publicKey).toBe(
        "024e06f068a1b76958f91ce25ba45350193ebb2a61a61b7f869771bcbef0726d8e"
      );
    });

    it("Account from PrivateKey", () => {
      const privateKey =
        "9d37fcb17e898fe6569970adf2beeeaca3286e27254aae9df7ffa10a7161e294";
      const publicKey = digitalSignature.createPublicKey(privateKey);
      const account = digitalSignature.createAccount(publicKey);
      expect(account).toBe("a45350193ebb2a61a61b7f869771bcbef0726d8e");
    });
  });
});
