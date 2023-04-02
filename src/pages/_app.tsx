import SSRProvider from "react-bootstrap/SSRProvider";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Store } from "@/Store/Store";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={Store}>
      <SessionProvider session={pageProps.session}>
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </SessionProvider>
    </Provider>
  );
}
