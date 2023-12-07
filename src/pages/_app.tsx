import "../globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { AnimatePresence } from "framer-motion";
import { Router } from "next/router";

import "react-tippy/dist/tippy.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, router }: AppProps) {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
    }, [router.pathname]);

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>Chokun Rojanapron</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="theme-color" content="#000000" />
                <meta
                    name="keywords"
                    content=""
                />
                <meta name="description" content="Yanavut Rojanapron - Full Stack Engineer" />
                <meta name="author" content="Yanavut Rojanapron" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </Head>

            <div className="text-black dark:text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-[#f7c7d5] to-[#9995ee] dark:from-[#5e4d56] dark:to-[#3e3c5f] min-h-screen">
                <Nav />
                <div className="w-[80%] md:w-[45rem]">
                    <AnimatePresence exitBeforeEnter>
                        <Component {...pageProps} key={router.pathname} />
                    </AnimatePresence>
                    <Footer />
                </div>
            </div>
        </>
    );
}
export default MyApp;
