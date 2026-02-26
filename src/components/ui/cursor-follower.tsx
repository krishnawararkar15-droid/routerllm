"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        translateX: x,
        translateY: y,
        left: -150,
        top: -150,
      }}
      className="fixed pointer-events-none z-[9999] w-[300px] h-[300px] rounded-full opacity-60 mix-blend-screen"
    >
      {/* Outer soft glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-[60px]" />
      
      {/* Middle glow layer */}
      <div className="absolute inset-[50px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-[30px]" />
      
      {/* The "Glassy Ball" core */}
      <div className="absolute inset-[100px] rounded-full border border-white/30 bg-white/5 backdrop-blur-[8px] shadow-[inset_0_0_30px_rgba(255,255,255,0.2),0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Shine/Reflection */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),transparent_40%,rgba(255,255,255,0.1),transparent)] animate-[spin_10s_linear_infinite]" />
        <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/20 rounded-full blur-[5px]" />
      </div>
    </motion.div>
  );
};
