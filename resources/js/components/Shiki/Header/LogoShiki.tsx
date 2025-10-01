import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

function LogoShiki({className}: React.ComponentProps<"div">) {
    return (
        <motion.div
            whileHover={{ scale: 1.3 }}
            className={cn("text-3xl font-bold text-blue-600 cursor-pointer", className)}
        >
            ShikiCopy
        </motion.div>
    );
}

export default LogoShiki;
