import { useEffect, useState } from "react";
import { SendDiv, Select, SendBtn, SendWrap } from "./styled";
import axios from "axios";
import { useInput } from "../hook/useInput";

export const Send = () => {
  const [accountList, setAccountList] = useState([]);
  const [account, setAccount] = useState("");
  const [myAmount, setMyAmount] = useState("");
  const amount = useInput("0");
  const received = useInput("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://127.0.0.1:8545/accounts");
        setAccountList(data);
      } catch (e) {
        throw new Error(`SEND Get AccountList Error`);
      }
    })();
  }, []);

  const changeHandler = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccount(e.target.value);
    getbalance(e.target.value);
  };

  const getbalance = async (account: string) => {
    const { data } = await axios.post("http://127.0.0.1:8545/getBalance", {
      account,
    });
    setMyAmount(data.balance);
    console.log(myAmount);
  };

  //React.FormEvent<HTMLFormElement>)
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (amount.value > myAmount) {
      alert(`잔액이 부족합니다.`);
      return;
    } else if (received.value.toString().length != 40) {
      alert("보낼 대상의 계정 형식이 올바르지 않습니다.");
      return;
    }
    const body = {
      sender: account,
      received: received.value,
      amount: amount.value,
    };
    await axios.post("http://127.0.0.1:8545/transaction", {
      ...body,
    });
    alert("전송이 완료되었습니다.");
  };

  const list = accountList.map((v, index) => <option key={index}>{v}</option>);

  return (
    <>
      <SendWrap>
        <form onSubmit={submitHandler}>
          <SendDiv>
            <Select onChange={changeHandler}>
              <option>계정을 선택하세요</option>
              {list}
            </Select>
            <ul>
              <li>{account}</li>
              <li>
                현재 보유 자산 : {myAmount === "" ? "" : `${myAmount} BTC`}
              </li>
              <li>
                <span>보낼 대상 : </span>
                <input
                  type="text"
                  placeholder="받을 계정을 입력하세요"
                  id="received"
                  {...received}
                />
              </li>
              <li>
                <span>금액 : </span>
                <input
                  type="number"
                  min={0.000000000000000001}
                  placeholder="전송할 금액을 입력하세요"
                  id="amount"
                  {...amount}
                />
                BTC
              </li>
            </ul>
          </SendDiv>
          <SendBtn>취소</SendBtn>
          <SendBtn type="submit">전송</SendBtn>
        </form>
      </SendWrap>
    </>
  );
};
