/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Coins,
  Check,
  Palette,
  Sparkles,
  Trophy,
  Grid,
  Image as ImageIcon,
  Flame,
  Zap,
  Star,
  Award,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkle,
  Lock,
  Compass,
  PackageOpen,
  Boxes
} from 'lucide-react';
import { PlayerStats } from '../types';
import { audio } from '../audio';

interface CustomizerProps {
  playerStats: PlayerStats;
  onBack: () => void;
  onUpdateStats: (newStats: PlayerStats) => void;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  milestone?: string;
  milestoneNum?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'premium' | 'special';
}

const SKINS: CosmeticItem[] = [
  { id: 'cube', name: 'Classic Cube', description: 'Your trusty modular crystalline cube.', cost: 0, rarity: 'common' },
  { id: 'shadow', name: 'Shadow Cube', description: 'Infused with dark void energy.', cost: 500, rarity: 'common' },
  { id: 'robot', name: 'Robot Sentry', description: 'Metallic construct with laser eye.', cost: 500, rarity: 'common' },
  { id: 'knight', name: 'Iron Knight', description: 'Fortified steel-plated protective visor.', cost: 500, rarity: 'common' },
  { id: 'ghost_skin', name: 'Apparition', description: 'Semi-transparent poltergeist casing.', cost: 500, rarity: 'common' },
  
  { id: 'ninja', name: 'Shinobi Ninja', description: 'Stealth-cloaked high-speed shadow cube.', cost: 1200, rarity: 'rare' },
  { id: 'pirate', name: 'Corsair Pirate', description: 'Sea-weathered wooden hull with gold plate.', cost: 1200, rarity: 'rare' },
  { id: 'forest', name: 'Mossy Forest', description: 'Organic foliage and earthen wood roots.', cost: 1200, rarity: 'rare' },
  { id: 'ice', name: 'Glacier Frost', description: 'Sub-zero frozen crystalline core.', cost: 1200, rarity: 'rare' },
  { id: 'neon_skin', name: 'Grid Cyber', description: 'Vibrant neon outlines and synthetic wireframe.', cost: 1200, rarity: 'rare' },

  { id: 'cyber_eye', name: 'Sentinel Core', description: 'Futuristic AI eye keeping absolute focus.', cost: 2500, rarity: 'epic' },
  { id: 'samurai', name: 'Shogun Ronin', description: 'Traditional lacquered crimson armor plates.', cost: 2500, rarity: 'epic' },
  { id: 'wizard', name: 'Arcane Wizard', description: 'Runed sorcerer hat and mystical aura.', cost: 2500, rarity: 'epic' },
  { id: 'fire', name: 'Magma core', description: 'Molten volcanic matrix radiating heat.', cost: 2500, rarity: 'epic' },
  { id: 'steampunk', name: 'Brass Dynamo', description: 'Clicking brass gears and steam valves.', cost: 2500, rarity: 'epic' },

  { id: 'sphere', name: 'Luminous Orb', description: 'Smooth, light-bending orb of absolute energy.', cost: 5000, rarity: 'legendary', milestone: 'Clear 5 levels', milestoneNum: 5 },
  { id: 'gem', name: 'Prism Octa', description: 'Hovering geometrical crystal reflecting light.', cost: 5000, rarity: 'legendary', milestone: 'Clear 20 levels', milestoneNum: 20 },
  { id: 'star_cube', name: 'Cosmic Star', description: 'Infused with core energy of outer space.', cost: 5000, rarity: 'legendary' },
  { id: 'dragon', name: 'Drake Scales', description: 'Impenetrable obsidian dragon scales.', cost: 5000, rarity: 'legendary' },
  { id: 'astronaut', name: 'Apollo Visor', description: 'Pressurized spacer helmet visor.', cost: 5000, rarity: 'legendary' }
];

const TRAILS: CosmeticItem[] = [
  { id: 'default', name: 'Simple Trail', description: 'Standard particle stream.', cost: 0, rarity: 'common' },
  { id: 'smoke', name: 'Dense Smoke', description: 'Sooty grey smoke puff stream.', cost: 400, rarity: 'common' },
  { id: 'leaves', name: 'Autumn Leaves', description: 'Gently falling forest leaves.', cost: 400, rarity: 'common' },
  { id: 'snow', name: 'Blizzard Swirl', description: 'Subzero frosty snowflake trail.', cost: 400, rarity: 'common' },
  { id: 'cloud', name: 'Cumulus Drift', description: 'Soft fluffy white clouds.', cost: 400, rarity: 'common' },

  { id: 'fire_trail', name: 'Fire Trail', description: 'Hot burning flame sparks.', cost: 1000, rarity: 'rare' },
  { id: 'ice_trail', name: 'Ice Trail', description: 'Crystalline frozen sparks.', cost: 1000, rarity: 'rare' },
  { id: 'star_trail', name: 'Star Trail', description: 'Golden star trails.', cost: 1000, rarity: 'rare' },
  { id: 'pixel_trail', name: 'Pixel Trail', description: '8-bit retro gaming blocks.', cost: 1000, rarity: 'rare' },
  { id: 'hearts', name: 'Lover Hearts', description: 'Floating cute romantic heart trail.', cost: 1000, rarity: 'rare' },

  { id: 'electric', name: 'Volt Sparks', description: 'Charged blue electricity.', cost: 2200, rarity: 'epic' },
  { id: 'laser', name: 'Cyber Laser', description: 'Neon laser light beams.', cost: 2200, rarity: 'epic' },
  { id: 'magic', name: 'Sorcery Dust', description: 'Arcane magical violet trace.', cost: 2200, rarity: 'epic' },
  { id: 'comet', name: 'Cosmic Tail', description: 'Stellar space dust.', cost: 2200, rarity: 'epic' },
  { id: 'shadow_trail', name: 'Void Shadows', description: 'Dark wisps following behind.', cost: 2200, rarity: 'epic' },

  { id: 'ghost', name: 'Neon Ghost', description: 'Leaving a lingering trace of previous position.', cost: 4500, rarity: 'legendary', milestone: 'Clear 10 levels', milestoneNum: 10 },
  { id: 'sparkle', name: 'Golden Sparkles', description: 'Shine bright like stars in the matrix.', cost: 4500, rarity: 'legendary', milestone: 'Clear 25 levels', milestoneNum: 25 },
  { id: 'rainbow', name: 'Rainbow Stream', description: 'Spectrum colors flowing behind you.', cost: 4500, rarity: 'legendary' },
  { id: 'matrix', name: 'Code Rain', description: 'Shattered digital binary cascade.', cost: 4500, rarity: 'legendary' },
  { id: 'prism_trail', name: 'Prism Stream', description: 'Splitting color light waves.', cost: 4500, rarity: 'legendary' }
];

