import { Login, SignUp } from "@app/components/Auth";
import { useState } from "react";

const Auth = () => {
  const [option, setOption] = useState<"login" | "signup">("login");

  const toggleOption = () => {
    if (option === "login") {
      setOption("signup");
    } else {
      setOption("login");
    }
  };

  return (
    <main className="h-screen flex justify-center items-center flex-col">
      <div className="mb-20">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-3">
          {option === "login" ? "Login" : "Signup"} in to your account
        </h2>
        {option === "login" && <Login toggleOption={toggleOption} />}
        {option === "signup" && <SignUp toggleOption={toggleOption} />}
      </div>
    </main>
  );
};

export default Auth;
