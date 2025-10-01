import NavLinksShiki from '@/components/Shiki/Header/NavLinksShiki';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

type NavLink = {
    title: string
    href: string
}

type MenuHeaderProps = {
    linksNav: NavLink[]
}
function MenuHeader({ linksNav } : MenuHeaderProps  ) {
    const [profileOpen, setProfileOpen] = useState(false);
    return (
        <div className="relative">
            <button
                className="cursor-pointer focus:outline-none"
                onClick={() => {
                    setProfileOpen(!profileOpen);
                }}
            >
                <div className="flex">Menu {profileOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}</div>
            </button>
            <nav className="absolute left-[-50%] flex space-x-8 font-medium text-gray-700">
                <AnimatePresence>
                    {profileOpen && (
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4 bg-white px-6 py-4 font-medium text-gray-700 shadow-md"
                        >
                            <NavLinksShiki linksNav={linksNav} />
                        </motion.nav>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
}

export default MenuHeader;
