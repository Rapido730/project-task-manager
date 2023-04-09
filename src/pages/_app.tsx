import SSRProvider from "react-bootstrap/SSRProvider";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Store } from "@/Store/Store";
import { Provider } from "react-redux";
// react persist library used to store previous reducer state
import { persistor } from "../Store/Store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={pageProps.session}>
          <SSRProvider>
            <Component {...pageProps} />
          </SSRProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}
