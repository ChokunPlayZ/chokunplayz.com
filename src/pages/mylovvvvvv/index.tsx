import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import Head from "next/head";

const TimerPage = () => {
    const [timePassed, setTimePassed] = useState({
        years: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const startDate = new Date('2024-03-10T00:20:00');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = now.getTime() - startDate.getTime();

            const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
            const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimePassed({ years, days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
        <Head>
            <title>Countup</title>
            <meta name="title" content="Countup" />
        </Head>
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.15 }}
            className="mt-24 w-full mb-32"
        >
            <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">Day Counter</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                days since you said yes.
            </p>

            <div className="flex items-center justify-center space-x-4 text-center bg-white/10 dark:bg-black/10 p-6 rounded-lg">
                {timePassed.years > 0 && (
                    <div>
                        <div className="text-2xl font-bold">{timePassed.years}</div>
                        <div>Years</div>
                    </div>
                )}
                <div>
                    <div className="text-2xl font-bold">{timePassed.days}</div>
                    <div>Days</div>
                </div>
                <div>
                    <div className="text-2xl font-bold">{timePassed.hours}</div>
                    <div>Hours</div>
                </div>
                <div>
                    <div className="text-2xl font-bold">{timePassed.minutes}</div>
                    <div>Minutes</div>
                </div>
                <div>
                    <div className="text-2xl font-bold">{timePassed.seconds}</div>
                    <div>Seconds</div>
                </div>
            </div>
        </motion.div>
        </>
    );
};

export default TimerPage;