/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Volume2,
  Vibrate,
  Award,
  BookOpen,
  RotateCcw,
  VolumeX,
  X,
  Lock,
  Star,
  CheckCircle2,
  TrendingUp,
  Flame,
  User,
  Info,
  Maximize,
  Minimize,
  Music,
  Volume1,
  Sliders,
  Sparkles,
  Palette,
  Gift,
  Tv,
  ChevronRight,
  ArrowLeft,
  Compass,
  Trophy,
  Activity,
  UserCheck,
  Shield,
  HelpCircle,
  Clock,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, LevelProgress, Achievement, PlayerStats } from '../types';
import { audio } from '../audio';
import { AdsManager } from '../lib/AdsManager';

// --- MAIN MENU OVERLAY ---
interface MainMenuProps {
  onStartGame: () => void;
  onOpenLevels: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
  onOpenDailyChallenge: () => void;
  onOpenCustomizer: () => void;
  onOpenLuckySpin: () => void;
  playerStats: PlayerStats;
  sfxVolume: number;
  musicVolume: number;
  onSfxVolumeChange: (vol: number) => void;
  onMusicVolumeChange: (vol: number) => void;
  vibration: boolean;
  onVibrationToggle: (enabled: boolean) => void;
  isMuted: boolean;
  isMusicEnabled: boolean;
  onMuteToggle: (muted: boolean) => void;
  onMusicToggle: (enabled: boolean) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenLevels,
  onOpenSettings,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenDailyChallenge,
  onOpenCustomizer,
  onOpenLuckySpin,
  playerStats,
  sfxVolume,
  musicVolume,
  onSfxVolumeChange,
  onMusicVolumeChange,
  vibration,
  onVibrationToggle,
  isMuted,
  isMusicEnabled,
  onMuteToggle,
  onMusicToggle,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Sync initial fullscreen state and handle changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Sync Lucky Spin countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const savedLastSpin = localStorage.getItem('cs_lucky_last_spin_time');
      if (savedLastSpin) {
        const lastSpin = parseInt(savedLastSpin, 10);
        const elapsed = Date.now() - lastSpin;
        const cooldown = 86400000 - elapsed;
        setCooldownRemaining(cooldown > 0 ? cooldown : 0);
      } else {
        setCooldownRemaining(0);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMenuCooldown = (ms: number) => {
    if (ms <= 0) return 'FREE SPIN';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const toggleFullscreen = () => {
    audio.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Generate highly premium deterministic floating particles to avoid hydration mismatches
  const particles = useMemo(() => {
    return Array(15).fill(null).map((_, i) => ({
      id: i,
      left: `${(i * 7 + 13) % 100}%`,
      size: (i % 3 === 0) ? 6 : (i % 2 === 0) ? 4 : 2,
      duration: 10 + (i * 3.5) % 12,
      delay: (i * 1.8) % 8,
      colorClass: (i % 3 === 0) ? 'bg-blue-400/30' : (i % 2 === 0) ? 'bg-purple-500/20' : 'bg-pink-500/25'
    }));
  }, []);

  // Compute profile rank and progression
  const xp = playerStats.xp || 0;
  const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  const levelXpProgress = xp - currentLevelBaseXp;
  const xpRequiredForNext = nextLevelXp - currentLevelBaseXp;
  const xpPercentage = Math.min(100, Math.max(0, (levelXpProgress / xpRequiredForNext) * 100));

  const playerRankName = useMemo(() => {
    if (playerStats.levelsCompleted >= 60) return 'Chroma Sovereign';
    if (playerStats.levelsCompleted >= 45) return 'Prism Master';
    if (playerStats.levelsCompleted >= 30) return 'Spectral Voyager';
    if (playerStats.levelsCompleted >= 15) return 'Adept Shifter';
    return 'Apprentice Mage';
  }, [playerStats.levelsCompleted]);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 select-none relative overflow-y-auto overflow-x-hidden">
      {/* Immersive radial glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] aspect-square bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[60%] aspect-square bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Floating particles background engine */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: '110%', opacity: 0 }}
            animate={{
              y: '-10%',
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear'
            }}
            className={`absolute rounded-full blur-[0.5px] ${p.colorClass}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* TOP USER HEADS-UP DISPLAY BAR */}
      <div className="w-full max-w-md mx-auto px-5 pt-6 flex items-center justify-between z-10 select-none">
        {/* Left Side: Premium Player Card */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-500 p-[1.5px] shadow-lg shadow-indigo-500/15">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center text-indigo-400">
                <User size={18} className="animate-pulse" />
              </div>
            </div>
            {/* Level bubble badge */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-[10px] font-mono font-black text-white flex items-center justify-center border border-[#030712]">
              {currentLevel}
            </span>
          </div>
          
          <div className="text-left">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block leading-none">{playerRankName}</span>
            <span className="text-sm font-display font-bold text-white mt-0.5 block leading-none">Player {currentLevel * 3 + 7}</span>
            {/* Tiny progress line */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${xpPercentage}%` }} />
              </div>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Right Side: Coin Inventory Chest */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={() => {
            audio.playClick();
            onOpenCustomizer();
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 hover:from-amber-500/15 hover:to-yellow-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all select-none"
        >
          <div className="w-5 h-5 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-full flex items-center justify-center shadow-md animate-spin [animation-duration:15s]">
            <Coins size={11} fill="currentColor" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[8px] font-mono text-amber-400 font-black uppercase tracking-wider">BALANCE</span>
            <span className="text-xs font-mono font-black text-white mt-0.5">{playerStats.coins || 0}</span>
          </div>
        </motion.div>
      </div>

      {/* CORE LOGO / DISPLAY HERO STAGE */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 max-w-md mx-auto w-full z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center"
        >
          {/* Animated decorative shapes */}
          <div className="flex justify-center gap-2 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 bg-gradient-to-tr from-red-500 to-orange-500 rounded-md shadow-lg shadow-red-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 bg-gradient-to-tr from-green-500 to-teal-500 rounded-md shadow-lg shadow-green-500/20"
            />
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-md shadow-lg shadow-blue-500/20"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            COLOR SHIFT<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">MAZE</span>
          </h1>
          
          <p className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase opacity-85 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles size={10} className="text-teal-400 animate-pulse" /> A SPECTRO-PUZZLE ADVENTURE <Sparkles size={10} className="text-teal-400 animate-pulse" />
          </p>
        </motion.div>

        {/* PRIMARY CALL-TO-ACTION (Pulse Play) */}
        <div className="w-full flex flex-col gap-3.5 mt-8 max-w-xs mx-auto">
          {/* Large Animated Play button */}
          <motion.button
            id="btn_play"
            whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            onClick={() => {
              audio.playClick();
              onStartGame();
            }}
            className="w-full py-4.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-display font-black text-xl rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 border border-blue-400/20 transition-all select-none cursor-pointer relative overflow-hidden group"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_1.8s_infinite]" />
            <Play size={22} fill="currentColor" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-pulse" /> TAP TO PLAY
          </motion.button>
        </div>
      </div>

      {/* BENTO-GRID OPTIONS / CAMPAIGN TILES */}
      <div className="w-full max-w-md mx-auto px-5 pb-8 z-10 flex flex-col gap-4 select-none">
        
        {/* Interactive Adventure Mode Progress Strip */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => {
            audio.playClick();
            onOpenLevels();
          }}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-[#111827]/85 to-[#0f172a]/90 border border-white/5 shadow-md flex items-center justify-between cursor-pointer transition-all hover:bg-white/3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <Compass size={18} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Adventure Mode</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {playerStats.levelsCompleted || 0} / 75 Handcrafted Levels Cleared
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-amber-400">
              <Star size={10} fill="currentColor" /> {playerStats.totalStars || 0}
            </div>
            <ChevronRight size={14} className="text-slate-500" />
          </div>
        </motion.div>

        {/* 2-Column Grid: Daily Challenge & Lucky Spin */}
        <div className="grid grid-cols-2 gap-3.5">
          
          {/* Daily Challenge Bento Box */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              audio.playClick();
              onOpenDailyChallenge();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 shadow-md flex flex-col justify-between items-start cursor-pointer transition-all hover:border-amber-500/35 relative overflow-hidden group min-h-[110px]"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all" />
            
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame size={16} fill="currentColor" className="animate-pulse" />
            </div>
            
            <div className="text-left mt-3">
              <span className="text-[11px] font-black text-white uppercase tracking-wide block">Daily Rift</span>
              {playerStats.dailyStreak > 0 ? (
                <span className="text-[9px] font-mono font-bold text-amber-400 mt-0.5 block">
                  🔥 {playerStats.dailyStreak} Day Streak
                </span>
              ) : (
                <span className="text-[9px] text-slate-400 mt-0.5 block">New Maze Every 24h</span>
              )}
            </div>
          </motion.div>

          {/* Lucky Spin Bento Box */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              audio.playClick();
              onOpenLuckySpin();
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/10 to-blue-500/5 border border-teal-500/20 shadow-md flex flex-col justify-between items-start cursor-pointer transition-all hover:border-teal-500/35 relative overflow-hidden group min-h-[110px]"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all" />
            
            <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 shadow-inner">
              <Gift size={16} fill="currentColor" className="animate-bounce" />
            </div>
            
            <div className="text-left mt-3 w-full">
              <span className="text-[11px] font-black text-white uppercase tracking-wide block">Lucky Spin</span>
              <span className={`text-[9px] font-mono font-bold mt-0.5 block truncate leading-none ${cooldownRemaining <= 0 ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`}>
                {cooldownRemaining <= 0 ? 'READY TO SPIN!' : formatMenuCooldown(cooldownRemaining)}
              </span>
            </div>
          </motion.div>

        </div>

        {/* 3-Column Utility Quick Bar: Shop, Trophies, Quick Settings */}
        <div className="grid grid-cols-3 gap-3">
          {/* Shop Option */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audio.playClick();
              onOpenCustomizer();
            }}
            className="py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <Palette size={16} className="text-teal-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Shop</span>
          </motion.button>

          {/* Trophies Option */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audio.playClick();
              onOpenAchievements();
            }}
            className="py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <Trophy size={16} className="text-amber-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Records</span>
          </motion.button>

          {/* Quick Settings Drawer trigger */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audio.playClick();
              setShowQuickSettings(!showQuickSettings);
            }}
            className={`py-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm border ${
              showQuickSettings
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/5 text-slate-300'
            }`}
          >
            <Sliders size={16} className="text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Control</span>
          </motion.button>
        </div>

        {/* Expandable Quick Settings Drawer panel */}
        <AnimatePresence>
          {showQuickSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden flex flex-col gap-3.5 p-4 select-none text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-1">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={13} className="text-indigo-400" /> SYSTEM CONFIG
                </span>
                <button
                  onClick={() => {
                    audio.playClick();
                    setShowQuickSettings(false);
                  }}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Sound volume slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    {sfxVolume === 0 ? <VolumeX size={13} className="text-purple-400" /> : <Volume2 size={13} className="text-purple-400" />}
                    Sound Effects Volume
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  id="menu_sfx_slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-1 rounded-lg bg-white/10"
                />
              </div>

              {/* Music volume slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Music size={13} className="text-blue-400" />
                    Background Ambient Music
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  id="menu_music_slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1 rounded-lg bg-white/10"
                />
              </div>

              {/* Grid of Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5">
                {/* Mute Button */}
                <button
                  onClick={() => {
                    audio.playClick();
                    onMuteToggle(!isMuted);
                  }}
                  className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isMuted
                      ? 'bg-red-500/10 text-red-300 border-red-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={13} className="text-red-400" /> Sound: MUTED
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} className="text-purple-400" /> Sound: ON
                    </>
                  )}
                </button>

                {/* Music Toggle Button */}
                <button
                  onClick={() => {
                    audio.playClick();
                    onMusicToggle(!isMusicEnabled);
                  }}
                  className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    !isMusicEnabled
                      ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {isMusicEnabled ? (
                    <>
                      <Music size={13} className="text-blue-400" /> Music: ON
                    </>
                  ) : (
                    <>
                      <Music size={13} className="text-slate-500" /> Music: OFF
                    </>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize size={13} className="text-amber-400" /> Windowed
                    </>
                  ) : (
                    <>
                      <Maximize size={13} className="text-blue-400" /> Fullscreen
                    </>
                  )}
                </button>

                {/* Haptic vibration Toggle */}
                <button
                  onClick={() => {
                    audio.playClick();
                    onVibrationToggle(!vibration);
                    if (!vibration) {
                      audio.vibrate(50);
                    }
                  }}
                  className={`py-2 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    vibration
                      ? 'bg-green-500/10 text-green-300 border-green-500/20'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Vibrate size={13} className={vibration ? 'text-green-400' : 'text-slate-400'} />
                  Haptics: {vibration ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Sub link for help tutorial */}
              <div className="flex gap-4 justify-between items-center pt-2 mt-1 border-t border-white/5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <button
                  onClick={() => {
                    audio.playClick();
                    onOpenHowToPlay();
                  }}
                  className="hover:text-teal-300 transition-all flex items-center gap-1"
                >
                  <BookOpen size={10} /> Guide Tutorial
                </button>
                <button
                  onClick={() => {
                    audio.playClick();
                    onOpenSettings();
                  }}
                  className="hover:text-teal-300 transition-all"
                >
                  Advanced Controls
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Statistics Credit line */}
        <div className="text-center mt-3">
          <p className="text-[9px] text-slate-500 font-mono select-none uppercase tracking-[0.2em] opacity-75">
            Inspired by Monument Valley • Build v1.4
          </p>
        </div>

      </div>
    </div>
  );
};


// --- LEVELS MENU OVERLAY (Upgraded Adventure World Campaign Map) ---
interface LevelsMenuProps {
  levels: Level[];
  progress: LevelProgress[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

interface CampaignWorld {
  id: number;
  name: string;
  emoji: string;
  description: string;
  startId: number;
  endId: number;
  gradientClass: string;
  accentClass: string;
}

const CAMPAIGN_WORLDS: CampaignWorld[] = [
  {
    id: 1,
    name: 'Spectral Initiation',
    emoji: '✨',
    description: 'Master the fundamental mechanics of color gates and active shift pads.',
    startId: 1,
    endId: 15,
    gradientClass: 'from-slate-900/85 to-indigo-950/90 border-indigo-500/20 shadow-indigo-500/5',
    accentClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
  },
  {
    id: 2,
    name: 'Whispering Canopy',
    emoji: '🌲',
    description: 'Sneak through overgrown trails guarding ancient, color-locked chambers with sentinel patrols.',
    startId: 16,
    endId: 30,
    gradientClass: 'from-emerald-950/85 to-teal-950/90 border-emerald-500/20 shadow-emerald-500/5',
    accentClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  },
  {
    id: 3,
    name: 'Crystalline Glaciers',
    emoji: '❄️',
    description: 'Shatter frozen pathways with keymaster seals and subzero shortcuts.',
    startId: 31,
    endId: 45,
    gradientClass: 'from-cyan-950/85 to-blue-950/90 border-cyan-500/20 shadow-cyan-500/5',
    accentClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  },
  {
    id: 4,
    name: 'Industrial Smelter',
    emoji: '⚙️',
    description: 'Navigate molten iron traps governed by pressure plate grids.',
    startId: 46,
    endId: 60,
    gradientClass: 'from-orange-950/85 to-red-950/90 border-orange-500/20 shadow-orange-500/5',
    accentClass: 'text-orange-400 border-orange-500/30 bg-orange-500/10'
  },
  {
    id: 5,
    name: 'Neon Laboratory',
    emoji: '🧪',
    description: 'Conquer complex networks of multi-stage wormhole quantum teleporters.',
    startId: 61,
    endId: 75,
    gradientClass: 'from-fuchsia-950/85 to-purple-950/90 border-purple-500/20 shadow-purple-500/5',
    accentClass: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10'
  }
];

export const LevelsMenu: React.FC<LevelsMenuProps> = ({
  levels,
  progress,
  onSelectLevel,
  onBack,
}) => {
  // Current active world sub-view state (null means World List view, 1-5 means active level selection for that world)
  const [selectedWorldId, setSelectedWorldId] = useState<number | null>(null);

  const getLevelProgress = (id: number): LevelProgress => {
    return (
      progress.find(p => p.levelId === id) || {
        levelId: id,
        unlocked: id === 1,
        completed: false,
        stars: 0,
        bestMoves: 0,
        bestTime: 0,
        perfectRun: false,
      }
    );
  };

  // Compute stats of a specific world
  const getWorldStats = (world: CampaignWorld) => {
    let completedCount = 0;
    let starsEarned = 0;
    let unlocked = false;

    for (let id = world.startId; id <= world.endId; id++) {
      const prog = getLevelProgress(id);
      if (prog.completed) completedCount++;
      starsEarned += prog.stars;
      if (prog.unlocked) unlocked = true;
    }

    // World is also unlocked if it is World 1
    if (world.id === 1) unlocked = true;

    return { completedCount, starsEarned, unlocked, maxLevels: world.endId - world.startId + 1 };
  };

  const selectedWorld = useMemo(() => {
    return CAMPAIGN_WORLDS.find(w => w.id === selectedWorldId) || null;
  }, [selectedWorldId]);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 select-none overflow-hidden relative">
      {/* Dynamic Background visual glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="px-5 py-4.5 flex items-center justify-between border-b border-white/5 bg-[#080d16]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              if (selectedWorldId !== null) {
                setSelectedWorldId(null); // Return to worlds selection
              } else {
                onBack(); // Return to main menu
              }
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 uppercase block">CAMPAIGN JOURNEY</span>
            <h2 className="text-lg font-display font-black text-white uppercase tracking-tight leading-none mt-0.5">
              {selectedWorld ? `World ${selectedWorld.id}: Level Grid` : 'Adventure Worlds'}
            </h2>
          </div>
        </div>

        {/* Global Stars Counter overlay */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 px-3 py-1 rounded-xl shadow-md font-mono text-xs font-black text-amber-400">
          <Star size={12} fill="currentColor" />
          <span>{progress.reduce((acc, p) => acc + p.stars, 0)} Stars</span>
        </div>
      </div>

      {/* CORE VIEWPORT SCROLLER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 select-none">
        
        <AnimatePresence mode="wait">
          {selectedWorldId === null ? (
            // --- VIEW 1: WORLDS LIST SELECTOR ---
            <motion.div
              key="worlds_selector"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 max-w-md mx-auto w-full pb-8"
            >
              <div className="text-left mb-1.5">
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Select an unlocked campaign biome below. Complete preceding levels to breach subsequent biomes.
                </p>
              </div>

              {CAMPAIGN_WORLDS.map((world) => {
                const stats = getWorldStats(world);
                const isWorldActiveUnlocked = stats.unlocked;

                return (
                  <motion.div
                    key={world.id}
                    id={`world_card_${world.id}`}
                    whileHover={isWorldActiveUnlocked ? { scale: 1.02 } : {}}
                    whileTap={isWorldActiveUnlocked ? { scale: 0.98 } : {}}
                    onClick={() => {
                      if (isWorldActiveUnlocked) {
                        audio.playClick();
                        setSelectedWorldId(world.id);
                      } else {
                        audio.playBlocked();
                      }
                    }}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 relative overflow-hidden shadow-md transition-all ${
                      isWorldActiveUnlocked
                        ? `cursor-pointer bg-gradient-to-br ${world.gradientClass} hover:border-white/10`
                        : 'bg-slate-950/30 border-white/5 opacity-55 cursor-not-allowed'
                    }`}
                  >
                    {/* World Header and Icon badge */}
                    <div className="flex items-center justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border shadow-inner ${
                          isWorldActiveUnlocked ? world.accentClass : 'bg-white/5 border-white/10 text-slate-600'
                        }`}>
                          {world.emoji}
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-widest leading-none">WORLD {world.id}</span>
                          <h3 className="text-sm font-display font-black text-white mt-1 leading-none uppercase">{world.name}</h3>
                        </div>
                      </div>

                      {/* Complete status or lock status */}
                      <div>
                        {isWorldActiveUnlocked ? (
                          stats.completedCount === stats.maxLevels ? (
                            <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">COMPLETED</span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">{stats.completedCount}/{stats.maxLevels} Cleared</span>
                          )
                        ) : (
                          <div className="p-1.5 bg-slate-900 border border-white/10 rounded-xl text-slate-500">
                            <Lock size={12} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description text */}
                    <p className="text-xs text-slate-400 font-medium leading-relaxed text-left relative z-10 mt-1 max-w-[310px]">
                      {world.description}
                    </p>

                    {/* Stars and Progression Bar */}
                    {isWorldActiveUnlocked && (
                      <div className="mt-1 relative z-10 pt-2 border-t border-white/5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase">
                          <span>Progress Rate</span>
                          <span className="text-amber-400 font-black flex items-center gap-0.5">
                            <Star size={10} fill="currentColor" /> {stats.starsEarned} / {stats.maxLevels * 3} Stars
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
                            style={{ width: `${(stats.completedCount / stats.maxLevels) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            // --- VIEW 2: WORLD SPECIFIC LEVEL SELECT GRID ---
            <motion.div
              key="levels_grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 max-w-md mx-auto w-full pb-8 select-none"
            >
              {/* Back button strip inside grid */}
              <button
                onClick={() => {
                  audio.playClick();
                  setSelectedWorldId(null);
                }}
                className="self-start text-xs font-bold text-teal-400 hover:text-teal-300 transition-all uppercase tracking-wider flex items-center gap-1 mt-1 cursor-pointer"
              >
                ← Back to World List
              </button>

              {/* World mini cover panel */}
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${selectedWorld?.gradientClass} border border-white/10 text-left flex flex-col gap-1.5`}>
                <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-widest leading-none">Active Biome {selectedWorld?.id}</span>
                <h3 className="text-base font-display font-black text-white leading-none uppercase">{selectedWorld?.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{selectedWorld?.description}</p>
              </div>

              {/* Levels grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3.5 w-full select-none">
                {levels
                  .filter(l => l.id >= (selectedWorld?.startId || 1) && l.id <= (selectedWorld?.endId || 75))
                  .map((lvl) => {
                    const prog = getLevelProgress(lvl.id);
                    const isLvlUnlocked = prog.unlocked;

                    return (
                      <button
                        id={`lvl_btn_${lvl.id}`}
                        key={lvl.id}
                        disabled={!isLvlUnlocked}
                        onClick={() => {
                          if (isLvlUnlocked) {
                            audio.playClick();
                            onSelectLevel(lvl.id);
                          }
                        }}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2.5 border transition-all select-none ${
                          isLvlUnlocked
                            ? prog.completed
                              ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/25 text-white active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/5'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white active:scale-95 cursor-pointer shadow-md'
                            : 'bg-white/2 border-white/5 text-slate-600 cursor-not-allowed opacity-35'
                        }`}
                      >
                        {/* Level Index */}
                        <span className="text-xs font-mono font-black text-slate-300">
                          {lvl.id}
                        </span>

