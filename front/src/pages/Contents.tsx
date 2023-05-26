import { Layout, Button } from "@common/index";
import { Nav } from "@common/nav";
import { AccountBox, ButtonWrap } from "./styled";
import { useState } from "react";
import { Mine, Account, Send } from "./index";

export const Contents = () => {
  const [menu, setMenu] = useState("mine");

  return (
    <>
      <Layout>
        <Nav />
        <AccountBox>
          {menu === "mine" ? (
            <Mine />
          ) : menu === "send" ? (
            <Send />
          ) : (
            <Account />
          )}
        </AccountBox>
        <ButtonWrap>
          <Button setMenu={setMenu} />
        </ButtonWrap>
      </Layout>
    </>
  );
};
