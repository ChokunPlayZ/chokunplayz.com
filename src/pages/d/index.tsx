import { motion } from "framer-motion";
import Image from "next/image";
import { classNames } from "../../util/classNames";
import Link from "next/link";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

const LinkButton = ({ name, link }: { name: string; link: string }) => {
    return (
        <Link
            href={link}
            className="bg-black/10 dark:bg-[#c8c8dc]/10 cursor-pointer px-6 py-3 text-lg rounded-md text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-all duration-75 mr-4 mb-2 inline-block"
        >
            {name}
        </Link>
    );
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
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                Have you ever think something you spend months doing has just all came down, because of one night you just can't sleep and decided you're going to check your computer just in case, yeah, its a bit painful watching someone you care so much about just throwing your care away, got over it in an hour, I'm told a bit about my personality, I care a bit too much, someone can see me as invasive but when I love someone I really do, no matter what that person is, friends, brothers, sisters, everyone's special they built a bit of what I am, why do I even care this much huh, I'll never know, someone probably made me be this way a long time ago, I know I'm probably annoying to everyone but I'm really sorry I can't help it, I used to think someone managed to destroy this little part of me a while ago but I was wrong, someone I care about just shows up out of nowhere, not sure if this is what the gods or whatever watching decided to send, that person changed me then, and they just did again, I think someone will manage to bring this little part of me back, some day, probably not soon, the uni is really going to be the brand new starting point for me, I am a man of my words so if you're reading this everything I promised is not going anywhere, reminds me of that girl, got that expensive bear she wanted a week after we broke up because I promised she will get it but never had time to meet up, wrapped that thing in like 10 layers of packing tape, that must be a pain to open, anyway, rant over, I clear out lots of stuff, not sure what I'm doing an hour past my bedtime, also ig is down
            </p>
        </motion.div>
    );
};

export default Index;
