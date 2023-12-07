import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <motion.div
            key="talk"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.25 }}
            className="mt-36 mb-80 w-full"
        >
            <h1 className="text-black dark:text-white font-bold text-3xl mb-3 mt-8">404...</h1>
            <p className="text-black dark:text-gray-200 mb-6">Looks like you have landed in the wrong place</p>
        </motion.div>
    );
};

export default NotFound;