                        {/* Stars / Lock status */}
                        <div className="my-1 flex items-center justify-center">
                          {!isLvlUnlocked ? (
                            <Lock size={12} className="text-slate-600" />
                          ) : prog.completed ? (
                            <div className="flex gap-0.5 justify-center">
                              {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    size={9}
                                    fill={i < prog.stars ? '#fbbf24' : 'transparent'}
                                    className={i < prog.stars ? 'text-amber-400' : 'text-slate-700'}
                                  />
                                ))}
                            </div>
                          ) : (
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                          )}
                        </div>

                        {/* Label text */}
                        <span className="text-[8px] font-mono font-black uppercase tracking-widest text-slate-400 mt-0.5 leading-none">
                          {prog.completed ? `${prog.bestMoves}M` : 'PLAY'}
                        </span>
                      </button>
                    );
                  })}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};


// --- SETTINGS OVERLAY (Direct compact full view config) ---
interface SettingsMenuProps {
  onBack: () => void;
  onResetProgress: () => void;
  sfxVolume: number;
  musicVolume: number;
  vibration: boolean;
  onSfxVolumeChange: (vol: number) => void;
  onMusicVolumeChange: (vol: number) => void;
  onVibrationToggle: (enabled: boolean) => void;
  isMuted: boolean;
  isMusicEnabled: boolean;
  onMuteToggle: (muted: boolean) => void;
  onMusicToggle: (enabled: boolean) => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onBack,
  onResetProgress,
  sfxVolume,
  musicVolume,
  vibration,
  onSfxVolumeChange,
  onMusicVolumeChange,
  onVibrationToggle,
  isMuted,
  isMusicEnabled,
  onMuteToggle,
  onMusicToggle,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 select-none">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-[#080d16]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            id="btn_settings_back"
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 uppercase block">ADVANCED SETUP</span>
            <h2 className="text-lg font-display font-black text-white uppercase tracking-tight leading-none mt-0.5">
              Settings Panel
            </h2>
          </div>
        </div>
      </div>

