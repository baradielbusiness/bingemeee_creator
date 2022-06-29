import Head from 'next/head'
import ConfigProvider from '../utils/context/postContext';
import React from "react";
import '../styles/styles.scss'

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider>
        <Head>
          <title>BingeMeee</title>
          <link rel="icon" href="/binge_fav_icon.png" />
        </Head>
          <Component {...pageProps} />
    </ConfigProvider>
  );
}
export default MyApp;
