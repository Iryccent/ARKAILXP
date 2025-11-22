import React from 'react';
import { motion } from 'framer-motion';

const KaiBubble = ({ onClick }) => {
    return (
        <motion.div
            className="relative group cursor-pointer"
            onClick={onClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-lg opacity-20 group-hover:opacity-50 animate-pulse transition-opacity duration-500"></div>

            {/* Core Orb */}
            <div className="relative w-16 h-16 rounded-full bg-black border border-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center overflow-hidden">

                {/* 3D Avatar Video */}
                <video
                    src="https://i.imgur.com/MwJEV84.mp4"
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover transform scale-110"
                />

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent w-full h-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>
            </div>

            {/* Notification Dot */}
            <div className="absolute top-0 right-0 w-4 h-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-black"></span>
            </div>
        </motion.div>
    );
};

export default KaiBubble;
