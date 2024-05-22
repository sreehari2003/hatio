import "@app/styles/globals.css";
import type { AppProps } from "next/app";
import { TopBar } from "@app/layout/TopBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopBar />
      <Component {...pageProps} />
    </>
  );
}
