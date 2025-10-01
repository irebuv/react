import LogoShiki from '@/components/Shiki/Header/LogoShiki';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MenuHeader from '@/components/Shiki/Header/Menu';

function HeaderShiki() {
    const [scrolled, setScrolled] = useState(false);


    type NavLinks = {
        title: string;
        href: string;
    };
    const linksNav: NavLinks[] = [
        {
            title: 'Home',
            href: '/',
        },
        {
            title: 'Anime',
            href: '/anime',
        },
        {
            title: 'Categories2',
            href: '/categories',
        },
        {
            title: 'Categories1',
            href: '/categories',
        },
    ];

    const linksNav2: NavLinks[] = [
        {
            title: 'Home2',
            href: '/',
        },
        {
            title: 'Categ2ies',
            href: '/categories',
        },
        {
            title: 'Ca2ories2',
            href: '/categories',
        },
        {
            title: 'Categories1',
            href: '/categories',
        },
    ];


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ boxShadow: '0px 0px 0px rgba(0,0,0,0)' }}
            animate={{ boxShadow: scrolled ? '0px 4px 6px rgba(0,0,0,0.1)' : '0px 0px 0px rgba(0,0,0,0)' }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 left-0 z-40 w-full bg-white p-2"
        >
            <div className="grid grid-cols-(--grid-collumns-5-1auto) items-center gap-4 px-7">
                <LogoShiki className={'-mt-2'} />
                {/*<div className="relative">*/}
                {/*    <button*/}
                {/*        className="cursor-pointer focus:outline-none"*/}
                {/*        onClick={() => {*/}
                {/*            setMobileOpen(!mobileOpen);*/}
                {/*            setProfileOpen(false);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <div className="flex">*/}
                {/*            Menu {mobileOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}*/}
                {/*        </div>{' '}*/}
                {/*    </button>*/}
                {/*    <nav className="absolute left-[-50%] flex space-x-8 font-medium text-gray-700">*/}
                {/*        <MobileMenuShiki open={mobileOpen} onClose={() => setMobileOpen(false)} />*/}
                {/*    </nav>*/}
                {/*</div>*/}
                <MenuHeader linksNav={linksNav} />
                <div className="w-auto px-3 py-3">
                    <Input className={'h-7'} />
                </div>
                <div className="justify-self-end">
                    f
                </div>
                {/*<div className="relative justify-self-end">*/}
                {/*    <button*/}
                {/*        className="cursor-pointer focus:outline-none"*/}
                {/*        onClick={() => {*/}
                {/*            setProfileOpen(!profileOpen);*/}
                {/*            setMobileOpen(false);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <div className="flex">*/}
                {/*            Profile {profileOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}*/}
                {/*        </div>*/}
                {/*    </button>*/}
                {/*    <nav className="absolute left-[-50%] flex space-x-8 font-medium text-gray-700">*/}
                {/*        <MobileMenuShiki open={profileOpen} onClose={() => setMobileOpen(false)} />*/}
                {/*    </nav>*/}
                {/*</div>*/}
                <MenuHeader linksNav={linksNav2} />
            </div>
        </motion.header>
    );
}

export default HeaderShiki;
