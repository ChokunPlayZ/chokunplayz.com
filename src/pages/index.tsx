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
            <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">Hi, I'm Chokun</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                I'm a self-taught fullstack engineer from Thailand🇹🇭. I'm currently pursuing infrastructure planing and
                network engineering, to create powerful, secure, reliable infrastructure
            </p>

            <h2 className="font-medium text-3xl mb-4">What I Do</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-12">
                I'm passionate about everything in technology, since engineering is not only in software, my field
                expand beyond that, from mechanical, network, software, etc, I love finding out new things, knowledge
                exists all arround us, I'm all about finding these knowledge, learn from other's mistake and improve on
                it, it's what give me the power to get up every morning
            </p>

            <h2 className="font-medium text-3xl mb-4">Technologies</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                I use a variety of tools to help my day-to-day work, Below is a list of technologies I've had
                experience with in the past, or use currently.
            </p>
            <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10">
                {/* {Languages} */}
                <TechItem icon={SiTypescript} name="TypeScript" />
                <TechItem icon={SiJavascript} name="JavaScript" />
                <TechItem icon={SiPython} name="Python" />
                {/* {Runtime} */}
                <TechItem icon={SiNodeJs} name="Node.js" />
                <TechItem icon={SiBun} name="Bun" />

                {/* {Frameworks} */}
                <TechItem icon={SiNextJs} name="Next.js" />

                {/* {Libs} */}
                <TechItem icon={SiTailwindCSS} name="TailwindCSS" />
                <TechItem icon={SiReact} name="React.js" />
                <TechItem icon={SiPrisma} name="Prisma" />
            </div>
            <div className="w-full flex flex-wrap flex-row p-1 bg-white/10 dark:bg-black/10 mb-12">
                {/* {DBs} */}
                <TechItem icon={SiRedis} name="Redis" />
                <TechItem icon={SiPostgresql} name="Postgres" />
                <TechItem icon={SiGit} name="Git" />

                {/* {Enviorment} */}
                <TechItem icon={SiDocker} name="Docker" />
                <TechItem icon={GrVmware} name="VMware vSphere" />
                <TechItem icon={FaLinux} name="Ubuntu" />

                {/* {Programs} */}
                <TechItem icon={SiMicrosoftexcel} name="Microsoft Excel" />
                <TechItem icon={SiAdobepremierepro} name="Adobe Premiere Pro" />
                <TechItem icon={SiAdobephotoshop} name="Adobe Photoshop" />
                <TechItem icon={SiAdobelightroom} name="Adobe Lightroom" />
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

            <h2 className="font-medium text-3xl mb-4">Pictures </h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                I enjoy taking pictures, the ability to just capture a moment is just so exciting, picture portfolio
                (comming soon)
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
