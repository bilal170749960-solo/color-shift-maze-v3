/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, User, Calendar, X, Star, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { audio } from '../audio';

interface LeaderboardProps {
  levelId: number | 'daily';
  levelName: string;
  targetMoves: number;
  targetTime: number;
  playerScore?: { moves: number; time: number; stars: number };
  onClose: () => void;
}

// Seed mock players
const MOCK_NAMES = [
  'AuraVibe',
  'ZenScribe',
  'GridMaster',
  'SpectralCube',
  'SolRider',
  'ChronosMaze',
  'NeonGlow',
  'ShiftSeeker',
  'QuantumSoma',
  'HelixWarp',
];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  levelId,
  levelName,
  targetMoves,
  targetTime,
  playerScore,
  onClose,
}) => {
  const [boardEntries, setBoardEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate deterministic leaderboard entries based on levelId
  useEffect(() => {
    const storageKey = `cs_maze_leaderboard_${levelId}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      setBoardEntries(JSON.parse(stored));
    } else {
      // Build 5 high quality deterministic mock scores around target metrics
      const seed = typeof levelId === 'number' ? levelId : 99;
      const entries: LeaderboardEntry[] = [];

      for (let i = 0; i < 5; i++) {
        // Calculate plausible metrics relative to target moves/time
        const index = (seed + i) % MOCK_NAMES.length;
        const name = MOCK_NAMES[index];

        // Rank 1 beats the target, other ranks are slightly above or around
        const factor = 0.75 + i * 0.12; // lower is better
        const moves = Math.max(Math.round(targetMoves * factor), 3);
        const time = Math.max(Math.round(targetTime * factor), 4);

        // Compute stars
        let stars = 1;
        if (moves <= targetMoves) stars++;
        if (time <= targetTime) stars++;

        entries.push({
          rank: i + 1,
          name,
          levelId,
          moves,
          time,
          stars,
          date: new Date(Date.now() - i * 86400000 - seed * 10000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(entries));
      setBoardEntries(entries);
    }
  }, [levelId, targetMoves, targetTime]);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerScore) return;

    audio.playClick();

    const newEntry: LeaderboardEntry = {
      rank: 99, // computed below
      name: playerName.trim().substring(0, 14),
      levelId,
      moves: playerScore.moves,
      time: playerScore.time,
      stars: playerScore.stars,
      date: 'Today',
      isPlayer: true,
    };

    // Combine and sort entries
    const updated = [...boardEntries, newEntry]
      .sort((a, b) => {
        // Primary: lower moves, Secondary: lower time
        if (a.moves !== b.moves) {
          return a.moves - b.moves;
        }
        return a.time - b.time;
      })
      // Slice top 6 and rebuild ranks
      .slice(0, 6)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));

    localStorage.setItem(`cs_maze_leaderboard_${levelId}`, JSON.stringify(updated));
    setBoardEntries(updated);
    setIsSubmitted(true);
    setPlayerName('');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md select-none">
      <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/3 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
              RECORDS & RANKS
            </span>
            <h3 className="text-md font-display font-bold text-white uppercase mt-0.5 max-w-[240px] truncate">
              {levelName}
            </h3>
          </div>
          <button
            id="btn_leaderboard_close"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Player score submission card */}
        {playerScore && !isSubmitted && (
          <div className="bg-blue-500/10 border-b border-blue-500/25 px-6 py-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-300 font-medium flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" /> Your Run Summary:
              </span>
              <div className="flex gap-0.5">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < playerScore.stars ? '#fbbf24' : 'transparent'}
                      className={i < playerScore.stars ? 'text-amber-400' : 'text-slate-600'}
                    />
                  ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div>
                <div className="text-xl font-mono font-bold text-white">{playerScore.moves}</div>
                <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wide">Total Moves</div>
              </div>
              <div>
                <div className="text-xl font-mono font-bold text-white">{playerScore.time}s</div>
                <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wide">Time Taken</div>
              </div>
            </div>

            <form onSubmit={handleSubmitScore} className="flex gap-2.5">
              <input
                id="input_player_name"
                required
                type="text"
                placeholder="Enter pilot name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none px-4 py-2 rounded-xl text-sm font-medium text-white font-sans"
              />
              <button
                id="btn_submit_score"
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-semibold text-white uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-95"
              >
                Submit Rank
              </button>
            </form>
          </div>
        )}

        {/* High Score List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2.5 bg-slate-950/20">
          {boardEntries.map((entry, idx) => {
            const isRank1 = entry.rank === 1;
            const isRank2 = entry.rank === 2;
            const isRank3 = entry.rank === 3;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  entry.isPlayer
                    ? 'bg-blue-500/15 border-blue-500/30 shadow-inner'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {/* Left rank badge & Name */}
                <div className="flex items-center gap-3">
                  {/* Rank Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      isRank1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : isRank2
                        ? 'bg-slate-300 text-slate-950 shadow-md shadow-slate-300/20'
                        : isRank3
                        ? 'bg-amber-750 text-white'
                        : 'bg-white/5 text-slate-300 border border-white/10'
                    }`}
                  >
                    {isRank1 ? <Medal size={14} /> : entry.rank}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {entry.name}{' '}
                      {entry.isPlayer && (
                        <span className="text-[9px] bg-blue-550/20 text-blue-300 px-1.5 py-0.5 rounded-full font-bold uppercase border border-blue-500/20">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                      <Calendar size={10} className="text-slate-400" /> {entry.date}
                    </div>
                  </div>
                </div>

                {/* Right Metrics (Moves & Time) */}
                <div className="flex items-center gap-4 text-right">
                  <div className="font-mono">
                    <div className="text-xs font-bold text-slate-200">{entry.moves}m</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Moves</div>
                  </div>
                  <div className="font-mono">
                    <div className="text-xs font-bold text-slate-200">{entry.time}s</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wide">Time</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
