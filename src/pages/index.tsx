import { motion } from "framer-motion";
import {
    SiGit,
    SiDocker,
    SiNextdotjs as SiNextJs,
    SiNodedotjs as SiNodeJs,
    SiBun,
    SiPostgresql,
    SiReact,
    SiRedis,
    SiTailwindcss as SiTailwindCSS,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiPrisma,
    SiMicrosoftexcel,
    SiAdobepremierepro,
    SiAdobephotoshop,
    SiAdobelightroom,
    SiMariadb,
    SiExpress,
    SiFlask,
    SiCloudflare,
    SiDatagrip,
    SiWebstorm,
    SiXcode,
    SiVisualstudiocode,
    SiPhp,
    SiCodeigniter,
    SiMongodb,
    SiWordpress,
    SiBootstrap,
    SiJquery,
    SiMongoose,
    SiFigma,
    SiPostman,
    SiInsomnia,
    SiGrafana,
    SiPrometheus,
    SiCplusplus,
    SiC,
    SiProxmox,
    SiQemu,
    SiCsharp,
    SiGooglesheets,
    SiMikrotik,
    SiOpnsense,
    SiDavinciresolve
} from "react-icons/si";
import { GrVmware } from "react-icons/gr";
import { FaLinux, FaJava } from "react-icons/fa";
import { TechItem } from "../components/TechItem";
import RepoItem from "../components/RepoItem";
import CreadlyBadge from "../components/CreadlyBadge";
import Head from "next/head";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "r",
    description: "",
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
        <>
            <Head>
                <title>Chokun - Fullstack Engineer</title>
                <meta name="title" content="Chokun - Fullstack Engineer" />
            </Head>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ ease: "easeOut", duration: 0.15 }}
                className="mt-24 w-full mb-32"
            >
                <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">Hi, I'm Chokun</h1>
                <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                    I'm a self-taught fullstack engineer from Thailand🇹🇭. I'm currently pursuing system engineering, to create powerful, secure, reliable infrastructure!
                </p>

                <h2 className="font-medium text-3xl mb-4">What I Do</h2>
                <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-12">
                    I'm passionate about everything in technology, since engineering is not only in software, my field
                    expand beyond that, from mechanical, network, software, etc, I love finding out new things, knowledge
                    exists all around us, I'm all about finding these knowledge, learn from other's mistake and improve on
                    it, it's what give me the power to get up every morning
                </p>

                <h2 className="font-medium text-3xl mb-4">Technologies</h2>
                <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                    I use a variety of tools to help my day-to-day work, Below is a list of technologies I've had experience
                    with in the past, or use currently.
                </p>
                <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10">
                    {/* {Languages} */}
                    <TechItem icon={SiTypescript} name="TypeScript" />
                    <TechItem icon={SiJavascript} name="JavaScript" />
                    <TechItem icon={SiPython} name="Python" />
                    <TechItem icon={SiPhp} name="PHP" />
                    <TechItem icon={FaJava} name="Java" />
                    <TechItem icon={SiCplusplus} name="C++" />
                    <TechItem icon={SiC} name="C" />
                    <TechItem icon={SiCsharp} name="C#" />

                    {/* {Runtime} */}
                    <TechItem icon={SiNodeJs} name="Node.js" />
                    <TechItem icon={SiBun} name="Bun" />
                </div>
                <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10">
                    {/* {Frameworks} */}
                    <TechItem icon={SiNextJs} name="Next.js" />
                    <TechItem icon={SiExpress} name="Express.js" />
                    <TechItem icon={SiFlask} name="Flask" />
                    <TechItem icon={SiCodeigniter} name="Codeigniter" />
                    <TechItem icon={SiWordpress} name="Wordpress" />

                    {/* {Libs} */}
                    <TechItem icon={SiTailwindCSS} name="TailwindCSS" />
                    <TechItem icon={SiBootstrap} name="Bootstrap" />
                    <TechItem icon={SiJquery} name="jQuery" />
                    <TechItem icon={SiReact} name="React.js" />
                    <TechItem icon={SiPrisma} name="Prisma" />
                    <TechItem icon={SiMongoose} name="Mongoose" />
                </div>
                <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10">
                    {/* {DBs} */}
                    <TechItem icon={SiPostgresql} name="Postgres" />
                    <TechItem icon={SiMariadb} name="Mariadb" />
                    <TechItem icon={SiMongodb} name="Mongodb" />

                    {/* DevOps */}
                    <TechItem icon={SiGit} name="Git" />
                    <TechItem icon={SiCloudflare} name="Cloudflare" />
                    <TechItem icon={SiGrafana} name="Grafana" />
                    <TechItem icon={SiPrometheus} name="Prometheus" />
                </div>
                <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10">
                    {/* {Environments} */}
                    <TechItem icon={SiDocker} name="Docker" />
                    <TechItem icon={GrVmware} name="VMware vSphere" />
                    <TechItem icon={SiProxmox} name="Proxmox Virtual Enviornment" />
                    <TechItem icon={SiQemu} name="QEMU/KVM" />

                    <TechItem icon={SiMikrotik} name="Mikrotik" />
                    <TechItem icon={SiOpnsense} name="OpnSense" />
                </div>
                <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10 mb-12">
                    {/* {Programs} */}
                    <TechItem icon={SiMicrosoftexcel} name="Microsoft Excel" />
                    <TechItem icon={SiGooglesheets} name="Google Sheets" />
                    <TechItem icon={SiDavinciresolve} name="Davinchi Resolve" />
                    <TechItem icon={SiAdobephotoshop} name="Adobe Photoshop" />
                    <TechItem icon={SiAdobelightroom} name="Adobe Lightroom" />
                    <TechItem icon={SiDatagrip} name="JetBrains DataGrip" />
                    <TechItem icon={SiWebstorm} name="JetBrains WebStrom" />
                    <TechItem icon={SiVisualstudiocode} name="Visual Studio Code" />
                    <TechItem icon={SiXcode} name="Xcode" />
                    <TechItem icon={SiFigma} name="Figma" />
                    <TechItem icon={SiPostman} name="Postman" />
                    <TechItem icon={SiInsomnia} name="Insomnia" />
                </div>

                <h2 className="font-medium text-3xl mb-4">Projects</h2>
                <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                    I enjoy creating projects and sharing it on{" "}
                    <a
                        href="https://github.com/chokunplayz"
                        rel="noreferrer"
                        className="font-semibold text-violet-500 hover:underline"
                    >
                        GitHub
                    </a>
                    , so I can share what I know and learn from others, here are some of my projects
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 mb-12 gap-2">
                    {topRepos.map((repo: Record<string, any>) => {
                        return (
                            <RepoItem
                                key={repo.name}
                                name={repo.name}
                                description={repo.description}
                                stars={repo.stargazers_count}
                                forks={repo.forks_count}
                                language={repo.language}
                            />
                        );
                    })}
                </div>
            </motion.div>
        </>
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
