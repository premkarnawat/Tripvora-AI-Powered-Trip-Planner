"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="pt-32 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto text-center md:text-left relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center gap-4"
      >
        {Icon && (
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-sora mb-4 md:mb-2">{title}</h1>
          {description && (
            <p className="text-lg text-white/60 max-w-2xl">{description}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
