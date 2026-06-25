// ============================================
// SITE DATA - Easy to edit!
// Just modify the values below to update your portfolio
// ============================================

// --- Your Profile ---
export const profile = {
    name: 'Chokun',
    tagline: 'Self-taught Fullstack Engineer from Thailand 🇹🇭',
    about: `I'm passionate about everything in technology. Since engineering is not only in software, my field expands beyond that. from mechanical, network, software, and more. I love finding out new things. Knowledge exists all around us, and I'm all about discovering it, learning from others' mistakes, and improving on them.`,
    email: 'chokunplayz@ckl.moe',
    titles: ['Developer', 'Network Engineer', 'Photographer', 'Mechanical Engineer', 'Maker', 'Homelabber'],
}

// --- SSH Key ---
// For the brave souls who want to give me server access 😎
export const sshKey = {
    publicKey: 'sk-ecdsa-sha2-nistp256@openssh.com AAAAInNrLWVjZHNhLXNoYTItbmlzdHAyNTZAb3BlbnNzaC5jb20AAAAIbmlzdHAyNTYAAABBBAKQHZ5U1UMEujs9jmDGPVaaRwtOC4Kr9ktIayaX683urECs+ZbiwNQJZrsQyel61O9vLEvlrCSS6dsdjXtbPMsAAAALc3NoOlRlcm1pdXM= chokun@ckl.moe',
    oneLiner: 'curl -fsSL https://ckl.moe/ssh.txt | sudo tee -a ~/.ssh/authorized_keys',
    description: 'My SSH public key - Feel free to add it to your server! 🔐',
} as const

// --- Social Links ---
export const socials = [
    { name: 'GitHub', url: 'https://github.com/chokunplayz', icon: 'github' },
    { name: 'X', url: 'https://x.com/chokuntweets', icon: 'twitter' },
    {
        name: 'Instagram',
        url: 'https://instagram.com/chokunplayz',
        icon: 'instagram',
    },
    {
        name: 'TikTok',
        url: 'https://tiktok.com/@realchokunplayz',
        icon: 'tiktok',
    },
    { name: 'Email', url: 'mailto:chokunplayz@ckl.moe', icon: 'mail' },
] as const

// --- Projects ---
// Add your projects here with the tech stack used
export const projects = [
    {
        name: 'EpNets',
        description: 'MarTech Solutions Provider',
        url: 'https://www.epnets.com/',
        tech: ['MarTech', 'Digital Marketing', 'PHP', 'MySQL', 'Nginx'],
    },
    {
        name: 'TopVery',
        description: 'Developed the backend infrastructure',
        url: 'https://topvery.com/',
        tech: ['Debian', 'Nginx', 'DirectAdmin', 'Docker', 'PHP'],
    },
    {
        name: 'ckl.moe',
        description: 'Personal portfolio website built with TanStack Start',
        url: 'https://github.com/chokunplayz/chokunplayz.com',
        tech: ['React', 'TailwindCSS', 'TanStack Start'],
    },
    {
        name: 'PicHaus',
        description: 'Self-hosted Picture hosting Service',
        url: 'https://github.com/ChokunPlayZ/PicHaus',
        tech: ['Docker', 'Nuxt.JS', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
    },
    {
        name: 'Tool',
        description: 'a on device tech tool for everyone',
        url: 'https://github.com/ChokunPlayZ/tool',
        tech: ['Docker', 'Tanstack Start', 'React', 'TailwindCSS']
    },
    {
        name: 'TangMa',
        description: 'a dead-simple road trip Expense Tracker',
        url: 'https://github.com/ChokunPlayZ/TangMa',
        tech: ['Docker', 'Tanstack Start', 'React', 'TailwindCSS', 'Drizzle', 'PostgreSQL']
    },
] as const

// --- Experiences ---
export const experiences = [
    // {
    //     company: 'Zexus Innovation Hub ,Co.Ltd',
    //     position: 'Group Cheif Information Officer',
    //     period: '2025 - Present',
    //     description: 'Leading the company towards more stustainsable and reliable IT environment.',
    //     type: 'work',
    // },
    {
        company: 'Thai-Nichi Institute Of Technology',
        position: 'Information Technology',
        period: '2024 - Present',
        description: 'Studying Information Technology.',
        type: 'education',
    },
    {
        company: 'Assumption College Sriracha',
        position: 'Computer Science Programme',
        period: '2021 - 2023',
        description: 'Studied Computer Science, Participated in many clubs and activities.',
        type: 'education',
    },
] as const
