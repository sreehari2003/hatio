import { AuthCtx } from "@app/context/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("Invalid context - Auth");

  return ctx;
};
