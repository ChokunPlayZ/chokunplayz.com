import { motion } from "framer-motion";
import { classNames } from "../util/classNames";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Head from "next/head";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

type Props = {
    params: { id: string };
};

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
        <div>
            <Head>
                <title>ACS7760 Gala Dinner Photos</title>
                <meta name="description" content="รูปจากงาน Gala Dinner ACS7760 Harmonia Night" />

                <meta property="og:title" content="ACS7760 Gala Dinner Photos" />
                <meta property="og:description" content="รูปจากงาน Gala Dinner ACS7760 Harmonia Night" />

                <meta name="twitter:title" content="ACS7760 Gala Dinner Photos" />
                <meta name="twitter:description" content="รูปจากงาน Gala Dinner ACS7760 Harmonia Night" />
            </Head>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ ease: "easeOut", duration: 0.15 }}
                className="mt-24 w-full mb-32"
            >
                <h1 className="mt-36 font-bold text-red-500 text-2xl md:text-5xl mb-4">คำเตือน</h1>
                <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                    รูปในหน้านี้บางรูป มีสิ่งที่ไม่ควรออกสื่อ เพราะฉะนั้น โพสอย่างระวังนะครับ :)
                </p>

                <div className="h-full bg-gray-400 rounded-md pt-5 ps-5 pb-5 bg-opacity-10">
                    <LinkButton
                        link="https://jpg.ckl.moe/share/GJkqGVXz1lRsaSzQ7DUYWFVdt_0fazDbXs8e9cOJnEL5rD01B2KoGM4uYY-e19xIJLY"
                        name="Gallery"
                    />
                    <LinkButton
                        link="https://photos.app.goo.gl/78KBhQ16M1Sig3RAA"
                        name="Google Photos (สำรอง)"
                    />
                    <LinkButton
                        link="https://drive.google.com/drive/folders/1YJgpXPltxMSEU3aoKvKa5pa3BOHO6AqJ?usp=sharing"
                        name="Raws (ไฟล์สด) (Google Drive)"
                    />
                </div>

                <p className="text-white-800 dark:text-white leading-6 tracking-wide mb-6 mt-12">
                    ก่อนอื่นก็ขอบคุณที่เลื่อนมาอ่านนะ ไม่ได้คิดว่าจะมีใครมาอ่านแหละ แต่กว่า ก็ขอขอบคุณ คนที่เรียกให้ถ่ายให้ ก็ยินดีครับ วันนี้สนุกมาก ในรูปแบบของตากล้องเอง อาจจะไม่ได้กระโดด เต้น เหมือนคนอื่น เพราะกลัวกล้องแตกแหละ เดะพ่อด่า, แต่ก็สนุกจริงๆ ใครจะเอารูปไปลงก็แทคได้นะ <a href="https://instagram.com/chokunplayz">@chokunplayz</a> งานนี้ก็เป็นงานสุดท้ายที่จะได้เห็นในนามของ เด็กอัสสัม, เพราะก็จบแล้วเนอะ, คงจะไม่ได้ใส่ชุดนักเรียนแบกกล้องเข้าโรงเรียนนี้แล้วแหละ, ท้ายนี ขอโทษนะ ที่งานอาจจะออกมาไม่ตามความคาดหวัง เกิดข้อผิดพลาดที่ใด ขออภัย มา ณ ขณะนี้ ด้วย งานนี้หินจริงๆ นั้งแก้แสง สี นานมาก บวกกับมีแฟรช ยิ่งทำยากขึ้นอีก ท้ายจริงๆละ ขอให้ทุกคน ประสพความสำเร็จในรั้วหมาลัย เจอแต่เพื่อนดีๆ ไปเรียนใหนก็มีคนรัก เกรดดีๆ แล้วใว้กลับมาเจอกันที่รั้วแดงขาวที่นี่อีกนะ ถึงตอนนั้น ก็อาจจะวางมือจากวงการช่างภาพละ กล้องหนัก 555
                </p>

                <p className="text-gray-800 dark:text-white leading-6 tracking-wide mb-4">
                    Farewell ACS7760 <br/>
                    - Chokun
                </p>

                <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-4">
                    อะ contact เผื่อใครอยากเก็บใว้นะ <br/>
                    Tel: 063-541-4659 <br/>
                    IG: @chokunplayz <br/>
                    FB: Chokun Rojanapron <br/>
                </p>
            </motion.div>
        </div>
    );
};

export default Index;
