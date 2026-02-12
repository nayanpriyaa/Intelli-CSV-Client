import { motion } from "framer-motion";

export default function AppShell({ children }) {
  return (
    <motion.div
      className="min-h-screen bg-[#0b0b0e] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
