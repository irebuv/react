import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CartButton from './CartButton';
import CartModal from './CartModal';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import NavLinks from './NavLinks';
import { motion } from "framer-motion";


type CartItem = {
    id: number;
    name: string;
    price: string;
};

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { auth } = usePage<SharedData>().props;

    const cartItems: CartItem[] = [
        { id: 1, name: 'Nike Sneakers', price: '$120' },
        { id: 2, name: 'Adidas T-Shirt', price: '$35' },
        { id: 3, name: 'Puma Shorts', price: '$45' },
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
            initial={{ boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
            animate={{
                //boxShadow: scrolled ? "0px 4px 6px rgba(0,0,0,0.1)" : "0px 0px 0px rgba(0,0,0,0)",
            }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white top-0 left-0 z-50 px-10"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Logo />

                {/* Desktop navigation */}
                <nav className="hidden space-x-8 font-medium text-gray-700 md:flex">
                    <NavLinks />
                </nav>

                <div className="flex items-center space-x-4">
                    <CartButton itemCount={cartItems.length} onClick={() => setCartOpen(true)} />

                    {/* Burger menu toggle */}
                    <button className="focus:outline-none md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="h-7 w-7 text-gray-700" /> : <Menu className="h-7 w-7 text-gray-700" />}
                    </button>
                    <div>
                        {auth.user ? (
                            <Link
                                href={route('logout')}
                                method={'post'}
                                className="cursor-pointer inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Log out
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18]  dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
            <CartModal open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} />
        </motion.header>
    );
}
