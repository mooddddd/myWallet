import styled from "styled-components";

export const ButtonStyled = styled.button<ButtonProps>`
  display: block;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 5rem;
  background-color: #ff8a5f;
  border: none;
  color: #fff3bf;
  margin-bottom: 2rem;

  &:hover {
    cursor: pointer;
    background-color: #ff5733;
    font-weight: bold;
  }
`;

interface ButtonProps {
  width?: string;
  height?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface IButton {
  setMenu?: React.Dispatch<React.SetStateAction<string>>;
}

export const Button: React.FC<IButton> = ({ setMenu }) => {
  const clickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const state = (e.target as HTMLButtonElement).innerHTML;
    if (!setMenu) return;
    setMenu(state);
  };

  const list = ["mine", "send", "account"];
  const listMap = list.map((v, index) => (
    <ButtonStyled
      width="8rem"
      height="3rem"
      key={index}
      onClick={(e) => clickHandler(e)}
    >
      {v}
    </ButtonStyled>
  ));

  return <>{listMap}</>;
};
