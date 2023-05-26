import styled from "styled-components";

export const SendWrap = styled.div`
  width: 60%;
  margin: 0 auto;
`;

export const SendDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
`;

export const Select = styled.select`
  margin: 1rem auto;
  border: none;
  border-radius: 0.3rem;
  width: 10rem;
  height: 2rem;
  background-color: #e5e5e5;
  font-weight: bold;
  padding-left: 0.3rem;
`;

export const SendBtn = styled.button`
  border-radius: 0.3rem;
  border: none;
  background-color: #2e86c1;
  color: white;
  margin-top: 1rem;
  height: 2rem;
  width: 40%;

  &:hover {
    background-color: #2e86c181;
  }
`;
