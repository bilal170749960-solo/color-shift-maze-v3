/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const PRESET_COLORS = ['#ff3b30', '#34c759', '#007aff', '#ffcc00', '#af52de', '#ff9500'];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    // Smooth progress loading simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        
        // Dynamic increments
        const nextProgress = prev + Math.floor(Math.random() * 8) + 4;
        return Math.min(100, nextProgress);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Color rotation for the glowing cube
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % PRESET_COLORS.length);
    }, 800);
    return () => clearInterval(colorInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030712] text-white flex flex-col items-center justify-center z-[999] select-none font-sans overflow-hidden">
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Radial soft background glows */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[120px] opacity-20 transition-all duration-1000"
        style={{ backgroundColor: PRESET_COLORS[colorIndex] }}
      />

      <div className="w-full max-w-xs px-6 flex flex-col items-center z-10">
        {/* Color Shifting 3D Cube Container */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center perspective-1000">
          <motion.div
            animate={{ rotateX: 360, rotateY: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-lg shadow-lg relative transition-all duration-1000"
            style={{ 
              backgroundColor: PRESET_COLORS[colorIndex],
              boxShadow: `0 0 30px ${PRESET_COLORS[colorIndex]}cc`,
            }}
          />
          {/* Orbital orbiting ring */}
          <div 
            className="absolute inset-0 border border-dashed rounded-full animate-spin [animation-duration:10s]" 
            style={{ borderColor: `${PRESET_COLORS[(colorIndex + 1) % PRESET_COLORS.length]}55` }}
          />
        </div>

        {/* Premium Game Name / Logo */}
        <h1 className="text-2xl font-display font-black tracking-widest uppercase mb-4 text-white">
          Color Shift <span className="text-teal-400">Maze</span>
        </h1>
        <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-8">
          The ultimate spectrum matrices puzzle
        </p>

        {/* Loading progress bar container */}
        <div className="w-full bg-white/5 h-1.5 p-[2px] rounded-full overflow-hidden mb-3 border border-white/5 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 shadow-md shadow-teal-500/50"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Info panel below loading progress */}
        <div className="flex items-center justify-between w-full px-1 text-[10px] font-mono text-slate-400 tracking-wider">
          <span className="uppercase animate-pulse">Initializing...</span>
          <span className="text-teal-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
