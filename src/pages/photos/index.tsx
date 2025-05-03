import { motion } from "framer-motion";
import Image from "next/image";
import { classNames } from "../../util/classNames";
import Link from "next/link";
import Head from 'next/head';

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
        <>
            <Head>
                <title>Photos - Chokun</title>
                <meta name="description" content="Chokun's Personal Photo gallery" />
            </Head>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ ease: "easeOut", duration: 0.15 }}
                className="mt-24 w-full mb-32"
            >
                <h1 className="mt-36 font-bold text-2xl md:text-5xl mb-4">Photography</h1>
                <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                    This is a page dedicated to my photography hobby, I do event shoots in my school out of my free time, if
                    you're here for your photos, scroll down. <br/><br/>
                    how to download comming soon
                </p>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNIxSecureD Cybersec Bootcamp 2025</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 3/05/2025
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/cdxKufN1cQ1jQYHausvLsUGgD3ShxnKQHUvXrvgjTX1z8qsElQ_7RZGJZFETl1kgGSI"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNI Christmas 2024</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 25/12/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/JHFfBlFiguMi9NHfA69QwNhXEIRUUZPkbCW5ycwFWARqWYkJWya5WzWVWbDYYPayVSM"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNI IT Camp 2024</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 24/11/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/nvhL8PRr68nzj2fuked87ru9W9KyGLb-fcZGE6FCb30Zhnd0nzI918WSdlVKJ1TH2PA"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNI Engineering Camp 2024</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 23/11/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/vIksB_56CTjbGvVV36gahY_NO525CXdenF19llREkeJl3Wy8GLK43By1vQ9wqtZB1Lw"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNI Day (2024)</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 02/08/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/EgoAnErncQ8M-KsbeiTes4zIGn4Mya6ribiyek28j4F_YPkPaQRrMYTeFkieOjlPCE4"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">TNI Freshy Day (2024)</h2>
                    <p className="mb-2">
                        <span className="font-medium">Date:</span> 06/07/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/5WZC-KZTojSbe-EWN36-KxskpT3VcaxvGp71WYkHZ1_qoVOPj0W86hB2s7DHb1rho1s"
                            name="Download Here!"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">ACS Academic Days (2023)</h2>
                    <p className="mb-2">
                        <span className="font-medium">Location:</span> Assumption College Sriracha
                        <br />
                        <span className="font-medium">Date:</span> 08/02/2024 - 9/02/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/SiQuWo2vxBPsnJ1-WCXFH_I9j95ke14pbmTP_knfGKYPcxbxGZgnn8nP-oPFndztAks"
                            name="Day 1-2"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">ACS Teacher Retirement & Children's Day (2023)</h2>
                    <p className="mb-2">
                        <span className="font-medium">Location:</span> Assumption College Sriracha
                        <br />
                        <span className="font-medium">Date:</span> 15/01/2024
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/fKAN9kKeF2nCLJ5zfoKLj5CO-acY49t1ofaTHNrx7J3EvfRNDnQvUK-wIT4w_Dxa92c"
                            name="Retirement Ceremony (Morning)"
                        />
                        <LinkButton
                            link="https://jpg.ckl.moe/share/D-vPhvt3glWPjg9E_HHBafoTQoBHtuUsufooaWcADG-p_EGoB6NclzIdPGGejSKDEck"
                            name="Science Art Sports (Evening)"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">ACS Christmas Fair 2023</h2>
                    <p className="mb-2">
                        <span className="font-medium">Location:</span> Assumption College Sriracha
                        <br />
                        <span className="font-medium">Date:</span> 21/12/2023 - 22/12/2023
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/er0ntMkrZ9o8msfNJZ2ja27wzG99epI38Fyy93ReJswn3q4GZsZ7h4iVdEg-izKmLwg"
                            name="Day 1"
                        />
                        <LinkButton
                            link="https://jpg.ckl.moe/share/Exta0cLMFZrsGLnvevsx2MirV2WVRYoxzq5PUVpp_D8FHsVHaN3le_oEqeStrIGPous"
                            name="Day 2"
                        />
                    </div>
                </div>

                <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <h2 className="text-3xl font-bold mb-2">ACS Annual Sport Days 2023</h2>
                    <p className="mb-2">
                        <span className="font-medium">Location:</span> Assumption College Sriracha
                        <br />
                        <span className="font-medium">Date:</span> 30/11/2023 - 1/12/2023
                    </p>
                    <div className="pt-2">
                        <LinkButton
                            link="https://jpg.ckl.moe/share/3aGZyBI02491hxhvRyUwdT2joSipk3O-utJucT6I4tOGjZuz_qNoeMJ-YCSRx9wNA_U"
                            name="Day 1"
                        />
                        <LinkButton
                            link="https://jpg.ckl.moe/share/1BmimtLSLKL9vA-mdvuNz_hPPzZ0x7gm82Cw266J26_qJ2QGM1lkDFb-bRCyi98cG5A"
                            name="Day 2"
                        />
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Index;
