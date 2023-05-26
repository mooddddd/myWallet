import { SignatureInput } from "elliptic";

export class Sender {
  // 보내는 사람 정보
  publicKey?: string;
  account!: string;
}
export class Receipt {
  // 보낼 때 필요한 영수증
  sender!: Sender; // 보내는 사람의 정보
  received!: string; //받는 사람의 account
  amount!: number; // 보낼 수량
  signature?: SignatureInput;
}

export class Accounts {
  // 계정 생성시 만들어지는 공개키, 개인키, 어카운트(ID 역할을 함)
  privateKey!: string;
  publicKey!: string;
  account!: string;
}
