import { motion } from "framer-motion";
import {
    SiGit,
    SiDocker,
    SiNextdotjs as SiNextJs,
    SiNodedotjs as SiNodeJs,
    SiPostgresql,
    SiReact,
    SiRedis,
    SiTailwindcss as SiTailwindCSS,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiPrisma,
} from "react-icons/si";
import { GrVmware } from "react-icons/gr";
import { FaLinux } from "react-icons/fa";
import { TechItem } from "../components/TechItem";
import RepoItem from "../components/RepoItem";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

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
                ckl static host, and message sent in the hosted ntfy server, contact lab@ckl.moe for DMCA and other notice
            </p>
        </motion.div>
    );
};

export async function getStaticProps() {
    const repos = await fetch(`https://api.github.com/users/chokunplayz/repos?type=owner&per_page=100`).then(res =>
        res.json()
    );

    const topRepos = repos
        .sort((a: Record<string, any>, b: Record<string, any>) => b.stargazers_count - a.stargazers_count)
        .slice(0, 4);

    return {
        props: { topRepos },
        revalidate: 3600,
    };
}

export default Index;
