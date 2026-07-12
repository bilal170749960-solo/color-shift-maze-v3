/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Coins, Sparkles, Trophy, X, Tv, RefreshCw, Flame, Star, Palette, Zap } from 'lucide-react';
import { audio } from '../audio';
import { PlayerStats } from '../types';
import { AdsManager } from '../lib/AdsManager';

interface LuckySpinProps {
  playerStats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

interface SpinReward {
  id: string;
  label: string;
  probability: number;
  color: string;
  type: 'coins' | 'skin' | 'trail' | 'theme' | 'particle' | 'mystery' | 'legendary';
  amount?: number;
}

// 100% fair probability configuration
const SPIN_REWARDS: SpinReward[] = [
  { id: 'coins_50', label: '50 Coins', probability: 0.30, color: '#475569', type: 'coins', amount: 50 },
  { id: 'coins_100', label: '100 Coins', probability: 0.25, color: '#334155', type: 'coins', amount: 100 },
  { id: 'coins_150', label: '150 Coins', probability: 0.15, color: '#1e293b', type: 'coins', amount: 150 },
  { id: 'coins_250', label: '250 Coins', probability: 0.10, color: '#0f172a', type: 'coins', amount: 250 },
  { id: 'skin_common', label: 'Common Skin', probability: 0.08, color: '#10b981', type: 'skin' },
  { id: 'trail_rare', label: 'Rare Trail', probability: 0.05, color: '#3b82f6', type: 'trail' },
  { id: 'mystery', label: 'Mystery Reward', probability: 0.05, color: '#8b5cf6', type: 'mystery' },
  { id: 'legendary', label: 'Legendary Item', probability: 0.02, color: '#f59e0b', type: 'legendary' }
];

// Helper to select index using weighted random probabilities
export function getWeightedRewardIndex(): number {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < SPIN_REWARDS.length; i++) {
    cumulative += SPIN_REWARDS[i].probability;
    if (r <= cumulative) {
      return i;
    }
  }
  return 0; // Fallback
}

