import { motion } from "framer-motion"

export default function Logo() {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
            MyShop
        </motion.div>
    )
}
