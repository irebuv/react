import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"

type CartButtonProps = {
    itemCount: number
    onClick: () => void
}

export default function CartButton({ itemCount, onClick }: CartButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer"
            onClick={onClick}
        >
            <ShoppingCart className="w-7 h-7 text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {itemCount}
      </span>
        </motion.div>
    )
}
