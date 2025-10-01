import { Link } from '@inertiajs/react';

type NavLink = {
    title: string
    href: string
}

type NavLinksProps = {
    onClick?: () => void;
    linksNav: NavLink[];
}

function NavLinksShiki({ onClick, linksNav }: NavLinksProps) {

console.log(linksNav)

    return (
        <div className=" gap-3 ">
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
        </div>
    );
}

export default NavLinksShiki;
