import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type CartItem = {
    id: number
    name: string
    price: string
}

type CartModalProps = {
    open: boolean
    onClose: () => void
    items: CartItem[]
}

export default function CartModal({ open, onClose, items }: CartModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-[30%] bg-white shadow-lg z-50 flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Cart</h2>
                            <button onClick={onClose}>
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <span>{item.name}</span>
                                    <span className="font-semibold">{item.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
