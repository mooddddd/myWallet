import { useEffect, useState } from "react";
import {
  Account,
  AccountList,
  Balance,
  ContentDiv,
  Img,
  NavWrap,
} from "./styled";
import axios from "axios";

export const Nav = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [accountList, setAccountList] = useState([]); // 얘 전역상태에 담아두면 될 것 같은데.. Account에서도 쓰임
  const [balance, setBalance] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://127.0.0.1:8545/accounts");
        setAccountList(data);
        console.log(accountList);
      } catch (e) {
        throw new Error(`Nav Get AccountList Error`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const account = accountList[0];
        const { data } = await axios.post("http://127.0.0.1:8545/getBalance", {
          account,
        });
        setBalance(data.balance);
        console.log(account, balance);
      } catch (e) {
        throw new Error(`Nav Get Balance Error`);
      }
    })();
  }, [accountList]);

  const list = accountList.map((v, index) => (
    <option key={index}>{`${index + 1} : ${v}`}</option>
  ));

  return (
    <>
      <NavWrap>
        <div className="selectAccountBox">
          <AccountList>{list}</AccountList>
        </div>
        <h2>MY WALLET</h2>
        <ContentDiv>
          <Img></Img>
          <Account>
            <p className="account">ACCOUNT1</p>
            <p className="optionValue">{accountList}</p>
          </Account>
          <Balance>
            <p className="total">Total balance</p>
            <p className="balance">{balance} BTC</p>
          </Balance>
        </ContentDiv>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "⍇ LOGOUT" : "⍇ LOGIN"}
        </button>
      </NavWrap>
    </>
  );
};
