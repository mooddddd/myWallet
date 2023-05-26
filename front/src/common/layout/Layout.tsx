import { Cercle, ChildrenWrap, MainContent, MainWrapper, Top } from "./styled";

export type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <MainWrapper>
        <MainContent>
          <Top>
            <Cercle />
            <Cercle />
            <Cercle />
          </Top>
          <ChildrenWrap>{children}</ChildrenWrap>
        </MainContent>
      </MainWrapper>
    </>
  );
};
