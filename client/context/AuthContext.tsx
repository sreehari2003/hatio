/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiHandler } from "@app/config/apiHandler";
import { User, Child } from "@app/types";

interface IAuthTypes {
  user: User | null;
  isLoading: boolean;
  clearData: () => void;
}
export const AuthCtx = createContext({} as IAuthTypes);

export const AuthContext = ({ children }: Child): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<User | null>(null);

  const router = useRouter();

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await apiHandler.get("/auth/user");
      setData(data);
    } catch (e) {
      console.error("Error Authenticating user");
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
  };

  useEffect(() => {
    getUser();
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const response = useMemo(
    () => ({
      user: data,
      clearData,
      isLoading,
    }),
    [isLoading, data]
  );

  useEffect(() => {
    // auth user dont need to visit auth page
    if (!isLoading) {
      if (router.pathname === "/auth" && data) {
        router.push("/");
      }
      if (router.pathname !== "/auth" && !data) {
        router.push("/auth");
      }
    }
  }, [router, data]);

  return (
    <AuthCtx.Provider value={response}>
      <>{children}</>
    </AuthCtx.Provider>
  );
};
