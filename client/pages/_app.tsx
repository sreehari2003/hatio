import "@app/styles/globals.css";
import type { AppProps } from "next/app";
import { TopBar } from "@app/layout/TopBar";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <TopBar />
      <Component {...pageProps} />
    </>
  );
}
