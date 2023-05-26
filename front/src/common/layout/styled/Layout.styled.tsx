import styled from "styled-components";

export const MainWrapper = styled.div`
  width: 100%;
  height: 35rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainContent = styled.div`
  margin: 0 auto;
  padding: 1.5rem 0;
  width: 75%;
  max-width: 1000px;
  height: 100%;
  border: solid 2px #bdbdbd;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  background-color: #efefef;
  box-shadow: 5px 5px 8px 0.5px #eaeaea;
`;

export const Top = styled.div`
  width: 100%;
  height: 25px;
  position: absolute;
  background-color: #bdbdbd;
  top: 0;
  display: flex;
  padding-left: 18px;
`;

export const Cercle = styled.div`
  border-radius: 10rem;
  width: 11px;
  height: 11px;

  &:nth-child(1) {
    background-color: #ec6a5e;
  }
  &:nth-child(2) {
    background-color: #f3bf4f;
  }
  &:nth-child(3) {
    background-color: #61c555;
  }
  margin-top: 6px;
  margin-right: 8px;
`;

export const ChildrenWrap = styled.div`
  height: 100%;
  display: flex;

  & > div {
    flex-direction: row;
  }
`;
