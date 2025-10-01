import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

type NavLinksProps = {
    onClick?: () => void
}
export default function NavLinks({ onClick }: NavLinksProps) {
    type NavLinks = {
        title: string
        href: string
    }
    const linksNav: NavLinks[] = [
        {
            title: "Home",
            href: "/",
        },
        {
            title: "Anime",
            href: "/anime",
        },
        {
            title: "Business",
            href: "/business",
        },
    ];
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="flex gap-3 items-center">
            {linksNav.map(link => (
                <Link
                    key={link.title}
                    href={link.href}
                    onClick={onClick}
                    className="block hover:text-blue-600 transition"
                >
                    {link.title}
                </Link>
            ))}
            {auth.user &&
                <Link
                href={route('admin')}
                className="mt-1 inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
            >
                Admin
            </Link> }
        </div>
    )
}
