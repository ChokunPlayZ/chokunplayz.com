import "../globals.css";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from '@next/third-parties/google'
import Head from "next/head";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { AnimatePresence } from "framer-motion";
import { Router } from "next/router";

import "react-tippy/dist/tippy.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { Metadata } from "next";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MySite({ Component, pageProps, router }: AppProps) {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
    }, [router.pathname]);

    return (
        <>
            <Head>
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <meta name="theme-color" content="#DBF2FC"/>
                    <meta name="robots" content="index, follow" />
                    <meta name="googlebot" content="index, follow" />
                    <meta name="google-site-verification" content="mDFmdnk2pfHaCJFL2uDn4QfsLpyIxa1k3XxD1xEqJl4" />
                </Head>
            </Head>

            <div className="text-black dark:text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-[#f7c7d5] to-[#9995ee] dark:from-[#5e4d56] dark:to-[#3e3c5f] min-h-screen">
                <Nav />
                <div className="w-[80%] md:w-[45rem]">
                    <AnimatePresence exitBeforeEnter>
                        <Component {...pageProps} key={router.pathname} />
                    </AnimatePresence>
                    <GoogleAnalytics gaId="G-16FT90PTQ5" />
                    <Footer />
                </div>
            </div>
        </>
    );
}
export default MySite;
