/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useMemo,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
      const { data } = await apiHandler.get("/user");
      setData(data);
    } catch (e) {
      console.error("Error Authenticating user");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
  };
  // todo
  // @sreehari2003
  // convert this to react query by fixing the caching problem
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

  return (
    <AuthCtx.Provider value={response}>
      <>{children}</>
    </AuthCtx.Provider>
  );
};

export const AuthGuard = ({ children }: Child): JSX.Element => {
  const router = useRouter();
  const ctx = useContext(AuthCtx);
  useEffect(() => {
    if (!ctx.isLoading && !ctx.user) {
      router.push("/");
    }
  }, [router, ctx.user, ctx.isLoading]);

  return <>{children}</>;
};
