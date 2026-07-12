/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';

export interface ColorConfig {
  hex: string;
  name: string;
  glow: string;
  padSymbol: string;
  gateSymbol: string;
}

export const COLORS: Record<GameColor, ColorConfig> = {
  red: {
    hex: '#ff3b30',
    name: 'Red',
    glow: 'rgba(255, 59, 48, 0.6)',
    padSymbol: '🟥',
    gateSymbol: '⛩️',
  },
  green: {
    hex: '#34c759',
    name: 'Green',
    glow: 'rgba(52, 199, 89, 0.6)',
    padSymbol: '🟩',
    gateSymbol: '⛩️',
  },
  blue: {
    hex: '#007aff',
    name: 'Blue',
    glow: 'rgba(0, 122, 255, 0.6)',
    padSymbol: '🟦',
    gateSymbol: '⛩️',
  },
  yellow: {
    hex: '#ffcc00',
    name: 'Yellow',
    glow: 'rgba(255, 204, 0, 0.6)',
    padSymbol: '🟨',
    gateSymbol: '⛩️',
  },
  purple: {
    hex: '#af52de',
    name: 'Purple',
    glow: 'rgba(175, 82, 222, 0.6)',
    padSymbol: '🟪',
    gateSymbol: '⛩️',
  },
  orange: {
    hex: '#ff9500',
    name: 'Orange',
    glow: 'rgba(255, 149, 0, 0.6)',
    padSymbol: '🟧',
    gateSymbol: '⛩️',
  },
};

export type CellType =
  | 'wall'         // #
  | 'floor'        // .
  | 'exit'         // E
  | 'red_gate'     // r
  | 'green_gate'   // g
  | 'blue_gate'    // b
  | 'yellow_gate'  // y
  | 'purple_gate'  // p
  | 'orange_gate'  // o
  | 'red_pad'      // R
  | 'green_pad'    // G
  | 'blue_pad'     // B
  | 'yellow_pad'   // Y
  | 'purple_pad'   // P
  | 'orange_pad'   // O
  | 'star'         // S (collectible star)
  | 'key'          // K (collectible key)
  | 'door'         // D (locked door, requires key)
  | 'spikes'       // X (spikes, hazard)
  | 'plate'        // P (pressure plate that toggles standard locked doors)
  | 'teleport_1'   // 1 (Teleporter A)
  | 'teleport_2'   // 2 (Teleporter B)
  | 'teleport_3'   // 3 (Teleporter C)
  | 'teleport_4';  // 4 (Teleporter D)

export interface Position {
  x: number;
  y: number;
}

export interface MovingObstacleConfig {
  id: string;
  path: Position[]; // List of grid coordinates it loops through
  speed: number;    // Grid units per second (e.g., 2)
  type: 'spike_ball' | 'laser' | 'patrol';
}

export interface Level {
  id: number;
  name: string;
  grid: string[][]; // Rows of characters representing the grid
  startPos: Position;
  startColor: GameColor;
  targetMoves: number; // For 3 stars
  targetTime: number;  // For 3 stars (seconds)
  description: string;
  obstacles?: MovingObstacleConfig[];
  teleportPairs?: Record<string, Position>; // Maps teleporter cell type to target Position
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestMoves: number;
  bestTime: number; // in seconds
  perfectRun: boolean; // completed under targets with 0 mistakes
}

export interface PlayerStats {
  totalStars: number;
  levelsCompleted: number;
  totalMoves: number;
  totalTime: number; // in seconds
  colorChanges: number;
  dailyStreak: number;
  lastDailyDate: string; // YYYY-MM-DD
  coins: number;
  xp: number;
  activeSkin: string;
  activeTrail: string;
  activeTheme: string;
  activeTile?: string;
  activeIcon?: string;
  activeParticle?: string;
  unlockedSkins: string[];
  unlockedTrails: string[];
  unlockedThemes: string[];
  unlockedTiles?: string[];
  unlockedIcons?: string[];
  unlockedParticles?: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  levelId: number | 'daily';
  moves: number;
  time: number;
  stars: number;
  date: string;
  isPlayer?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  progress: number;
  maxProgress: number;
}
