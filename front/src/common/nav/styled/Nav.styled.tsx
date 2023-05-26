import styled from "styled-components";

export const NavWrap = styled.div`
  color: #333333;
  width: 40%;
  height: 95%;
  margin-top: 2rem;
  padding: 0 2rem;
  border-right: solid 1px #bdbdbd;
  display: flex;
  flex-direction: column !important;
  text-align: center;

  & > .selectAccountBox {
    margin-bottom: 2rem;
  }
`;

export const AccountList = styled.select`
  display: block;
  width: 8rem;
  float: right;
`;

export const ContentDiv = styled.div`
  margin: 2rem 0;
  display: flex;
  flex-direction: column !important;
`;

export const Img = styled.img`
  margin: 0 auto;
  width: 8rem;
  height: 8rem;
  border-radius: 10rem;
  border: none;
  background-color: #e5e5e5;
`;

export const Account = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  text-align: center;

  & > .account {
    margin: 0 auto;
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
  & > .optionValue {
    width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto;
  }
`;

export const Balance = styled.div`
  width: 100%;
  height: 5rem;
  margin: 2rem auto;
  border-radius: 1rem;
  background: linear-gradient(45deg, #ff5733, #ff8a5f);
  color: #fff3bf;
  text-align: center;

  & > .total {
    padding-top: 0.7rem;
    font-weight: bold;
  }

  & > .balance {
    margin-top: 0.3rem;
    font-size: 1.5rem;
    font-weight: lighter;
  }
`;
