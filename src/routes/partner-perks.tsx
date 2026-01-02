import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Car, Zap, Wrench, Wifi, Monitor, Camera, HardDrive, Film, Youtube, Server, Heart, Cloud, Mail, MapPin, Check, Sparkles, AlertTriangle, Cpu } from 'lucide-react'

export const Route = createFileRoute('/partner-perks')({
    component: PartnerPerks,
})

function PartnerPerks() {
    const [showJoke, setShowJoke] = useState(false)

    return (
        <div className="min-h-screen bg-pink-50 dark:bg-slate-900 flex flex-col items-center py-20 px-6 font-sans">
            <div className="max-w-3xl w-full space-y-12">
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6 animate-bounce-slow">
                        <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tight">
                        Partner <span className="text-pink-500">Perks</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                        Exclusive benefits package for my special one.
                        <br className="hidden md:block" />
                        Terms and conditions apply (mostly hugs).
                    </p>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                        Personal Services
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <PerkCard icon={<Car />} title="Personal Driver" description="On-call transportation to anywhere you need to go, I'm not letting another girl touch a car so please just sit and relax." />
                        <PerkCard icon={<Zap />} title="Electrician" description="Fixing lights, switches, and anything that sparks." />
                        <PerkCard icon={<Wrench />} title="Plumber" description="Handling leaks and clogs so you don't have to." />
                        <PerkCard icon={<Wifi />} title="Internet Guy" description="Guaranteed 99.9% uptime and tech support. 24/7" />
                        <PerkCard icon={<Monitor />} title="Computer Tech" description="Hardware repairs, software fixes, and custom builds (hardware is expensive, bring your own)." />
                        <PerkCard icon={<Camera />} title="Photographer" description="Professional photo shoots for your Instagram." />
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                        Tech & Media Access
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <PerkCard icon={<HardDrive />} title="36TB NAS Access" description="Unlimited storage, for files and photo backups." />
                        <PerkCard icon={<Film />} title="Personal Media Collection" description="200+ Anime, 60+ Movies, growing daily." />
                        <PerkCard icon={<Youtube />} title="YouTube Premium" description="there's one free slot." />
                        <PerkCard icon={<Server />} title="Web Hosting & Compute" description="Free resources for your silly projects." />
                        <PerkCard icon={<Cloud />} title="iCloud+ Subscription" description="if you're an apple sheep, welcome." />
                        <PerkCard icon={<Mail />} title="Custom Email" description="Your own @ckl.moe email address." />
                        <PerkCard icon={<MapPin />} title="Real-time Location" description="other guys hesitant when giving you this, I'm not going anywhere anyway. (iSheep only)" />
                        <PerkCard icon={<Cpu />} title="Hardware Lab Access" description="Full access to my lab and extensive microcontroller collection." />
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
                        Requirements
                    </h2>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                Must Haves
                            </h3>
                            <ul className="space-y-3">
                                <RequirementItem text="A girl" />
                                <RequirementItem text="Must breathe (negotiable)" />
                                <RequirementItem text="Patient (required) (I can be very annoying so please be patient)" />
                                <RequirementItem text="Can tolerate me spending a lot of money on hardware" />
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                Bonus Points
                            </h3>
                            <ul className="space-y-3">
                                <RequirementItem text="Collects Manga" />
                                <RequirementItem text="Collects Figures" />
                                <RequirementItem text="Reads Light Novels" />
                                <RequirementItem text="Likes to watch anime" />
                                <RequirementItem text="Codes" />
                            </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 flex gap-4">
                            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-red-700 dark:text-red-400">Important Note</h4>
                                <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                                    For the love of god, please have a clear plan when going anywhere. Don't change the plan every second. My GPS runs on logic, not vibes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-pink-100 dark:border-pink-900/20 text-center space-y-4 transform hover:scale-[1.02] transition-transform">
                    <p className="text-xl font-medium text-slate-800 dark:text-white">
                        ...and more to come!
                    </p>
                    <div className="h-px w-24 bg-pink-200 dark:bg-pink-800 mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                        "My mom said having me around make her life much easier, you get all that and more."
                    </p>
                </div>

                <div className="mt-8 text-center pb-8">
                    {!showJoke ? (
                        <button
                            onClick={() => setShowJoke(true)}
                            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                        >
                            Apply Now
                        </button>
                    ) : (
                        <p className="text-pink-500 font-bold text-lg">
                            Why are you clicking this anyway?
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function PerkCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300 group-hover:text-pink-500 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

function RequirementItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
            <span>{text}</span>
        </li>
    )
}
