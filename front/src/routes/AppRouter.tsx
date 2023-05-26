import { Route, Routes } from "react-router-dom";
import { Contents } from "@pages/index";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Contents />} />
      </Routes>
    </>
  );
};
