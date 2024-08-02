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
            <h1 className="mt-36 font-bold text-2xl md:text-5xl mb-4">TNI Photo Project</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                หน้าเว็บนั้จะรวมรูปที่ผมถ่ายใน สภาบันเทคโนโลยี ไทย-ญี่ปุ่น<br/><br/>
                วิธีโหลดรูป <br/>
                - สำหรับทุก platform ถ้ายังไม่ได้เปิดใน google chrome หรือ safari ให้กดปุ่มแชร์ และกด "เปิดใน browser เร่มต้น" <br/>
                - กดลิงค์ download ของงานนั้นๆ <br/>
                - เลือกรูปที่จะโหลด <br/>
                - กดปุ่มรูปก้อนเมฆด้านมุมบนขวา <br/>
                - ถ้าใช้ safari โหลดเสร็จแล้ว รูปจะอยู่มุมล่างขวา รูป download (ลูกศรชี้ลง ในวงกลม) <br/>
                - กดเข้าไป กดไฟล์รูปที่โหลดมา กดแชร์ แล้วบันทึกได้เลย <br/>
                - เรียบร้อย <br/>
                (สำหรับ Andriod วิธีไม่เหมือนกันทุกเครื่องนะ ทักมาถามได้ จะพยายามสอนทำ แต่ถ้ามีผู้รู้ไกล้ตัว ลองถามดูก่อนนะ!) <br/>
                โหลดรูปเสร็จแล้ว ชอบ ไม่ชอบ ยังไงทักมาบอกได้น้า จะได้เอาไปพัฒนาในงานต่อๆไปนะครับ ขอบคุณทุกคนที่ให้ถ่ายรูปนะ!
            </p>

            <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding pt-5 ps-5 pb-6 mb-2 items-center backdrop-filter backdrop-blur-sm bg-opacity-10">
                <h2 className="text-3xl font-bold mb-2">TNI Day (2024)</h2>
                <p className="mb-2">
                    <span className="font-medium">Date:</span> 2/08/2024
                </p>
                <div className="pt-2">
                    <LinkButton
                        link="https://jpg.ckl.moe/share/EgoAnErncQ8M-KsbeiTes4zIGn4Mya6ribiyek28j4F_YPkPaQRrMYTeFkieOjlPCE4"
                        name="Download Here!"
                    />
                </div>
            </div>

        </motion.div>
    );
};

export default Index;
