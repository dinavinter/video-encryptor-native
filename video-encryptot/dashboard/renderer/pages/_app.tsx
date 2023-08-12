import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import 'antd/dist/antd.css';
import {VarStoreProvider} from "../store/useVarStore";


function MyApp({ Component, pageProps }: AppProps) {

    return (
    <React.Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
        <VarStoreProvider>
            <Component {...pageProps} />

        </VarStoreProvider>
    </React.Fragment>
  );
}

export default MyApp;