const THEMES: CosmeticItem[] = [
  { id: 'slate', name: 'Classic Slate', description: 'Space station control slate theme.', cost: 0, rarity: 'common' },
  { id: 'forest_theme', name: 'Earthen Forest', description: 'Warm organic green foliage vibes.', cost: 6000, rarity: 'special' },
  { id: 'desert_theme', name: 'Arid Desert', description: 'Sandy dunes and terracotta clay.', cost: 6000, rarity: 'special' },
  { id: 'snow_theme', name: 'Tundra Snow', description: 'Sub-zero whiteout glacier walls.', cost: 6000, rarity: 'special' },
  { id: 'ancient_theme', name: 'Ancient Temple', description: 'Mossy stone bricks of bygone ruins.', cost: 6000, rarity: 'special' },
  { id: 'night_theme', name: 'Midnight Shadows', description: 'Stealthy ultra-dark navy setup.', cost: 6000, rarity: 'special' },

  { id: 'neon', name: 'Prism Neon', description: 'Vibrant neon borders and extreme glow.', cost: 8000, rarity: 'premium', milestone: 'Clear 15 levels', milestoneNum: 15 },
  { id: 'royal', name: 'Midnight Castle', description: 'Gold and velvet brick patterns of royalty.', cost: 8000, rarity: 'premium', milestone: 'Clear 30 levels', milestoneNum: 30 },
  { id: 'cyber', name: 'Cyberpunk Grid', description: 'Retro futuristic grid of bright cyan and magenta.', cost: 8000, rarity: 'premium' },
  { id: 'space_theme', name: 'Deep Space', description: 'Deep cosmic violet and nebula dust.', cost: 8000, rarity: 'premium' }
];

const TILES: CosmeticItem[] = [
  { id: 'tile_standard', name: 'Standard Plate', description: 'Classic industrial flooring tiles.', cost: 0, rarity: 'common' },
  { id: 'tile_grid', name: 'Wired Grid', description: 'Futuristic gridline cell design.', cost: 800, rarity: 'common' },
  { id: 'tile_diamond', name: 'Diamond Stud', description: 'Heavy-duty steel plate studs.', cost: 1200, rarity: 'rare' },
  { id: 'tile_tech', name: 'Circuit Plate', description: 'Microchip pathway lines.', cost: 1600, rarity: 'rare' },
  { id: 'tile_brick', name: 'Stone Cobble', description: 'Rustic cobblestone brickwork.', cost: 2000, rarity: 'rare' },
  { id: 'tile_hologram', name: 'Holo Shimmer', description: 'Prismatic light-deflecting material.', cost: 2500, rarity: 'epic' },
  { id: 'tile_runes', name: 'Elder Runes', description: 'Chiseled magic glyphs glowing slowly.', cost: 3000, rarity: 'epic' },
  { id: 'tile_honeycomb', name: 'Honeycomb Hex', description: 'Bio-tech hexagon floor structures.', cost: 3500, rarity: 'epic' },
  { id: 'tile_crystal', name: 'Obsidian Slab', description: 'Gleaming dark volcanic glass tiles.', cost: 4000, rarity: 'legendary' },
  { id: 'tile_royal', name: 'Imperial Gold', description: 'Opulent gold-leaf mosaic designs.', cost: 4500, rarity: 'legendary' }
];

const ICONS: CosmeticItem[] = [
  { id: 'icon_beginner', name: 'Apprentice Badge', description: 'Starter symbol of your puzzle journey.', cost: 0, rarity: 'common' },
  { id: 'icon_challenger', name: 'Adept Medal', description: 'A recognized color shifting mind.', cost: 300, rarity: 'common' },
  { id: 'icon_runner', name: 'Runner Emblem', description: 'For those who never hesitate.', cost: 500, rarity: 'common' },
  { id: 'icon_speedster', name: 'Chronos Gear', description: 'Tuned to complete stages fast.', cost: 700, rarity: 'common' },
  { id: 'icon_eye', name: 'Cyber Eye', description: 'All-seeing synthetic gaze.', cost: 900, rarity: 'rare' },
  { id: 'icon_star_collector', name: 'Cosmos Crest', description: 'A seeker of forgotten matrix stars.', cost: 1100, rarity: 'rare' },
  { id: 'icon_key_master', name: 'Keymaster Seal', description: 'Breaker of ancient vault doors.', cost: 1300, rarity: 'rare' },
  { id: 'icon_spectrum', name: 'Spectral Crest', description: 'Balanced in all wavelengths.', cost: 1500, rarity: 'rare' },
  { id: 'icon_chronos', name: 'Hourglass Rune', description: 'Master of temporal sequences.', cost: 1700, rarity: 'epic' },
  { id: 'icon_ghost_core', name: 'Phantasm Rune', description: 'Ethereal specter glyph.', cost: 1900, rarity: 'epic' },
  { id: 'icon_blaze', name: 'Blazing Star', description: 'High-intensity heat emission.', cost: 2100, rarity: 'epic' },
  { id: 'icon_frost', name: 'Ice Sigil', description: 'Absolute zero absolute focus.', cost: 2300, rarity: 'epic' },
  { id: 'icon_void', name: 'Void Sigil', description: 'From the deepest space void.', cost: 2500, rarity: 'legendary' },
  { id: 'icon_phoenix', name: 'Phoenix Seal', description: 'Eternal rebirth and resilience.', cost: 3000, rarity: 'legendary' },
  { id: 'icon_creator', name: 'Architect Seal', description: 'Supreme solver of spectrum mazes.', cost: 4000, rarity: 'legendary' }
];