      {/* Settings lists container */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 max-w-md mx-auto w-full select-none pb-8">
        
        {/* Music setup block */}
        <div className="bg-white/3 p-4 rounded-2xl border border-white/5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Music size={15} className="text-blue-400" /> Ambient Background Loops
            </span>
            <button
              id="btn_music_toggle_settings"
              onClick={() => {
                audio.playClick();
                onMusicToggle(!isMusicEnabled);
              }}
              className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                isMusicEnabled ? 'bg-blue-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                  isMusicEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
              <span>Volume Adjustment</span>
              <span>{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              id="slider_music"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              disabled={!isMusicEnabled}
              onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* SFX setup block */}
        <div className="bg-white/3 p-4 rounded-2xl border border-white/5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Volume2 size={15} className="text-purple-400" /> Synthesis Sound Effects
            </span>
            <button
              id="btn_mute_toggle_settings"
              onClick={() => {
                audio.playClick();
                onMuteToggle(!isMuted);
              }}
              className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                !isMuted ? 'bg-purple-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                  !isMuted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
              <span>Volume Adjustment</span>
              <span>{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              id="slider_sfx"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              disabled={isMuted}
              onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Vibration Toggle */}
        <div className="bg-white/3 p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-sm">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Vibrate size={15} className="text-green-400 animate-pulse" /> Mobile Haptic Vibration
          </span>
          <button
            id="btn_vibration"
            onClick={() => {
              audio.playClick();
              onVibrationToggle(!vibration);
              if (!vibration) {
                audio.vibrate(50);
              }
            }}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
              vibration ? 'bg-green-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${
                vibration ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Informative tips */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-xs text-slate-300 flex items-start gap-2.5">
          <Info size={16} className="text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
          <p className="leading-relaxed text-left text-slate-400">
            This puzzle operates fully offline. Your game saves, cosmetics, and record trophies are persisted locally on your device storage. Keyboard Arrow keys or WASD are fully supported for desktop browsers!
          </p>
        </div>

        {/* Reset progress block */}
        <div className="mt-6 border-t border-white/5 pt-5">
          {!showConfirmReset ? (
            <button
              id="btn_reset_trigger"
              onClick={() => {
                audio.playClick();
                setShowConfirmReset(true);
              }}
              className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-300 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} /> Clear Game Data Permanently
            </button>
          ) : (
            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-2xl flex flex-col gap-3">
              <p className="text-xs text-red-300 leading-relaxed text-center font-bold uppercase tracking-wider">
                ⚠️ WARNING: IRREVERSIBLE ACTION ⚠️
              </p>
              <p className="text-xs text-slate-400 leading-relaxed text-center">
                This will purge all completed levels, stars, high scores, coins, and custom skins forever!
              </p>
              <div className="grid grid-cols-2 gap-2.5 mt-1.5">
                <button
                  id="btn_reset_cancel"
                  onClick={() => {
                    audio.playClick();
                    setShowConfirmReset(false);
                  }}
                  className="py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn_reset_confirm"
                  onClick={() => {
                    audio.playClick();
                    onResetProgress();
                    setShowConfirmReset(false);
                  }}
                  className="py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};


// --- TROPHIES / ACHIEVEMENTS OVERLAY (Upgraded Hall of Achievements) ---
interface AchievementsMenuProps {
  onBack: () => void;
  achievements: Achievement[];
}

export const AchievementsMenu: React.FC<AchievementsMenuProps> = ({
  onBack,
  achievements,
}) => {
  // Compute global summary metrics
  const unlockedCount = useMemo(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 select-none overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* HEADER BAR */}
      <div className="px-5 py-4.5 flex items-center justify-between border-b border-white/5 bg-[#080d16]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            id="btn_achievements_back"
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 block">TROPHY HALL</span>
            <h2 className="text-lg font-display font-black text-white uppercase tracking-tight leading-none mt-0.5">
              Achievements & Records
            </h2>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENT VIEWPORT SCROLLER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 select-none flex flex-col gap-5">
        
        {/* Global Summary Stats Card */}
        <div className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-900 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between shadow-md text-left">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase leading-none">TROPHY COMPLETION</span>
            <h3 className="text-xl font-display font-black text-white leading-none uppercase">{unlockedCount} / {achievements.length} Unlocked</h3>
            
            {/* Progress Bar strip */}
            <div className="w-32 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/5 mt-1">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Golden badge trophy visual */}
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 animate-pulse shrink-0">
            <Trophy size={24} fill="currentColor" />
          </div>
        </div>

        {/* Trophy listings */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-3 pb-8">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 text-left ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-500/25 shadow-lg shadow-amber-500/5'
                  : 'bg-white/3 border-white/5 text-slate-500'
              }`}
            >
              {/* Left column: Medal ring status */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  ach.unlocked
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-inner'
                    : 'bg-white/5 border-white/10 text-slate-600'
                }`}
              >
                {ach.unlocked ? <Award size={22} className="animate-pulse" /> : <Lock size={16} />}
              </div>

              {/* Right column: Title / description */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-black uppercase tracking-wider leading-none ${
                    ach.unlocked ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5 font-medium">
                  {ach.description}
                </p>

                {/* Individual track progression bar */}
                <div className="w-full bg-slate-950 h-1 rounded-full mt-3 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.unlocked ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                    style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono font-bold uppercase tracking-wider">
                  <span className="text-slate-400">
                    Tracker: {ach.progress} / {ach.maxProgress}
                  </span>
                  {ach.unlocked && (
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <CheckCircle2 size={10} /> UNLOCKED
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};


// --- HOW TO PLAY MANUAL ---
interface HowToPlayProps {
  onBack: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack }) => {
  const tutorialSlides = [
    {
      title: "The Core Cube",
      desc: "You control a colored cube. Slide inside the grid. You are RED by default, and change shades dynamically.",
      icon: "🟥",
      color: "from-red-500/10 to-red-500/30",
    },
    {
      title: "Active Color Pads",
      desc: "Step onto a circular Pad (🟩, 🟦, 🟨, 🟪) to instantly shift your cube's core color to match the pad.",
      icon: "🟢",
      color: "from-green-500/10 to-green-500/30",
    },
    {
      title: "Color Gate Blocks",
      desc: "You can ONLY pass through colored Gates if your current color matches the gate color. Unmatched gates are impassable walls!",
      icon: "⛩️",
      color: "from-blue-500/10 to-blue-500/30",
    },
    {
      title: "Lethal Hazards",
      desc: "Static spikes and moving sentinel patrols 'X' instantly burst you! Timing your moves around their patrols is essential.",
      icon: "🔺",
      color: "from-amber-500/10 to-amber-500/30",
    },
    {
      title: "Keys & Locked Glass",
      desc: "Locked doors 'D' block critical routes. Track down the golden keys 'K' on-board to shatter the locks.",
      icon: "🔑",
      color: "from-yellow-500/10 to-yellow-500/30",
    },
    {
      title: "Teleporter Portals",
      desc: "Warp portals ('1', '2', '3') cross-teleport you instantly to matching sectors. Great for dimensional jumps!",
      icon: "🌀",
      color: "from-cyan-500/10 to-cyan-500/30",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="flex flex-col h-full bg-[#030712] text-slate-100 select-none">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-[#080d16]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            id="btn_tutorial_back"
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-purple-400 uppercase block">HANDBOOK GUIDE</span>
            <h2 className="text-lg font-display font-black text-white uppercase tracking-tight leading-none mt-0.5">
              Tutorial Manual
            </h2>
          </div>
        </div>
      </div>

      {/* Core interactive Carousel */}
      <div className="flex-1 flex flex-col justify-between py-6 px-5 max-w-md mx-auto w-full select-none">
        {/* Slide Window */}
        <div
          className={`flex-1 flex flex-col items-center justify-center p-6 rounded-3xl border border-white/10 bg-gradient-to-b ${tutorialSlides[activeSlide].color} shadow-2xl transition-all duration-300 min-h-[250px] bg-white/5 backdrop-blur-xl`}
        >
          {/* Big symbol icon */}
          <div className="text-5xl md:text-6xl mb-6 animate-bounce [animation-duration:2.5s]">
            {tutorialSlides[activeSlide].icon}
          </div>
          <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide text-center">
            {tutorialSlides[activeSlide].title}
          </h3>
          <p className="text-sm text-slate-300 text-center leading-relaxed mt-3 max-w-[280px]">
            {tutorialSlides[activeSlide].desc}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 my-6">
          {tutorialSlides.map((_, idx) => (
            <button
              id={`dot_${idx}`}
              key={idx}
              onClick={() => {
                audio.playClick();
                setActiveSlide(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx ? 'bg-purple-500 w-6' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Carousel buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn_prev_slide"
            disabled={activeSlide === 0}
            onClick={() => {
              audio.playClick();
              setActiveSlide(prev => Math.max(0, prev - 1));
            }}
            className="py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 disabled:opacity-30 font-bold rounded-2xl transition-all select-none cursor-pointer active:scale-95 text-xs uppercase tracking-wider"
          >
            Previous
          </button>
          <button
            id="btn_next_slide"
            onClick={() => {
              audio.playClick();
              if (activeSlide === tutorialSlides.length - 1) {
                onBack();
              } else {
                setActiveSlide(prev => prev + 1);
              }
            }}
            className="py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all select-none cursor-pointer active:scale-95 shadow-md shadow-purple-500/10 text-xs uppercase tracking-wider"
          >
            {activeSlide === tutorialSlides.length - 1 ? "Got It!" : "Next Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
};
