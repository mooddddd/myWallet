import { ButtonStyled } from "@common/button";
import { Wrap } from "./styled";
import axios from "axios";
import { useEffect, useState } from "react";

export const Account = () => {
  const [accounts, setAccounts] = useState({
    privateKey: "",
    publicKey: "",
    account: "",
  });
  const [list, setList] = useState([]);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://127.0.0.1:8545/accounts");
        setList(data);
      } catch (e) {
        throw new Error(`getAccount Error`);
      }
    })();
  }, [list]);

  const li = list.map((v: string, index: number) => <li key={index}>{v}</li>);

  interface Account {
    account: string;
    publicKey: string;
    privateKey: string;
  }

  const clickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data } = await axios.put("http://127.0.0.1:8545/accounts");
    setAccounts(data);
  };

  const clickHandler2 = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    setShowKey(!showKey);

  return (
    <>
      <Wrap>
        <ButtonStyled width="10rem" height="2rem" onClick={clickHandler}>
          ✚ 지갑 생성하기
        </ButtonStyled>
        {accounts.account === "" ? (
          ""
        ) : (
          <ul>
            <li>
              <p>private Key : </p>
              {showKey ? (
                <button className="privateKey" onClick={clickHandler2}>
                  {accounts.privateKey}
                </button>
              ) : (
                <button onClick={clickHandler2}>🔒</button>
              )}
            </li>
            <li>
              <p>public Key : </p>
              <p className="publicKey">{accounts.publicKey}</p>
            </li>
            <li>
              <p>account : </p>
              <p className="account">{accounts.account}</p>
            </li>
          </ul>
        )}
        <br />
        <ul>
          <h3>account List</h3>
          {li}
        </ul>
      </Wrap>
    </>
  );
};
