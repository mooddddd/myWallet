import axios from "axios";
import { Wrap } from "./styled";

import styled from "styled-components";
const Button = styled.button`
  border: none;
  margin-top: 1rem;
  text-align: center;
  &:hover {
    cursor: pointer;
    background-color: #efefef;
  }
  & > img {
    width: 1rem;
  }
`;

export const Mine = () => {
  // const account = "";// 전역에 저장한 어카운트로 설정해줘야 함
  const mineHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // await axios.post("http://127.0.0.1:8545/mineBlock", account);
    console.log(`했다 치고!`);
  };

  return (
    <>
      <Wrap>
        블록을 마음데로 생성해보새요
        <br />
        <img src="/img/cat.jpg" />
        <br />
        <Button onClick={mineHandler}>
          <img src="/img/a.gif" />
          <span> 영 차 영 차 </span>
          <img src="/img/a.gif" />
        </Button>
      </Wrap>
    </>
  );
};
