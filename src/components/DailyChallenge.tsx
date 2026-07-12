/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Clock, Play, Award, HelpCircle, X, Sparkles, Star } from 'lucide-react';
import { PlayerStats, Level } from '../types';
import { generateDailyLevel } from '../levels';
import { audio } from '../audio';

interface DailyChallengeProps {
  onBack: () => void;
  playerStats: PlayerStats;
  onLaunchDailyLevel: (level: Level) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  onBack,
  playerStats,
  onLaunchDailyLevel,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [todayDateStr, setTodayDateStr] = useState('');

  // Calculate countdown to tomorrow (midnight UTC)
  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    setTodayDateStr(todayString);

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0); // Midnight UTC

      const diff = tomorrow.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const hrs = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

      setTimeLeft(`${hrs}:${mins}:${secs}`);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const handleLaunchChallenge = () => {
    audio.playClick();
    const dailyLevel = generateDailyLevel(todayDateStr);
    onLaunchDailyLevel(dailyLevel);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/45 backdrop-blur-md text-slate-100 select-none relative">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/3 backdrop-blur-md">
        <h2 className="text-xl font-display font-bold text-white flex items-center gap-1.5 uppercase select-none">
          <Flame size={18} fill="#ff9500" className="text-amber-550 animate-pulse" /> Daily Challenge
        </h2>
        <button
          id="btn_daily_back"
          onClick={() => {
            audio.playClick();
            onBack();
          }}
          className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-all select-none cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Daily Challenge Card Body */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between max-w-md mx-auto w-full select-none">
        
        {/* Animated Rifting Portal Card */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-purple-500/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center backdrop-blur-xl">
          {/* Radial light glow backdrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-inner shadow-amber-500/10 relative animate-pulse">
            <Flame size={32} fill="currentColor" />
          </div>

          <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
            The Daily Rift
          </h3>
          <p className="text-xs text-slate-300 font-mono tracking-widest mt-1 uppercase">
            Symmetric Random Matrix
          </p>

          <p className="text-sm text-slate-300 leading-relaxed mt-4 max-w-[280px]">
            Every single day, a completely new, mathematically solved spectrum maze is generated procedurally. Everyone gets the exact same layout!
          </p>

          {/* Quick Stats list (Streak, reward multiplier) */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-xl font-mono font-bold text-amber-450 flex items-center justify-center gap-1">
                {playerStats.dailyStreak} <Flame size={14} fill="currentColor" className="text-amber-500" />
              </div>
              <div className="text-[10px] text-slate-300 font-mono uppercase tracking-wide">Active Streak</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-mono font-bold text-blue-400 flex items-center justify-center gap-1">
                2x <Sparkles size={14} className="text-blue-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-300 font-mono uppercase tracking-wide">Star Multiplier</div>
            </div>
          </div>
        </div>

        {/* Countdown clock box */}
        <div className="my-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-slate-300 animate-pulse" />
            <div>
              <div className="text-xs font-semibold text-white">Next Rift Resets In</div>
              <div className="text-[10px] text-slate-400 font-mono">Updates at 00:00 UTC</div>
            </div>
          </div>
          <div className="text-lg font-mono font-bold text-slate-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
            {timeLeft}
          </div>
        </div>

        {/* Big Launch button */}
        <button
          id="btn_launch_daily"
          onClick={handleLaunchChallenge}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 active:scale-95 text-white font-display font-bold text-lg rounded-2xl shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 border border-amber-400/20 transition-all select-none cursor-pointer"
        >
          <Play size={20} fill="currentColor" /> ENTER DAILY RIFT
        </button>

      </div>
    </div>
  );
};
