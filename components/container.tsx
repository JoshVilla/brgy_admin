import React from "react";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
const Container = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Container;
