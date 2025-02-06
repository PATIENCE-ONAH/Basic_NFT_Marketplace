import "@/styles/globals.css";
import { http, createConfig } from '@wagmi/core';
import { sepolia } from '@wagmi/core/chains';
import { metaMask } from '@wagmi/connectors';
import { WagmiProvider } from 'wagmi';
import NavBar from "@/components/navBar";
import Head from "next/head";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import { RainbowKitProvider, getDefaultConfig,} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';


const queryClient = new QueryClient();


const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: "0e36a35b6a9f026485d80468cb212037",
  chains:  [sepolia],

});


export default function App({ Component, pageProps }) {
  return (
    <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />

            </Head>
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider chains={config.chains} >
        <NavBar />
        <Component {...pageProps} />
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </div>
  );
}


