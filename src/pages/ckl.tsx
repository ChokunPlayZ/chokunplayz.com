import { motion } from "framer-motion";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "ChokunLabs",
    description: "Chokun's Passion project for home labbing.",
    keywords: [
        "fullstack engineer",
        "system engineering",
        "technology",
        "web development",
        "Thailand"
    ],
    openGraph: {
        title: "Chokun's Portfolio",
        description: "Exploring technology, engineering, and innovation",
        url: "https://www.chokunplayz.com/",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Chokun - Fullstack Engineer",
        description: "Personal portfolio showcasing technologies and projects"
    }
};

const Index = ({ stats, topRepos }: AppProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.15 }}
            className="mt-24 w-full mb-32"
        >
            <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">What is it?</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                Project ChokunLabs, born as a result of my passion for homelabbing, it houses some of the hosted apps,
                free to use, for everyone, no censorship, and this means I'm not responsible for every picture hosted on
                ckl static host, and message sent in the hosted ntfy server, contact lab@ckl.moe for removal request/etc
            </p>
        </motion.div>
    );
};

export default Index;