export const LuckySpin: React.FC<LuckySpinProps> = ({ playerStats, onUpdateStats, onClose }) => {
  // Cooldown & Ad states
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [extraSpins, setExtraSpins] = useState<number>(0);
  const [lastSpinTime, setLastSpinTime] = useState<number>(0);
  const [isTimeValidated, setIsTimeValidated] = useState<boolean>(false);
  const [isCheckingTime, setIsCheckingTime] = useState<boolean>(true);

  // Animation states
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);
  const [showRewardPopup, setShowRewardPopup] = useState<boolean>(false);
  const [rewardDetails, setRewardDetails] = useState<{ title: string; subtitle: string; icon: any; cosmeticName?: string } | null>(null);

  // Ref & rotation physics
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Load persistence states
  useEffect(() => {
    // Extra spins
    const savedExtra = localStorage.getItem('cs_lucky_extra_spins');
    if (savedExtra) {
      setExtraSpins(parseInt(savedExtra, 10));
    }

    // Last spin timestamp
    const savedLastSpin = localStorage.getItem('cs_lucky_last_spin_time');
    if (savedLastSpin) {
      setLastSpinTime(parseInt(savedLastSpin, 10));
    }

    validateAndStartTimer(parseInt(savedLastSpin || '0', 10));
  }, []);

  // Sync Extra Spins to Local Storage
  const updateExtraSpins = (count: number) => {
    setExtraSpins(count);
    localStorage.setItem('cs_lucky_extra_spins', count.toString());
  };

  // Anti-cheat double check time fetching
  const validateAndStartTimer = async (lastSpinTimestamp: number) => {
    setIsCheckingTime(true);
    let currentTime = Date.now();

    // Anti-cheat verification
    const lastSavedLocalTime = parseInt(localStorage.getItem('cs_last_saved_time') || '0', 10);
    
    // Check if the player is changing their local system clock backwards
    if (currentTime < lastSavedLocalTime) {
      console.warn('[Anti-Cheat] System clock rollback detected! Freezing spin timer.');
      currentTime = lastSavedLocalTime; // Penalty: freeze at maximum saved time
    } else {
      localStorage.setItem('cs_last_saved_time', currentTime.toString());
    }

    try {
      // Fetch timezone-independent public API time for cheat-proof verification
      const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const serverTime = new Date(data.utc_datetime).getTime();
        if (serverTime > 0) {
          currentTime = serverTime;
          setIsTimeValidated(true);
        }
      }
    } catch (e) {
      console.log('[AdsManager/LuckySpin] Public time API timed out. Defaulting to secured local system clock.');
    }

    // Calculate initial remaining cooldown (24 hours = 86400000 ms)
    const elapsed = currentTime - lastSpinTimestamp;
    const cooldown = 86400000 - elapsed;
    setCooldownRemaining(cooldown > 0 ? cooldown : 0);
    setIsCheckingTime(false);
  };

  // Keep countdown active every second
  useEffect(() => {
    const timer = setInterval(() => {
      // Validate time progress
      const now = Date.now();
      const lastSaved = parseInt(localStorage.getItem('cs_last_saved_time') || '0', 10);
      
      if (now < lastSaved) {
        // Ignored invalid timer changes / rollback
        return;
      }
      localStorage.setItem('cs_last_saved_time', now.toString());

      setCooldownRemaining((prev) => {
        if (prev <= 1000) {
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown remaining time
  const formatCooldown = (ms: number) => {
    if (ms <= 0) return 'FREE SPIN';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Watch Rewarded Ad for 1 Extra Spin
  const handleWatchAdForExtraSpin = async () => {
    audio.playClick();
    const success = await AdsManager.showRewardedAd('lucky_spin_extra');
    if (success) {
      updateExtraSpins(extraSpins + 1);
      audio.playUnlock();
    }
  };

  // Start spinning physics
  const handleStartSpin = () => {
    if (isSpinning) return;
    if (cooldownRemaining > 0 && extraSpins <= 0) {
      audio.playBlocked();
      return;
    }

    // Spend spin
    if (cooldownRemaining <= 0) {
      // Consume free spin
      const nowTime = Date.now();
      setLastSpinTime(nowTime);
      localStorage.setItem('cs_lucky_last_spin_time', nowTime.toString());
      setCooldownRemaining(86400000); // 24 hours
    } else {
      // Consume extra spin
      updateExtraSpins(extraSpins - 1);
    }

    setIsSpinning(true);
    setWonReward(null);

    // Physics parameters
    const targetRewardIdx = getWeightedRewardIndex();
    const targetReward = SPIN_REWARDS[targetRewardIdx];
    setWonReward(targetReward);

    // Calculate rotation angle to land exactly on the selected slice
    // Slice angle in radians: (2 * Math.PI) / 8
    const sliceAngle = (2 * Math.PI) / 8;
    
    // Land on the center of the target segment
    // Segment indices count counter-clockwise or clockwise, let's line up the pointer at 12 o'clock (-Math.PI/2)
    // Formula to center segment `targetRewardIdx` at top pointer:
    const finalTargetAngle = 2 * Math.PI * 5 + (2 * Math.PI - (targetRewardIdx * sliceAngle + sliceAngle / 2)) - Math.PI / 2;

    let startTime: number | null = null;
    const duration = 5000; // 5 seconds spin

    const animateWheel = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        // Smooth ease-out function
        // t goes from 0 to 1
        const t = progress / duration;
        // Cubic ease-out
        const easeOut = 1 - Math.pow(1 - t, 3);
        
        currentAngleRef.current = finalTargetAngle * easeOut;
        drawWheel();
        
        // Sound click sound effect as slices pass
        const currentSlice = Math.floor(((currentAngleRef.current + Math.PI / 2) % (2 * Math.PI)) / sliceAngle);
        const lastSlice = useRefSlice.current;
        if (currentSlice !== lastSlice) {
          audio.playClick();
          useRefSlice.current = currentSlice;
        }

        animationFrameRef.current = requestAnimationFrame(animateWheel);
      } else {
        // Perfect stop
        currentAngleRef.current = finalTargetAngle;
        drawWheel();
        setIsSpinning(false);
        handleRewardAwarded(targetReward);
      }
    };

    useRefSlice.current = -1;
    animationFrameRef.current = requestAnimationFrame(animateWheel);
  };

  const useRefSlice = useRef<number>(-1);

  // Grant the reward and trigger celebratory overlays
  const handleRewardAwarded = (reward: SpinReward) => {
    // Play celebratory sound
    if (reward.type === 'legendary' || reward.type === 'mystery') {
      audio.playVictory();
    } else {
      audio.playUnlock();
    }

    const nextStats = { ...playerStats };
    let title = '🎉 Congratulations!';
    let subtitle = `You won ${reward.label}!`;
    let cosmeticName = '';

    // History tracking
    const history = JSON.parse(localStorage.getItem('cs_lucky_reward_history') || '[]');
    history.push({ rewardId: reward.id, timestamp: Date.now(), label: reward.label });
    localStorage.setItem('cs_lucky_reward_history', JSON.stringify(history));

    if (reward.type === 'coins' && reward.amount) {
      nextStats.coins = (nextStats.coins || 0) + reward.amount;
    } else if (reward.type === 'skin') {
      // Find a common skin not yet owned
      const currentSkins = nextStats.unlockedSkins || ['cube'];
      const unownedSkins = ['shadow', 'robot', 'knight', 'ghost_skin'].filter(s => !currentSkins.includes(s));
      if (unownedSkins.length > 0) {
        const wonSkin = unownedSkins[Math.floor(Math.random() * unownedSkins.length)];
        nextStats.unlockedSkins = [...currentSkins, wonSkin];
        cosmeticName = wonSkin;
        subtitle = 'You unlocked a new Common Character Skin!';
      } else {
        // coins refund
        nextStats.coins = (nextStats.coins || 0) + 300;
        subtitle = 'You already own all Common Skins! Refunded 300 Coins.';
      }
    } else if (reward.type === 'trail') {
      // Find a rare trail not yet owned
      const currentTrails = nextStats.unlockedTrails || ['default'];
      const unownedTrails = ['fire_trail', 'ice_trail', 'star_trail', 'pixel_trail', 'hearts'].filter(t => !currentTrails.includes(t));
      if (unownedTrails.length > 0) {
        const wonTrail = unownedTrails[Math.floor(Math.random() * unownedTrails.length)];
        nextStats.unlockedTrails = [...currentTrails, wonTrail];
        cosmeticName = wonTrail;
        subtitle = 'You unlocked a new Rare Particle Trail!';
      } else {
        // coins refund
        nextStats.coins = (nextStats.coins || 0) + 500;
        subtitle = 'You already own all Rare Trails! Refunded 500 Coins.';
      }
    } else if (reward.type === 'mystery') {
      // Mystery reward randomly grants Skin, Theme, Trail, Particle or massive coins!
      const mysteryRoll = Math.random();
      if (mysteryRoll < 0.4) {
        nextStats.coins = (nextStats.coins || 0) + 500;
        subtitle = 'The Mystery chest opened to reveal +500 Coins!';
      } else if (mysteryRoll < 0.7) {
        // Unlock an Epic icon
        const icons = nextStats.unlockedIcons || ['icon_beginner'];
        const unownedIcons = ['icon_chronos', 'icon_ghost_core', 'icon_blaze', 'icon_frost'].filter(i => !icons.includes(i));
        if (unownedIcons.length > 0) {
          const wonIcon = unownedIcons[Math.floor(Math.random() * unownedIcons.length)];
          nextStats.unlockedIcons = [...icons, wonIcon];
          cosmeticName = wonIcon;
          subtitle = 'The Mystery chest opened: Unlocked Epic Player Icon!';
        } else {
          nextStats.coins = (nextStats.coins || 0) + 500;
          subtitle = 'The Mystery chest granted 500 Coins.';
        }
      } else {
        // Unlock an Epic Particle Effect
        const particles = nextStats.unlockedParticles || ['part_spark'];
        const unownedParticles = ['part_ring', 'part_shockwave', 'part_magic_dust', 'part_fireflies'].filter(p => !particles.includes(p));
        if (unownedParticles.length > 0) {
          const wonPart = unownedParticles[Math.floor(Math.random() * unownedParticles.length)];
          nextStats.unlockedParticles = [...particles, wonPart];
          cosmeticName = wonPart;
          subtitle = 'The Mystery chest opened: Unlocked Epic Particle Effect!';
        } else {
          nextStats.coins = (nextStats.coins || 0) + 500;
          subtitle = 'The Mystery chest granted 500 Coins.';
        }
      }
    } else if (reward.type === 'legendary') {
      // High-end rare cosmetic or premium theme!
      const legendaryRoll = Math.random();
      if (legendaryRoll < 0.5) {
        // Legendary Skin
        const skins = nextStats.unlockedSkins || ['cube'];
        const unownedSkins = ['sphere', 'gem', 'star_cube', 'dragon', 'astronaut'].filter(s => !skins.includes(s));
        if (unownedSkins.length > 0) {
          const wonSkin = unownedSkins[Math.floor(Math.random() * unownedSkins.length)];
          nextStats.unlockedSkins = [...skins, wonSkin];
          cosmeticName = wonSkin;
          subtitle = 'LEGENDARY! You unlocked a highly exclusive Character Skin!';
        } else {
          nextStats.coins = (nextStats.coins || 0) + 1000;
          subtitle = 'You own all Legendary Skins! Refunded 1000 Coins.';
        }
      } else {
        // Legendary Theme
        const themes = nextStats.unlockedThemes || ['slate'];
        const unownedThemes = ['neon', 'royal', 'cyber', 'space_theme'].filter(t => !themes.includes(t));
        if (unownedThemes.length > 0) {
          const wonTheme = unownedThemes[Math.floor(Math.random() * unownedThemes.length)];
          nextStats.unlockedThemes = [...themes, wonTheme];
          cosmeticName = wonTheme;
          subtitle = 'LEGENDARY! You unlocked a Premium Game Theme!';
        } else {
          nextStats.coins = (nextStats.coins || 0) + 1000;
          subtitle = 'You own all Legendary Themes! Refunded 1000 Coins.';
        }
      }
    }

    onUpdateStats(nextStats);

    setRewardDetails({
      title,
      subtitle,
      icon: reward.type === 'coins' ? Coins : Sparkles,
      cosmeticName: cosmeticName ? cosmeticName.toUpperCase().replace('_', ' ') : undefined
    });
    setShowRewardPopup(true);
  };

  // Initial wheel rendering
  useEffect(() => {
    drawWheel();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 12;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(currentAngleRef.current);

    const numSegments = SPIN_REWARDS.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    // Draw slices
    for (let i = 0; i < numSegments; i++) {
      const reward = SPIN_REWARDS[i];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * anglePerSegment, (i + 1) * anglePerSegment);
      ctx.closePath();

      // Style slice
      ctx.fillStyle = reward.color;
      ctx.fill();

      // Border lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Add labels
      ctx.save();
      ctx.rotate(i * anglePerSegment + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      
      // Select appropriate font
      if (reward.type === 'legendary') {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px monospace';
      } else if (reward.type === 'mystery') {
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 10px monospace';
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 10px sans-serif';
      }

      ctx.fillText(reward.label, radius - 20, 0);
      ctx.restore();
    }

    ctx.restore();

    // Draw Outer Bezel Rim
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw flashing rim lights
    const lightsCount = 16;
    const lightAngle = (2 * Math.PI) / lightsCount;
    const flashIndex = Math.floor(Date.now() / 250) % 2;

    for (let j = 0; j < lightsCount; j++) {
      const theta = j * lightAngle;
      const lx = width / 2 + (radius - 2) * Math.cos(theta);
      const ly = height / 2 + (radius - 2) * Math.sin(theta);

      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, 2 * Math.PI);
      
      const isGlowing = (j % 2 === flashIndex);
      ctx.fillStyle = isGlowing ? '#facc15' : '#1e293b';
      ctx.shadowBlur = isGlowing ? 8 : 0;
      ctx.shadowColor = '#facc15';
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }

    // Draw Central Cap Pin
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pin core star or icon
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
  };

  // Live timer tick for draw update (rim lights flashing)
  useEffect(() => {
    let animId: any;
    const tick = () => {
      if (!isSpinning) {
        drawWheel();
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isSpinning]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none top-1/2 left-1/3" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center gap-5 text-center select-none z-10"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-xl transition-all cursor-pointer text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <div className="flex flex-col gap-1 items-center mt-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase flex items-center gap-1.5 animate-pulse">
            <Gift size={12} /> SPARK WHEEL OF FORTUNE
          </span>
          <h2 className="text-3xl font-display font-black text-white uppercase leading-none tracking-tight">
            LUCKY SPIN
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Spin the legendary wheel for amazing cosmetic treasures and coins!
          </p>
        </div>

        {/* The Animated Wheel Stage */}
        <div className="relative w-64 h-64 flex items-center justify-center my-2">
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          />

          {/* Top Pointer Indicator (12 o'clock) */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-7 flex justify-center items-start drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)] z-20 pointer-events-none">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="transform origin-top transition-transform">
              <path d="M12 28L0 4C0 4 5 0 12 0C19 0 24 4 24 4L12 28Z" fill="#facc15" />
              <path d="M12 22L4 5C4 5 8 2 12 2C16 2 20 5 20 5L12 22Z" fill="#fbbf24" />
            </svg>
          </div>
        </div>

        {/* Inventory & Control Bar */}
        <div className="w-full flex flex-col gap-3">
          {/* Quick status displays */}
          <div className="flex items-center justify-between bg-white/3 border border-white/5 px-4 py-2.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
                <Coins size={14} />
              </div>
              <div className="text-left">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-none">Coins</div>
                <div className="text-sm font-mono font-black text-white leading-none mt-1">{playerStats.coins}</div>
              </div>
            </div>
            
            <div className="h-6 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-500/10 rounded-lg text-teal-400">
                <Tv size={14} />
              </div>
              <div className="text-left">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-none">Extra Spins</div>
                <div className="text-sm font-mono font-black text-white leading-none mt-1">{extraSpins}</div>
              </div>
            </div>
          </div>

          {/* SPIN ACTION BUTTONS */}
          <div className="flex flex-col gap-2.5">
            {isCheckingTime ? (
              <div className="w-full py-4 bg-slate-800/50 border border-white/5 rounded-2xl text-slate-400 flex items-center justify-center gap-2 text-sm font-semibold">
                <RefreshCw size={14} className="animate-spin text-teal-400" />
                Validating Chronos Matrix...
              </div>
            ) : cooldownRemaining <= 0 ? (
              <motion.button
                id="btn_lucky_spin_free"
                onClick={handleStartSpin}
                disabled={isSpinning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 disabled:opacity-50 text-slate-950 font-display font-extrabold text-base rounded-2xl shadow-xl shadow-teal-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group"
              >
                <Gift size={18} fill="currentColor" className="animate-bounce" />
                SPIN FREE NOW!
                <span className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>
            ) : extraSpins > 0 ? (
              <motion.button
                id="btn_lucky_spin_extra"
                onClick={handleStartSpin}
                disabled={isSpinning}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-display font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap size={18} fill="currentColor" className="text-amber-300" />
                SPIN ({extraSpins} Extra Left)
              </motion.button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 bg-slate-800/80 border border-white/5 rounded-2xl text-slate-400 flex flex-col items-center justify-center leading-none gap-1 shadow-inner"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Free Spin Cooldown</span>
                <span className="text-base font-mono font-bold text-teal-400 mt-1">{formatCooldown(cooldownRemaining)}</span>
              </button>
            )}

            {/* Watch Ad for Extra Spin Option */}
            <motion.button
              id="btn_watch_ad_extra_spin"
              onClick={handleWatchAdForExtraSpin}
              disabled={isSpinning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-300 font-display font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30"
            >
              <Tv size={15} className="text-amber-400 animate-pulse" />
              Watch Ad for +1 Extra Spin!
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* PREMIUM CELEBRATION WIN POPUP */}
      <AnimatePresence>
        {showRewardPopup && rewardDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            {/* Ambient golden beams of light */}
            <div className="absolute w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            
            {/* Confetti canvas/visual particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              {Array(32).fill(null).map((_, idx) => {
                const colors = ['#facc15', '#38bdf8', '#fb7185', '#34d399', '#a78bfa'];
                const randColor = colors[idx % colors.length];
                const randDelay = idx * 0.1;
                return (
                  <motion.div
                    key={idx}
                    initial={{ y: -50, opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{
                      y: [0, 400],
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1, 0.8],
                      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
                    }}
                    transition={{
                      duration: 2.5 + Math.random() * 2,
                      repeat: Infinity,
                      delay: randDelay,
                      ease: 'easeOut'
                    }}
                    className="absolute w-3 h-3 rounded"
                    style={{
                      backgroundColor: randColor,
                      left: `${10 + Math.random() * 80}%`,
                      top: '15%'
                    }}
                  />
                );
              })}
            </div>

            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative z-10 select-none flex flex-col items-center gap-5"
            >
              {/* Spinning light beams behind the icon */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f59e0b_0%,_transparent_65%)] opacity-40 blur-md rounded-full scale-150"
                />
                
                {/* Visual Icon */}
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 relative z-10 border border-amber-300">
                  <rewardDetails.icon size={36} fill="currentColor" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-mono font-extrabold tracking-widest text-amber-400 uppercase animate-pulse">
                  REWARD GRANTED!
                </h3>
                <h2 className="text-2xl font-display font-bold text-white uppercase mt-1 leading-tight">
                  {wonReward?.label}
                </h2>
                
                {rewardDetails.cosmeticName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest animate-pulse">
                    ✨ UNLOCKED: {rewardDetails.cosmeticName}
                  </div>
                )}
                
                <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-[260px] mx-auto">
                  {rewardDetails.subtitle}
                </p>
              </div>

              <motion.button
                id="btn_collect_reward"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  audio.playClick();
                  setShowRewardPopup(false);
                }}
                className="w-full py-4 mt-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-black text-base rounded-2xl shadow-xl shadow-amber-500/10 border border-amber-400/20 transition-all cursor-pointer"
              >
                COLLECT REWARD
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
