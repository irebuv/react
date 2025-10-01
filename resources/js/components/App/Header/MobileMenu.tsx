import { motion, AnimatePresence } from "framer-motion"
import NavLinks from "./NavLinks"

type MobileMenuProps = {
    open: boolean
    onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 font-medium text-gray-700"
                >
                    <NavLinks onClick={onClose} />
                </motion.nav>
            )}
        </AnimatePresence>
    )
}