const PARTICLES: CosmeticItem[] = [
  { id: 'part_spark', name: 'Standard Spark', description: 'Simple light energy particles.', cost: 0, rarity: 'common' },
  { id: 'part_bubble', name: 'Bubbly Suds', description: 'Lightweight fluid air bubbles.', cost: 1500, rarity: 'common' },
  { id: 'part_ember', name: 'Molten Ember', description: 'Flickering volcanic embers.', cost: 1800, rarity: 'common' },
  { id: 'part_dust', name: 'Earthen Dust', description: 'Swirling ancient desert dust.', cost: 2000, rarity: 'rare' },
  { id: 'part_digital', name: 'Grid Pixels', description: 'Fading digital hologram particles.', cost: 2200, rarity: 'rare' },
  { id: 'part_petals', name: 'Cherry Blossoms', description: 'Falling organic pink sakura petals.', cost: 2500, rarity: 'rare' },
  { id: 'part_snowflakes', name: 'Frost Dust', description: 'Falling winter frost sparkles.', cost: 2850, rarity: 'rare' },
  { id: 'part_ring', name: 'Quantum Rings', description: 'Expansive micro gravity rings.', cost: 3000, rarity: 'epic' },
  { id: 'part_shockwave', name: 'Sonic Ripple', description: 'Subtle soundwave visual ripples.', cost: 3000, rarity: 'epic' },
  { id: 'part_magic_dust', name: 'Cosmic Pixie', description: 'Twinkling magical purple pixie dust.', cost: 3000, rarity: 'epic' },
  { id: 'part_fireflies', name: 'Fireflies Glow', description: 'Glow-in-the-dark firefly insects.', cost: 3000, rarity: 'epic' },
  { id: 'part_golden', name: 'Golden Shower', description: 'Shimmering cascades of pure gold.', cost: 4000, rarity: 'legendary' },
  { id: 'part_grid', name: 'Cyber Gridlines', description: 'Glow pathways along borders.', cost: 4200, rarity: 'legendary' },
  { id: 'part_cosmic', name: 'Nebula Gas', description: 'Swirling colorful interstellar gas.', cost: 4500, rarity: 'legendary' },
  { id: 'part_supernova', name: 'Cosmic Nova', description: 'Stellar flash explosive fragments.', cost: 5000, rarity: 'legendary' }
];

type CustomizerTab = 'skins' | 'trails' | 'themes' | 'tiles' | 'icons' | 'particles';

