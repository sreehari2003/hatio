import "@app/styles/globals.css";
import type { AppProps } from "next/app";
import { TopBar } from "@app/layout/TopBar";
import { Toaster } from "sonner";
import { AuthContext } from "@app/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContext>
      <Toaster position="bottom-right" richColors />
      <TopBar />
      <Component {...pageProps} />
    </AuthContext>
  );
}