export const Customizer: React.FC<CustomizerProps> = ({
  playerStats,
  onBack,
  onUpdateStats,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('skins');
  const [showConfetti, setShowConfetti] = useState<string | null>(null);

  // Search & sorting controls
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rarity' | 'status'>('default');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  // Preview Drawer details
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Derive level and XP
  const xp = playerStats.xp || 0;
  const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  const levelXpProgress = xp - currentLevelBaseXp;
  const xpRequiredForNext = nextLevelXp - currentLevelBaseXp;
  const xpPercentage = Math.min(100, Math.max(0, (levelXpProgress / xpRequiredForNext) * 100));

  const coins = playerStats.coins || 0;
  const unlockedSkins = playerStats.unlockedSkins || ['cube'];
  const unlockedTrails = playerStats.unlockedTrails || ['default'];
  const unlockedThemes = playerStats.unlockedThemes || ['slate'];
  const unlockedTiles = playerStats.unlockedTiles || ['tile_standard'];
  const unlockedIcons = playerStats.unlockedIcons || ['icon_beginner'];
  const unlockedParticles = playerStats.unlockedParticles || ['part_spark'];

  const getActiveList = () => {
    switch (activeTab) {
      case 'skins':
        return { items: SKINS, unlocked: unlockedSkins, active: playerStats.activeSkin || 'cube', type: 'skin' as const };
      case 'trails':
        return { items: TRAILS, unlocked: unlockedTrails, active: playerStats.activeTrail || 'default', type: 'trail' as const };
      case 'themes':
        return { items: THEMES, unlocked: unlockedThemes, active: playerStats.activeTheme || 'slate', type: 'theme' as const };
      case 'tiles':
        return { items: TILES, unlocked: unlockedTiles, active: playerStats.activeTile || 'tile_standard', type: 'tile' as const };
      case 'icons':
        return { items: ICONS, unlocked: unlockedIcons, active: playerStats.activeIcon || 'icon_beginner', type: 'icon' as const };
      case 'particles':
        return { items: PARTICLES, unlocked: unlockedParticles, active: playerStats.activeParticle || 'part_spark', type: 'particle' as const };
    }
  };

  const { items, unlocked, active, type } = getActiveList();

  // Filter and sort items dynamically
  const processedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || item.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.cost - a.cost);
    } else if (sortBy === 'rarity') {
      const rank = { common: 1, rare: 2, epic: 3, legendary: 4, premium: 5, special: 5 };
      filtered.sort((a, b) => (rank[b.rarity] || 0) - (rank[a.rarity] || 0));
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => {
        const aEquipped = active === a.id;
        const bEquipped = active === b.id;
        if (aEquipped && !bEquipped) return -1;
        if (bEquipped && !aEquipped) return 1;

        const aUnlocked = unlocked.includes(a.id) || (a.milestoneNum && playerStats.levelsCompleted >= a.milestoneNum);
        const bUnlocked = unlocked.includes(b.id) || (b.milestoneNum && playerStats.levelsCompleted >= b.milestoneNum);
        if (aUnlocked && !bUnlocked) return -1;
        if (bUnlocked && !aUnlocked) return 1;

        return 0;
      });
    }

    return filtered;
  }, [items, searchQuery, rarityFilter, sortBy, active, unlocked, playerStats.levelsCompleted]);

  // Handle selected item fallback when tab shifts
  const selectedItem = useMemo(() => {
    if (selectedItemId) {
      const item = items.find((i) => i.id === selectedItemId);
      if (item) return item;
    }
    // Default to equipped or first item
    const equippedItem = items.find((i) => i.id === active);
    return equippedItem || items[0];
  }, [items, selectedItemId, active]);

  const handlePurchase = (id: string, cost: number) => {
    if (coins < cost) {
      audio.playBlocked();
      return;
    }
    audio.playUnlock();
    const nextStats = { ...playerStats };
    nextStats.coins = coins - cost;

    switch (activeTab) {
      case 'skins':
        nextStats.unlockedSkins = [...unlockedSkins, id];
        break;
      case 'trails':
        nextStats.unlockedTrails = [...unlockedTrails, id];
        break;
      case 'themes':
        nextStats.unlockedThemes = [...unlockedThemes, id];
        break;
      case 'tiles':
        nextStats.unlockedTiles = [...unlockedTiles, id];
        break;
      case 'icons':
        nextStats.unlockedIcons = [...unlockedIcons, id];
        break;
      case 'particles':
        nextStats.unlockedParticles = [...unlockedParticles, id];
        break;
    }

    onUpdateStats(nextStats);
    setShowConfetti(id);
    setTimeout(() => setShowConfetti(null), 2000);
  };

  const handleEquip = (id: string) => {
    audio.playClick();
    const nextStats = { ...playerStats };

    switch (activeTab) {
      case 'skins':
        nextStats.activeSkin = id;
        break;
      case 'trails':
        nextStats.activeTrail = id;
        break;
      case 'themes':
        nextStats.activeTheme = id;
        break;
      case 'tiles':
        nextStats.activeTile = id;
        break;
      case 'icons':
        nextStats.activeIcon = id;
        break;
      case 'particles':
        nextStats.activeParticle = id;
        break;
    }

    onUpdateStats(nextStats);
  };

  // Theme or color class resolver based on rarity
  const getRarityStyles = (rarity: CosmeticItem['rarity']) => {
    switch (rarity) {
      case 'common':
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          text: 'text-slate-400',
          badge: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
          glow: 'group-hover:shadow-slate-500/10'
        };
      case 'rare':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          glow: 'group-hover:shadow-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.1)]'
        };
      case 'epic':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          glow: 'group-hover:shadow-purple-500/15 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
        };
      case 'legendary':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold',
          glow: 'group-hover:shadow-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
        };
      case 'premium':
        return {
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          text: 'text-pink-400',
          badge: 'bg-gradient-to-r from-red-500/20 to-blue-500/20 text-pink-300 border border-pink-500/30 animate-pulse font-extrabold',
          glow: 'group-hover:shadow-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.25)]'
        };
      case 'special':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold',
          glow: 'group-hover:shadow-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
        };
    }
  };

  // Render high-fidelity large item visual for the cabinet preview (upgraded scaling engine)
  const renderItemVisual = (itemId: string, itemType: string, isLarge: boolean = false) => {
    const sizeClass = isLarge ? 'w-32 h-32' : 'w-14 h-14';
    const innerCubeClass = isLarge ? 'w-16 h-16' : 'w-7 h-7';

    return (
      <div className={`${sizeClass} rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner shadow-black/40`}>
        {itemType === 'skin' && (
          <div className={`${isLarge ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
            {itemId === 'cube' && <div className={`${innerCubeClass} bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg shadow-md`} />}
            {itemId === 'shadow' && <div className={`${innerCubeClass} bg-slate-800 border border-slate-700 rounded-lg shadow-md shadow-black`} />}
            {itemId === 'robot' && (
              <div className={`${innerCubeClass} bg-slate-500 rounded-lg flex items-center justify-center border border-slate-400`}>
                <div className={`${isLarge ? 'w-5 h-5' : 'w-2.5 h-2.5'} bg-red-500 rounded-full animate-pulse`} />
              </div>
            )}
            {itemId === 'knight' && (
              <div className={`${innerCubeClass} bg-zinc-400 rounded-lg flex flex-col justify-between p-1 border border-zinc-300`}>
                <div className={`w-full ${isLarge ? 'h-4' : 'h-2'} bg-zinc-900 rounded-sm`} />
              </div>
            )}
            {itemId === 'ghost_skin' && <div className={`${innerCubeClass} bg-indigo-400/40 rounded-lg border border-indigo-300/40 animate-pulse`} />}
            {itemId === 'ninja' && <div className={`${innerCubeClass} bg-slate-950 rounded-lg border-t-4 border-red-600`} />}
            {itemId === 'pirate' && (
              <div className={`${innerCubeClass} bg-amber-800 rounded-lg flex items-center justify-center shadow-md relative`}>
                <div className={`${isLarge ? 'w-6 h-6' : 'w-3 h-3'} bg-amber-950 rounded-full`} />
                <div className={`absolute ${isLarge ? 'top-1.5 right-1.5 text-xs' : 'top-0.5 right-0.5 text-[8px]'}`}>🏴‍☠️</div>
              </div>
            )}
            {itemId === 'forest' && <div className={`${innerCubeClass} bg-emerald-700 rounded-lg border border-emerald-600`} />}
            {itemId === 'ice' && <div className={`${innerCubeClass} bg-cyan-200 rounded-lg border border-cyan-400 animate-pulse`} />}
            {itemId === 'neon_skin' && <div className={`${innerCubeClass} bg-slate-900 border-2 border-cyan-400 rounded-lg`} />}
            {itemId === 'cyber_eye' && (
              <div className={`${innerCubeClass} border-2 border-teal-400 rounded-full flex items-center justify-center animate-pulse`}>
                <div className={`${isLarge ? 'w-8 h-8' : 'w-4 h-4'} bg-cyan-400 rounded-full`} />
              </div>
            )}
            {itemId === 'samurai' && <div className={`${innerCubeClass} bg-red-700 border-2 border-amber-500 rounded-sm`} />}
            {itemId === 'wizard' && (
              <div className={`${isLarge ? 'w-20 h-20' : 'w-10 h-10'} bg-purple-700 transform rotate-45 flex items-center justify-center rounded`}>
                <div className={`${isLarge ? 'w-6 h-6' : 'w-3.5 h-3.5'} bg-yellow-400 rounded-full`} />
              </div>
            )}
            {itemId === 'fire' && <div className={`${innerCubeClass} bg-gradient-to-tr from-red-600 to-yellow-500 rounded-lg animate-pulse`} />}
            {itemId === 'steampunk' && <div className={`${innerCubeClass} bg-amber-700 border-2 border-yellow-600 rounded-lg`} />}
            {itemId === 'sphere' && <div className={`${innerCubeClass} bg-gradient-to-tr from-red-500 to-amber-500 rounded-full shadow-lg shadow-red-500/40 animate-bounce`} />}
            {itemId === 'gem' && (
              <div className={`${isLarge ? 'w-16 h-16' : 'w-7 h-7'} bg-gradient-to-tr from-emerald-400 to-cyan-500 transform rotate-45 rounded-sm animate-spin [animation-duration:4s]`} />
            )}
            {itemId === 'star_cube' && (
              <div className={`${innerCubeClass} bg-amber-400 rounded-lg shadow-md flex items-center justify-center`}>
                <Star size={isLarge ? 32 : 16} className="text-slate-950 fill-current animate-pulse" />
              </div>
            )}
            {itemId === 'dragon' && <div className={`${innerCubeClass} bg-emerald-950 border border-emerald-500 rounded-lg`} />}
            {itemId === 'astronaut' && <div className={`${innerCubeClass} bg-slate-300 border border-blue-500 rounded-full`} />}
          </div>
        )}

        {itemType === 'trail' && (
          <div className="flex flex-col items-center gap-1.5">
            {itemId === 'default' && (
              <div className="flex gap-1.5">
                <div className={`${isLarge ? 'w-6 h-6' : 'w-3 h-3'} bg-blue-500/80 rounded-full`} />
                <div className={`${isLarge ? 'w-5 h-5' : 'w-2.5 h-2.5'} bg-blue-500/50 rounded-full animate-ping`} />
              </div>
            )}
            {itemId === 'smoke' && (
              <div className="flex gap-1">
                <div className={`${isLarge ? 'w-6 h-6' : 'w-3 h-3'} bg-slate-500 rounded-full`} />
                <div className={`${isLarge ? 'w-4 h-4' : 'w-2 h-2'} bg-slate-400 rounded-full`} />
              </div>
            )}
            {itemId === 'leaves' && <div className={`${isLarge ? 'text-5xl animate-bounce' : 'text-xl'}`}>🍁</div>}
            {itemId === 'snow' && <div className={`${isLarge ? 'text-5xl' : 'text-xl'} text-cyan-200 animate-pulse`}>❄️</div>}
            {itemId === 'cloud' && <div className={`${isLarge ? 'text-5xl' : 'text-xl'} text-white`}>☁️</div>}
            {itemId === 'fire_trail' && <div className={`${isLarge ? 'text-5xl animate-pulse' : 'text-xl'} text-orange-500`}>🔥</div>}
            {itemId === 'ice_trail' && <div className={`${isLarge ? 'text-5xl animate-pulse' : 'text-xl'} text-cyan-300`}>🧊</div>}
            {itemId === 'star_trail' && <Star size={isLarge ? 44 : 20} fill="currentColor" className="text-amber-400 animate-pulse" />}
            {itemId === 'pixel_trail' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-red-500`} />}
            {itemId === 'hearts' && <div className={`${isLarge ? 'text-5xl animate-bounce' : 'text-xl'} text-red-500`}>❤️</div>}
            {itemId === 'electric' && <Zap size={isLarge ? 40 : 20} fill="currentColor" className="text-yellow-400 animate-bounce" />}
            {itemId === 'laser' && <div className={`${isLarge ? 'w-28 h-3 shadow-[0_0_15px_cyan]' : 'w-10 h-1 shadow-[0_0_8px_cyan]'} bg-cyan-400`} />}
            {itemId === 'magic' && <Sparkles size={isLarge ? 40 : 20} className="text-purple-400 animate-pulse" />}
            {itemId === 'comet' && <div className={`${isLarge ? 'w-16 h-16' : 'w-7 h-7'} bg-gradient-to-r from-blue-400 to-transparent rounded-full`} />}
            {itemId === 'shadow_trail' && <div className={`${isLarge ? 'w-16 h-16' : 'w-7 h-7'} bg-black/60 rounded-full filter blur-xs`} />}
            {itemId === 'ghost' && (
              <div className="flex gap-1.5">
                <div className={`${isLarge ? 'w-6 h-6' : 'w-3 h-3'} bg-purple-500/80 rounded-sm`} />
                <div className={`${isLarge ? 'w-4 h-4' : 'w-2 h-2'} bg-purple-500/30 rounded-sm animate-pulse`} />
              </div>
            )}
            {itemId === 'sparkle' && <Sparkles size={isLarge ? 44 : 20} className="text-amber-400 animate-spin [animation-duration:10s]" />}
            {itemId === 'rainbow' && <div className={`${isLarge ? 'w-20 h-6' : 'w-8 h-2.5'} bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full animate-pulse`} />}
            {itemId === 'matrix' && <span className={`font-mono ${isLarge ? 'text-lg' : 'text-[10px]'} text-green-400 font-bold animate-pulse`}>10101</span>}
            {itemId === 'prism_trail' && <div className={`${isLarge ? 'w-20 h-6' : 'w-8 h-2.5'} bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-300 rounded-full`} />}
          </div>
        )}

        {itemType === 'theme' && (
          <div className="w-full h-full flex items-center justify-center">
            {itemId === 'slate' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-slate-800 border border-slate-700 rounded`} />}
            {itemId === 'forest_theme' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-emerald-900 border border-emerald-700 rounded`} />}
            {itemId === 'desert_theme' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-amber-800 border border-amber-600 rounded`} />}
            {itemId === 'snow_theme' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-slate-100 border border-slate-300 rounded`} />}
            {itemId === 'ancient_theme' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-zinc-700 border border-zinc-500 rounded`} />}
            {itemId === 'night_theme' && <div className={`${isLarge ? 'w-20 h-20' : 'w-8 h-8'} bg-[#020617] border border-[#1e293b] rounded`} />}
            {itemId === 'neon' && <div className={`${isLarge ? 'w-20 h-20 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'w-8 h-8 shadow-[0_0_8px_rgba(34,211,238,0.3)]'} bg-black border border-cyan-400 rounded`} />}
            {itemId === 'royal' && <div className={`${isLarge ? 'w-20 h-20 text-3xl' : 'w-8 h-8 text-sm'} bg-slate-900 border border-amber-500 rounded flex items-center justify-center text-amber-500 font-bold`}>W</div>}
            {itemId === 'cyber' && <div className={`${isLarge ? 'w-20 h-20 text-3xl' : 'w-8 h-8 text-sm'} bg-slate-950 border border-pink-500 rounded flex items-center justify-center text-pink-400`}>#</div>}
            {itemId === 'space_theme' && <div className={`${isLarge ? 'w-20 h-20 text-3xl' : 'w-8 h-8 text-sm'} bg-slate-950 border border-indigo-500 rounded flex items-center justify-center text-indigo-400`}>★</div>}
          </div>
        )}

        {itemType === 'tile' && (
          <div className={`${isLarge ? 'w-24 h-24' : 'w-9 h-9'} border border-white/20 bg-slate-800/80 rounded flex items-center justify-center relative overflow-hidden`}>
            {itemId === 'tile_standard' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-slate-700 border border-slate-600 rounded-sm`} />}
            {itemId === 'tile_grid' && <div className="w-full h-full border border-teal-500/30 grid grid-cols-2 grid-rows-2"><div className="border border-white/5" /><div className="border border-white/5" /><div className="border border-white/5" /><div className="border border-white/5" /></div>}
            {itemId === 'tile_diamond' && <div className={`${isLarge ? 'w-16 h-16' : 'w-5 h-5'} bg-slate-600 transform rotate-45 border border-slate-500`} />}
            {itemId === 'tile_tech' && <div className="w-full h-full p-1.5 flex flex-col justify-between"><div className={`w-full ${isLarge ? 'h-5' : 'h-2'} bg-cyan-500/60`} /><div className={`w-full ${isLarge ? 'h-5' : 'h-2'} bg-cyan-500/30`} /></div>}
            {itemId === 'tile_brick' && <div className="w-full h-full flex flex-col gap-1 p-1"><div className="h-full bg-orange-800/80 rounded" /><div className="h-full bg-orange-800/80 rounded" /></div>}
            {itemId === 'tile_hologram' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded animate-pulse`} />}
            {itemId === 'tile_runes' && <span className={`font-serif ${isLarge ? 'text-4xl' : 'text-sm'} text-purple-400`}>⌘</span>}
            {itemId === 'tile_honeycomb' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-amber-500/30 border border-amber-500 rounded`} />}
            {itemId === 'tile_crystal' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-indigo-950 border border-indigo-400 rounded shadow-md`} />}
            {itemId === 'tile_royal' && <div className={`${isLarge ? 'w-16 h-16' : 'w-6 h-6'} bg-gradient-to-tr from-amber-400 to-yellow-600 border border-yellow-300 rounded`} />}
          </div>
        )}

        {itemType === 'icon' && (
          <div className={`${isLarge ? 'w-24 h-24 text-4xl' : 'w-9 h-9 text-sm'} rounded-full border border-white/20 bg-slate-950/90 flex items-center justify-center font-display font-black text-teal-400 shadow-md`}>
            {itemId === 'icon_beginner' && <Award size={isLarge ? 48 : 16} className="text-slate-400" />}
            {itemId === 'icon_challenger' && <Award size={isLarge ? 48 : 16} className="text-yellow-500" />}
            {itemId === 'icon_runner' && <Zap size={isLarge ? 48 : 16} className="text-blue-400" />}
            {itemId === 'icon_speedster' && <Flame size={isLarge ? 48 : 16} className="text-orange-500" />}
            {itemId === 'icon_eye' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>👁️</span>}
            {itemId === 'icon_star_collector' && <Star size={isLarge ? 48 : 16} fill="currentColor" className="text-amber-400" />}
            {itemId === 'icon_key_master' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>🔑</span>}
            {itemId === 'icon_spectrum' && <Palette size={isLarge ? 48 : 16} className="text-pink-400" />}
            {itemId === 'icon_chronos' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>⏳</span>}
            {itemId === 'icon_ghost_core' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>👻</span>}
            {itemId === 'icon_blaze' && <Flame size={isLarge ? 48 : 16} fill="currentColor" className="text-red-500" />}
            {itemId === 'icon_frost' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>❄️</span>}
            {itemId === 'icon_void' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>🌌</span>}
            {itemId === 'icon_phoenix' && <span className={`${isLarge ? 'text-5xl' : 'text-[11px]'}`}>🔥</span>}
            {itemId === 'icon_creator' && <Trophy size={isLarge ? 48 : 16} className="text-amber-400 animate-bounce" />}
          </div>
        )}

        {itemType === 'particle' && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`${isLarge ? 'w-16 h-16' : 'w-4 h-4'} bg-teal-400 rounded-full animate-ping absolute`} />
            <Sparkles size={isLarge ? 56 : 18} className="text-teal-300 animate-spin" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col relative select-none">
      {/* Visual background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION (Top Bar) */}
      <header className="w-full bg-slate-900/80 border-b border-white/10 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onBack();
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl transition-all cursor-pointer text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex flex-col">
            <div className="text-[9px] font-mono font-bold tracking-widest text-teal-400 uppercase flex items-center gap-1">
              <Boxes size={10} /> SPECTRUM VAULT
            </div>
            <h1 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none mt-0.5">
              PREMIUM SHOP
            </h1>
          </div>
        </div>

        {/* Level XP Progress Indicator */}
        <div className="hidden sm:flex flex-col gap-1 items-end max-w-[160px] mr-4 text-right">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase">
            <Trophy size={11} className="text-amber-400" />
            <span>Lvl {currentLevel}</span>
            <span className="text-white/40">•</span>
            <span>{playerStats.levelsCompleted} cleared</span>
          </div>
          <div className="w-32 bg-slate-950 rounded-full h-1.5 border border-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-full rounded-full"
            />
          </div>
        </div>

        {/* Coin inventory indicator */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl shadow-lg">
          <div className="w-5 h-5 bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 rounded-full flex items-center justify-center shadow-md animate-spin [animation-duration:12s]">
            <Coins size={12} fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider">BALANCE</span>
            <span className="text-sm font-mono font-black text-white mt-0.5">{coins}</span>
          </div>
        </div>
      </header>

      {/* FILTER, SEARCH, & TAB CONTROL DECK */}
      <div className="w-full bg-slate-900/40 border-b border-white/5 p-4 flex flex-col gap-3 z-20">
        
        {/* Dynamic Category Tabs Selector */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1.5">
          {([
            { id: 'skins', label: 'Characters', icon: Boxes },
            { id: 'trails', label: 'Trails', icon: Zap },
            { id: 'themes', label: 'Themes', icon: Palette },
            { id: 'tiles', label: 'Tile Designs', icon: Grid },
            { id: 'icons', label: 'User Icons', icon: Award },
            { id: 'particles', label: 'Particles', icon: Sparkles }
          ] as const).map((tab) => {
            const IconComponent = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audio.playClick();
                  setActiveTab(tab.id);
                  setSelectedItemId(null); // Clear selected item in new tab
                }}
                className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all rounded-xl relative shrink-0 flex items-center gap-1.5 cursor-pointer select-none border ${
                  isTabActive
                    ? 'text-teal-300 font-black bg-white/5 border-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/3 border-transparent'
                }`}
              >
                <IconComponent size={13} className={isTabActive ? 'text-teal-400' : 'text-slate-500'} />
                {tab.label}
                {isTabActive && (
                  <motion.div
                    layoutId="shopTabUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input, Sort, and Rarity Filter selectors */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search store items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 text-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Rarity filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="w-full sm:w-36 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-teal-500/50 appearance-none cursor-pointer"
              >
                <option value="all">🛡️ All Rarities</option>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
                <option value="premium">Premium</option>
                <option value="special">Special</option>
              </select>
            </div>

            {/* Sorter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-36 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-teal-500/50 appearance-none cursor-pointer"
              >
                <option value="default">↕ Sort Store</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rarity">By Rarity Tier</option>
                <option value="status">Equipped / Owned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CORE STOREFRONT GRID & LIVE CABINET (Split layout on desktop) */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        
        {/* Left Side: Scrollable Store Grid of Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 select-none">
          {processedItems.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
              <PackageOpen size={36} className="text-slate-600 animate-pulse" />
              <div className="text-sm font-bold uppercase tracking-wide">No items found matching filters</div>
              <p className="text-[11px] max-w-xs text-center leading-relaxed">
                Try modifying your search text, rarity filters or active tab to find more items!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 max-w-7xl mx-auto w-full pb-8">
              {processedItems.map((item) => {
                const isUnlocked = unlocked.includes(item.id);
                const isActive = active === item.id;
                const meetsMilestone = item.milestoneNum ? playerStats.levelsCompleted >= item.milestoneNum : true;
                const actualUnlocked = isUnlocked || meetsMilestone;
                const styles = getRarityStyles(item.rarity);
                const isItemSelect = selectedItem.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    id={`shop_item_card_${item.id}`}
                    onClick={() => {
                      audio.playClick();
                      setSelectedItemId(item.id);
                      setIsMobilePreviewOpen(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group cursor-pointer p-3 rounded-2xl border flex flex-col justify-between gap-3 relative transition-all min-h-[175px] ${
                      isActive
                        ? 'border-teal-400 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.15)] z-10'
                        : isItemSelect
                        ? 'border-indigo-400 bg-indigo-500/5 shadow-md shadow-indigo-500/5'
                        : actualUnlocked
                        ? 'border-white/10 bg-slate-900/60 hover:bg-slate-900/90'
                        : 'border-white/5 bg-slate-950/40 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Confetti celebrate overlay */}
                    {showConfetti === item.id && (
                      <div className="absolute inset-0 z-10 bg-teal-500/20 flex items-center justify-center rounded-2xl">
                        <Sparkles className="text-teal-400 w-8 h-8 animate-ping" />
                      </div>
                    )}

                    {/* Top part: Large Icon and Badge */}
                    <div className="flex flex-col gap-2">
                      <div className="relative self-center">
                        {renderItemVisual(item.id, type)}
                        
                        {/* Lock / Lock status icon */}
                        {!actualUnlocked && (
                          <div className="absolute -top-1 -right-1 p-1 bg-slate-950 border border-white/10 text-amber-500 rounded-lg shadow-md">
                            <Lock size={10} />
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute -bottom-1 -right-1 p-1 bg-teal-500 text-slate-950 rounded-lg shadow-md font-bold">
                            <Check size={10} />
                          </div>
                        )}
                      </div>

                      <div className="text-center min-w-0">
                        <h4 className="text-xs font-bold text-white truncate uppercase tracking-wider px-1">
                          {item.name}
                        </h4>
                        <span className={`inline-block mt-1 text-[8px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${styles.badge}`}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>

                    {/* Bottom CTA price tag (Fixed overlap text by using leading-tight/normal) */}
                    <div className="mt-1">
                      {actualUnlocked ? (
                        isActive ? (
                          <div className="w-full py-2 rounded-xl text-[9px] font-bold text-center text-teal-400 bg-teal-500/10 border border-teal-500/20 uppercase tracking-widest leading-normal">
                            Equipped
                          </div>
                        ) : (
                          <div className="w-full py-2 rounded-xl text-[9px] font-bold text-center text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 uppercase tracking-widest leading-normal">
                            Owned
                          </div>
                        )
                      ) : item.milestone ? (
                        <div className="w-full py-2 px-1 rounded-xl text-[8.5px] font-mono font-bold text-center text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase tracking-wide leading-tight flex items-center justify-center gap-1 min-h-[26px]">
                          <Trophy size={10} className="shrink-0" /> <span className="truncate">{item.milestone}</span>
                        </div>
                      ) : (
                        <div className={`w-full py-2 rounded-xl text-xs font-mono font-black text-center leading-normal flex items-center justify-center gap-1 ${
                          coins >= item.cost ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-slate-500 bg-white/3'
                        }`}>
                          <Coins size={11} /> {item.cost}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Desktop Immersive Preview Drawer / Item Cabinet */}
        <div className="hidden lg:flex w-80 bg-slate-900 border-l border-white/10 p-6 flex-col gap-5 items-center text-center justify-between sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto select-none">
          
          {/* Cabinet Header */}
          <div className="flex flex-col gap-1 w-full border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center justify-center gap-1">
              <Compass size={11} className="text-teal-400" /> ITEM CABINET PREVIEW
            </span>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
              {selectedItem.name}
            </h2>
          </div>

          {/* Large Spinning Render Cabinet Stage */}
          <div className="relative w-full aspect-square bg-slate-950/80 border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner shadow-black/80">
            {/* Spinning ambient sunburst background rays */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-56 h-56 bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.12)_0%,_transparent_65%)] opacity-80 blur-md rounded-full scale-125"
            />

            {/* Glowing spot border */}
            <div className="absolute inset-4 rounded-xl border border-white/3 pointer-events-none" />

            <div className="relative z-10">
              {renderItemVisual(selectedItem.id, type, true)}
            </div>

            {/* Tiny decoration icon */}
            <div className="absolute top-3 right-3 text-white/15">
              <Sparkle size={18} fill="currentColor" className="animate-spin [animation-duration:12s]" />
            </div>
          </div>

          {/* Core metadata text */}
          <div className="flex flex-col gap-2 w-full text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md uppercase font-bold ${getRarityStyles(selectedItem.rarity).badge}`}>
                {selectedItem.rarity}
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase">Item ID: {selectedItem.id}</span>
            </div>
            
            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-[240px] mx-auto mt-1">
              {selectedItem.description}
            </p>
          </div>

          {/* Action trigger button */}
          <div className="w-full mt-2 border-t border-white/5 pt-4">
            {(() => {
              const isUnlocked = unlocked.includes(selectedItem.id);
              const meetsMilestone = selectedItem.milestoneNum ? playerStats.levelsCompleted >= selectedItem.milestoneNum : true;
              const actualUnlocked = isUnlocked || meetsMilestone;
              const isItemEquipped = active === selectedItem.id;

              if (actualUnlocked) {
                if (isItemEquipped) {
                  return (
                    <button
                      className="w-full py-4 rounded-xl text-sm font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 uppercase tracking-widest cursor-default flex items-center justify-center gap-2"
                      disabled
                    >
                      <Check size={16} /> Currently Equipped
                    </button>
                  );
                } else {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEquip(selectedItem.id)}
                      className="w-full py-4 rounded-xl text-sm font-display font-black bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 uppercase tracking-wider shadow-lg shadow-teal-500/10 cursor-pointer"
                    >
                      Equip Cosmetic
                    </motion.button>
                  );
                }
              } else if (selectedItem.milestone) {
                return (
                  <div className="w-full py-4 px-2 rounded-xl text-xs font-mono font-bold text-center text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-inner leading-normal">
                    <Trophy size={14} className="shrink-0" /> Locked: {selectedItem.milestone}
                  </div>
                );
              } else {
                const canAfford = coins >= selectedItem.cost;
                return (
                  <motion.button
                    whileHover={canAfford ? { scale: 1.02 } : {}}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                    onClick={() => handlePurchase(selectedItem.id, selectedItem.cost)}
                    disabled={!canAfford}
                    className={`w-full py-4 rounded-xl text-sm font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 cursor-pointer shadow-amber-500/10 border border-amber-300/20'
                        : 'bg-slate-950 border border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Coins size={15} fill="currentColor" /> Purchase Store: {selectedItem.cost}
                  </motion.button>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {/* MOBILE POPUP PREVIEW BOTTOM DRAWER SHEET */}
      <AnimatePresence>
        {isMobilePreviewOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-end justify-center lg:hidden">
            {/* Tap outside to close overlay */}
            <div className="absolute inset-0" onClick={() => setIsMobilePreviewOpen(false)} />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-slate-900 border-t border-white/10 rounded-t-3xl p-6 flex flex-col gap-5 items-center text-center z-10 shadow-2xl"
            >
              {/* Drag bar indicator */}
              <div className="w-12 h-1 bg-white/10 rounded-full mb-1" />

              {/* Header Title */}
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[9px] font-mono tracking-widest text-teal-400 uppercase">
                  Item Details
                </span>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                  {selectedItem.name}
                </h3>
              </div>

              {/* Mini visual stage */}
              <div className="relative w-36 h-36 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
                {renderItemVisual(selectedItem.id, type, true)}
              </div>

              {/* Rarity & description */}
              <div className="flex flex-col gap-2 w-full items-center">
                <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${getRarityStyles(selectedItem.rarity).badge}`}>
                  {selectedItem.rarity}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed max-w-[280px]">
                  {selectedItem.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="w-full mt-1 border-t border-white/5 pt-4">
                {(() => {
                  const isUnlocked = unlocked.includes(selectedItem.id);
                  const meetsMilestone = selectedItem.milestoneNum ? playerStats.levelsCompleted >= selectedItem.milestoneNum : true;
                  const actualUnlocked = isUnlocked || meetsMilestone;
                  const isItemEquipped = active === selectedItem.id;

                  if (actualUnlocked) {
                    if (isItemEquipped) {
                      return (
                        <button
                          className="w-full py-4 rounded-2xl text-sm font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 uppercase tracking-widest cursor-default flex items-center justify-center gap-2 leading-normal"
                          disabled
                        >
                          <Check size={16} /> Equipped
                        </button>
                      );
                    } else {
                      return (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            handleEquip(selectedItem.id);
                            setIsMobilePreviewOpen(false);
                          }}
                          className="w-full py-4 rounded-2xl text-sm font-display font-black bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 uppercase tracking-wider"
                        >
                          Equip Item
                        </motion.button>
                      );
                    }
                  } else if (selectedItem.milestone) {
                    return (
                      <div className="w-full py-4 px-2 rounded-2xl text-xs font-mono font-bold text-center text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-inner leading-normal">
                        <Trophy size={14} className="shrink-0" /> Locked: {selectedItem.milestone}
                      </div>
                    );
                  } else {
                    const canAfford = coins >= selectedItem.cost;
                    return (
                      <motion.button
                        disabled={!canAfford}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                        onClick={() => {
                          handlePurchase(selectedItem.id, selectedItem.cost);
                          setIsMobilePreviewOpen(false);
                        }}
                        className={`w-full py-4 rounded-2xl text-sm font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-300/20'
                            : 'bg-slate-950 border border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Coins size={15} fill="currentColor" /> Buy: {selectedItem.cost}
                      </motion.button>
                    );
                  }
                })()}
              </div>

              <button
                onClick={() => setIsMobilePreviewOpen(false)}
                className="w-full py-3 mt-1 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-2xl border border-white/10 text-slate-400 hover:text-white cursor-pointer active:scale-95 transition-all"
              >
                Close Drawer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
