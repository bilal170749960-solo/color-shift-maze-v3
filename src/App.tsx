/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Pause,
  RotateCcw,
  Menu,
  ArrowRight,
  Home,
  Trophy,
  Sparkles,
  Clock,
  Award,
  Grid,
  Heart,
  Calendar,
  Zap,
  Star,
  Coins,
} from 'lucide-react';

import { GameColor, Level, COLORS, LevelProgress, Achievement, PlayerStats } from './types';
import { LEVELS, generateDailyLevel } from './levels';
import { audio } from './audio';
import { GameCanvas } from './components/GameCanvas';
import { MainMenu, LevelsMenu, SettingsMenu, AchievementsMenu, HowToPlay } from './components/Menus';
import { Leaderboard } from './components/Leaderboard';
import { DailyChallenge } from './components/DailyChallenge';
import { LoadingScreen } from './components/LoadingScreen';
import { Customizer } from './components/Customizer';
import { AdsManager, AdState } from './lib/AdsManager';
import { LuckySpin } from './components/LuckySpin';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_shift',
    title: 'Spectrum Harmonizer',
    description: 'Changed your cube color for the first time.',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    icon: 'palette',
  },
  {
    id: 'star_finder',
    title: 'Constellation Gatherer',
    description: 'Collected 15 glowing puzzle stars.',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
    icon: 'star',
  },
  {
    id: 'door_shatterer',
    title: 'Gatebreaker Keymaster',
    description: 'Unlocked 8 glass doors using golden brass keys.',
    unlocked: false,
    progress: 0,
    maxProgress: 8,
    icon: 'key',
  },
  {
    id: 'perfect_run',
    title: 'Flawless Prism',
    description: 'Completed any level under target moves with a perfect 3-star rating.',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    icon: 'award',
  },
  {
    id: 'daily_solved',
    title: 'Chronos Voyager',
    description: 'Solved today\'s procedurally generated Daily Rift challenge.',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    icon: 'flame',
  },
  {
    id: 'level_master',
    title: 'Grand Architect',
    description: 'Conquered Level 30 - the Master Spectrum maze!',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    icon: 'trophy',
  },
];

export default function App() {
  // Screens & Navigation
  const [activeScreen, setActiveScreen] = useState<
    'main_menu' | 'levels_menu' | 'settings_menu' | 'achievements_menu' | 'how_to_play' | 'daily_challenge' | 'playing' | 'victory_screen'
  >('main_menu');

  // Core level metrics
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [starsCollected, setStarsCollected] = useState(0);
  const [gameTimer, setGameTimer] = useState(0);
  const timerIntervalRef = useRef<any>(null);

  // Lives, Game Over and Ad watching mechanics
  const [lives, setLives] = useState(3);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(2);

  // Real AdsManager listener states
  const [activeAd, setActiveAd] = useState<AdState | null>(null);
  const [adTimer, setAdTimer] = useState(3);
  const [claimedMilestoneReward, setClaimedMilestoneReward] = useState<number | null>(null);
  const [hasDoubleRewardWatched, setHasDoubleRewardWatched] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);

  // Persistent storage state
  const [progress, setProgress] = useState<LevelProgress[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalStars: 0,
    levelsCompleted: 0,
    totalMoves: 0,
    totalTime: 0,
    colorChanges: 0,
    dailyStreak: 0,
    lastDailyDate: '',
    coins: 0,
    xp: 0,
    activeSkin: 'cube',
    activeTrail: 'default',
    activeTheme: 'slate',
    activeTile: 'tile_standard',
    activeIcon: 'icon_beginner',
    activeParticle: 'part_spark',
    unlockedSkins: ['cube'],
    unlockedTrails: ['default'],
    unlockedThemes: ['slate'],
    unlockedTiles: ['tile_standard'],
    unlockedIcons: ['icon_beginner'],
    unlockedParticles: ['part_spark'],
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Config metrics
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [vibration, setVibration] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  // Layout overlays
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [runResults, setRunResults] = useState<{
    moves: number;
    time: number;
    stars: number;
    coinsEarned?: number;
    xpEarned?: number;
    unlockedCosmetic?: string;
  } | null>(null);

  // Floating notifications
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  // Startup: Load data from localStorage
  useEffect(() => {
    // 1. Audio volume configurations setup
    const savedSfx = localStorage.getItem('cs_maze_sfx_vol');
    const savedMusic = localStorage.getItem('cs_maze_music_vol');
    const savedVibe = localStorage.getItem('cs_maze_vibration');
    const savedMuted = localStorage.getItem('cs_maze_muted');
    const savedMusicEnabled = localStorage.getItem('cs_maze_music_enabled');

    const sfxVol = savedSfx ? parseFloat(savedSfx) : 0.5;
    const musicVol = savedMusic ? parseFloat(savedMusic) : 0.3;
    const vibeEnabled = savedVibe ? savedVibe === 'true' : true;
    const mutedVal = savedMuted === 'true';
    const musicEnabledVal = savedMusicEnabled !== 'false';

    setSfxVolume(sfxVol);
    setMusicVolume(musicVol);
    setVibration(vibeEnabled);
    setIsMuted(mutedVal);
    setIsMusicEnabled(musicEnabledVal);

    audio.setSfxVolume(sfxVol);
    audio.setMusicVolume(musicVol);
    audio.setVibration(vibeEnabled);
    audio.setMuted(mutedVal);
    audio.setMusicEnabled(musicEnabledVal);

    // 2. Levels completed progress bootstrap
    const savedProgress = localStorage.getItem('cs_maze_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      const initialProgress: LevelProgress[] = LEVELS.map((lvl) => ({
        levelId: lvl.id,
        unlocked: lvl.id === 1, // level 1 unlocked initially
        completed: false,
        stars: 0,
        bestMoves: 0,
        bestTime: 0,
        perfectRun: false,
      }));
      localStorage.setItem('cs_maze_progress', JSON.stringify(initialProgress));
      setProgress(initialProgress);
    }

    // 3. Achievements list load
    const savedAch = localStorage.getItem('cs_maze_achievements');
    if (savedAch) {
      setAchievements(JSON.parse(savedAch));
    } else {
      localStorage.setItem('cs_maze_achievements', JSON.stringify(DEFAULT_ACHIEVEMENTS));
      setAchievements(DEFAULT_ACHIEVEMENTS);
    }

    // 4. Stats dashboard load
    const savedStats = localStorage.getItem('cs_maze_stats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      // Double check daily streak on startup
      const checkStreak = {
        coins: 0,
        xp: 0,
        activeSkin: 'cube',
        activeTrail: 'default',
        activeTheme: 'slate',
        activeTile: 'tile_standard',
        activeIcon: 'icon_beginner',
        activeParticle: 'part_spark',
        unlockedSkins: ['cube'],
        unlockedTrails: ['default'],
        unlockedThemes: ['slate'],
        unlockedTiles: ['tile_standard'],
        unlockedIcons: ['icon_beginner'],
        unlockedParticles: ['part_spark'],
        ...parsedStats
      };
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      if (
        checkStreak.lastDailyDate &&
        checkStreak.lastDailyDate !== todayStr &&
        checkStreak.lastDailyDate !== yesterdayStr
      ) {
        // Streak broken
        checkStreak.dailyStreak = 0;
      }
      localStorage.setItem('cs_maze_stats', JSON.stringify(checkStreak));
      setPlayerStats(checkStreak);
    } else {
      const initialStats: PlayerStats = {
        totalStars: 0,
        levelsCompleted: 0,
        totalMoves: 0,
        totalTime: 0,
        colorChanges: 0,
        dailyStreak: 0,
        lastDailyDate: '',
        coins: 100, // Gift starting coins for premium look!
        xp: 0,
        activeSkin: 'cube',
        activeTrail: 'default',
        activeTheme: 'slate',
        activeTile: 'tile_standard',
        activeIcon: 'icon_beginner',
        activeParticle: 'part_spark',
        unlockedSkins: ['cube'],
        unlockedTrails: ['default'],
        unlockedThemes: ['slate'],
        unlockedTiles: ['tile_standard'],
        unlockedIcons: ['icon_beginner'],
        unlockedParticles: ['part_spark'],
      };
      localStorage.setItem('cs_maze_stats', JSON.stringify(initialStats));
      setPlayerStats(initialStats);
    }

    // Subscribe to AdsManager
    AdsManager.setAdListener((state) => {
      if (state.isOpen) {
        setActiveAd(state);
        setAdTimer(state.type === 'rewarded' ? 5 : 3);
        stopGameplayTimer();
      } else {
        setActiveAd(null);
        if (activeScreen === 'playing' && !isPaused && !showGameOver) {
          startGameplayTimer();
        }
      }
    });

    // 5. Ambient music start trigger on first user interaction
    const startAudioOnInteraction = () => {
      audio.startMusic();
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);
    window.addEventListener('keydown', startAudioOnInteraction);

    return () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
      window.removeEventListener('keydown', startAudioOnInteraction);
      audio.stopMusic();
      AdsManager.removeAdListener();
    };
  }, []);

  // Sync settings helper
  const handleMusicVolumeChange = (vol: number) => {
    setMusicVolume(vol);
    audio.setMusicVolume(vol);
    localStorage.setItem('cs_maze_music_vol', vol.toString());
  };

  const handleSfxVolumeChange = (vol: number) => {
    setSfxVolume(vol);
    audio.setSfxVolume(vol);
    localStorage.setItem('cs_maze_sfx_vol', vol.toString());
  };

  const handleVibrationToggle = (enabled: boolean) => {
    setVibration(enabled);
    audio.setVibration(enabled);
    localStorage.setItem('cs_maze_vibration', enabled.toString());
  };

  const handleMuteToggle = (muted: boolean) => {
    setIsMuted(muted);
    audio.setMuted(muted);
    localStorage.setItem('cs_maze_muted', muted.toString());
  };

  const handleMusicToggle = (enabled: boolean) => {
    setIsMusicEnabled(enabled);
    audio.setMusicEnabled(enabled);
    localStorage.setItem('cs_maze_music_enabled', enabled.toString());
  };

  const triggerResetProgress = () => {
    localStorage.removeItem('cs_maze_progress');
    localStorage.removeItem('cs_maze_achievements');
    localStorage.removeItem('cs_maze_stats');

    // Bootstrap values back
    const freshProgress = LEVELS.map((lvl) => ({
      levelId: lvl.id,
      unlocked: lvl.id === 1,
      completed: false,
      stars: 0,
      bestMoves: 0,
      bestTime: 0,
      perfectRun: false,
    }));
    setProgress(freshProgress);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setPlayerStats({
      totalStars: 0,
      levelsCompleted: 0,
      totalMoves: 0,
      totalTime: 0,
      colorChanges: 0,
      dailyStreak: 0,
      lastDailyDate: '',
      coins: 100,
      xp: 0,
      activeSkin: 'cube',
      activeTrail: 'default',
      activeTheme: 'slate',
      activeTile: 'tile_standard',
      activeIcon: 'icon_beginner',
      activeParticle: 'part_spark',
      unlockedSkins: ['cube'],
      unlockedTrails: ['default'],
      unlockedThemes: ['slate'],
      unlockedTiles: ['tile_standard'],
      unlockedIcons: ['icon_beginner'],
      unlockedParticles: ['part_spark'],
    });

    localStorage.setItem('cs_maze_progress', JSON.stringify(freshProgress));
    localStorage.setItem('cs_maze_achievements', JSON.stringify(DEFAULT_ACHIEVEMENTS));
    localStorage.setItem('cs_maze_stats', JSON.stringify({
      totalStars: 0,
      levelsCompleted: 0,
      totalMoves: 0,
      totalTime: 0,
      colorChanges: 0,
      dailyStreak: 0,
      lastDailyDate: '',
      coins: 100,
      xp: 0,
      activeSkin: 'cube',
      activeTrail: 'default',
      activeTheme: 'slate',
      activeTile: 'tile_standard',
      activeIcon: 'icon_beginner',
      activeParticle: 'part_spark',
      unlockedSkins: ['cube'],
      unlockedTrails: ['default'],
      unlockedThemes: ['slate'],
      unlockedTiles: ['tile_standard'],
      unlockedIcons: ['icon_beginner'],
      unlockedParticles: ['part_spark'],
    }));

    audio.playUnlock();
    setActiveScreen('main_menu');
  };

  // Launch Handcrafted Game level
  const launchLevel = (levelId: number) => {
    const lvl = LEVELS.find((l) => l.id === levelId);
    if (lvl) {
      setCurrentLevel(lvl);
      setGameTimer(0);
      setIsPaused(false);
      setLives(3);
      setShowGameOver(false);
      setIsWatchingAd(false);
      setClaimedMilestoneReward(null);
      setHasDoubleRewardWatched(false);
      setActiveHint(null);
      setActiveScreen('playing');
      startGameplayTimer();
    }
  };

  // Launch procedural Date seeded Daily level
  const launchDailyRiftLevel = (dailyLevel: Level) => {
    setCurrentLevel(dailyLevel);
    setGameTimer(0);
    setIsPaused(false);
    setLives(3);
    setShowGameOver(false);
    setIsWatchingAd(false);
    setClaimedMilestoneReward(null);
    setHasDoubleRewardWatched(false);
    setActiveHint(null);
    setActiveScreen('playing');
    startGameplayTimer();
  };

  // Ticking Game Clock timer hooks
  const getLevelHint = (levelId: number): string => {
    if (levelId === 1) return "Connect red cells to slide across crimson gates!";
    if (levelId === 2) return "Shift color carefully! Blue portals block non-blue entities.";
    if (levelId === 3) return "Look out for color blocks. Toggle the switch to unlock paths.";
    if (levelId === 4) return "Time your moves! Moving obstacles patrol key corridors.";
    if (levelId === 5) return "Use teleporters to bypass locked security gates.";
    return "Examine the pathway colors. Color shift near gates to cross seamlessly!";
  };

  const handleSkipLevelAd = async () => {
    if (!currentLevel) return;
    audio.playClick();
    const success = await AdsManager.showRewardedAd('skip_level');
    if (success) {
      setIsPaused(false);
      // Mark current level completed
      const nextProgress = progress.map((prog) => {
        if (prog.levelId === currentLevel.id) {
          return {
            ...prog,
            completed: true,
            stars: Math.max(prog.stars, 1),
          };
        }
        if (prog.levelId === currentLevel.id + 1) {
          return {
            ...prog,
            unlocked: true,
          };
        }
        return prog;
      });
      setProgress(nextProgress);
      localStorage.setItem('cs_maze_progress', JSON.stringify(nextProgress));

      const totalStars = nextProgress.reduce((acc, p) => acc + p.stars, 0);
      const levelsCompleted = nextProgress.filter((p) => p.completed).length;
      
      const nextStats = {
        ...playerStats,
        totalStars,
        levelsCompleted,
      };
      setPlayerStats(nextStats);
      localStorage.setItem('cs_maze_stats', JSON.stringify(nextStats));

      audio.playUnlock();
      loadNextLevel();
    }
  };

  const handleRevealHintAd = async () => {
    if (!currentLevel) return;
    audio.playClick();
    const success = await AdsManager.showRewardedAd('reveal_hint');
    if (success) {
      setActiveHint(getLevelHint(currentLevel.id));
      audio.playUnlock();
    }
  };

  const handleContinueNextLevel = async () => {
    if (!currentLevel) return;
    const completedId = currentLevel.id;

    // Level-specific interstitial ad triggers BEFORE loading the next level
    if (completedId === 5 || completedId === 10 || completedId === 20) {
      console.log(`[Ad Flow] Level ${completedId} complete. Displaying interstitial before next level.`);
      await AdsManager.showInterstitialAd(`level_${completedId}_complete`);
    } else if (completedId > 20 && (completedId - 20) % 4 === 0) {
      console.log(`[Ad Flow] Level ${completedId} complete. Displaying periodic post-20 interstitial.`);
      await AdsManager.showInterstitialAd(`level_periodic_${completedId}`);
    }

    if (completedId === 9999) {
      setActiveScreen('daily_challenge');
    } else {
      loadNextLevel();
    }
  };

  const handleClaimMilestoneAd = async () => {
    if (!currentLevel || !runResults) return;
    audio.playClick();
    const success = await AdsManager.showRewardedAd(`level_${currentLevel.id}_milestone`);
    if (success) {
      // Reward coins
      const nextStats = { ...playerStats };
      nextStats.coins = (nextStats.coins || 0) + 500;
      
      // Unlock a legendary skin / cosmetic!
      let rewardCosmeticName = "";
      if (currentLevel.id === 3) {
        if (!nextStats.unlockedSkins.includes('star_cube')) {
          nextStats.unlockedSkins = [...nextStats.unlockedSkins, 'star_cube'];
          rewardCosmeticName = "Cosmic Star Skin";
        }
      } else if (currentLevel.id === 8) {
        if (!nextStats.unlockedTrails.includes('rainbow')) {
          nextStats.unlockedTrails = [...nextStats.unlockedTrails, 'rainbow'];
          rewardCosmeticName = "Rainbow Stream Trail";
        }
      } else if (currentLevel.id === 15) {
        if (!nextStats.unlockedThemes.includes('cyber')) {
          nextStats.unlockedThemes = [...nextStats.unlockedThemes, 'cyber'];
          rewardCosmeticName = "Cyberpunk Grid Theme";
        }
      }

      setPlayerStats(nextStats);
      localStorage.setItem('cs_maze_stats', JSON.stringify(nextStats));
      setClaimedMilestoneReward(currentLevel.id);
      
      setRunResults({
        ...runResults,
        coinsEarned: (runResults.coinsEarned || 0) + 500,
        unlockedCosmetic: rewardCosmeticName || "Special Sponsored Cosmetic Pack",
      });
      audio.playUnlock();
    }
  };

  const handleDoubleRewardAd = async () => {
    if (!currentLevel || !runResults) return;
    audio.playClick();
    const success = await AdsManager.showRewardedAd('double_rewards');
    if (success) {
      const extraCoins = runResults.coinsEarned || 0;
      const extraXP = runResults.xpEarned || 0;

      const nextStats = { ...playerStats };
      nextStats.coins = (nextStats.coins || 0) + extraCoins;
      nextStats.xp = (nextStats.xp || 0) + extraXP;

      setPlayerStats(nextStats);
      localStorage.setItem('cs_maze_stats', JSON.stringify(nextStats));
      setHasDoubleRewardWatched(true);

      setRunResults({
        ...runResults,
        coinsEarned: (runResults.coinsEarned || 0) + extraCoins,
        xpEarned: (runResults.xpEarned || 0) + extraXP,
      });
      audio.playUnlock();
    }
  };

  const startGameplayTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setGameTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopGameplayTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Handle gameplay pausing
  useEffect(() => {
    if (activeScreen === 'playing' && !isPaused && !showGameOver && !isWatchingAd) {
      startGameplayTimer();
    } else {
      stopGameplayTimer();
    }
    return () => stopGameplayTimer();
  }, [activeScreen, isPaused, showGameOver, isWatchingAd]);

  // Pause game when browser tab loses focus / Resume when focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (activeScreen === 'playing') {
          setIsPaused(true);
        }
        audio.pause();
      } else {
        audio.resume();
      }
    };

    const handleBlur = () => {
      if (activeScreen === 'playing') {
        setIsPaused(true);
      }
      audio.pause();
    };

    const handleFocus = () => {
      audio.resume();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [activeScreen]);

  // Simulated Rewarded Ad Countdown for Revive Feature
  useEffect(() => {
    let timer: any;
    if (isWatchingAd) {
      timer = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsWatchingAd(false);
            setLives(3);
            setShowGameOver(false);
            startGameplayTimer();
            audio.playUnlock();
            return 2;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWatchingAd]);

  // Countdown timer for AdsManager Active Ads
  useEffect(() => {
    let timer: any;
    if (activeAd) {
      timer = setInterval(() => {
        setAdTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeAd]);

  // Handle player collisions and decrement lives
  const handlePlayerHurt = () => {
    audio.vibrate([100]); // Vibrate mobile device if enabled
    setLives((prev) => {
      const nextLives = Math.max(0, prev - 1);
      if (nextLives === 0) {
        setShowGameOver(true);
        stopGameplayTimer();
      }
      return nextLives;
    });
  };

  // Dedicated Level Reset / Restart Handler
  const handleRestartLevel = () => {
    if (!currentLevel) return;
    audio.playClick();
    setLives(3);
    setShowGameOver(false);
    setIsWatchingAd(false);
    setGameTimer(0);
    setIsPaused(false);
    setCurrentLevel({ ...currentLevel });
  };

  const triggerAchievementUnlocked = (ach: Achievement) => {
    setUnlockedAchievement(ach);
    audio.playStar();
    setTimeout(() => {
      setUnlockedAchievement(null);
    }, 4000);
  };

  const updateAchievementProgress = (id: string, delta: number) => {
    const updated = achievements.map((ach) => {
      if (ach.id === id && !ach.unlocked) {
        const nextProgress = Math.min(ach.maxProgress, ach.progress + delta);
        const didUnlock = nextProgress >= ach.maxProgress;

        const updatedAch = {
          ...ach,
          progress: nextProgress,
          unlocked: didUnlock,
          unlockedAt: didUnlock ? new Date().toLocaleDateString() : undefined,
        };

        if (didUnlock) {
          triggerAchievementUnlocked(updatedAch);
        }
        return updatedAch;
      }
      return ach;
    });

    setAchievements(updated);
    localStorage.setItem('cs_maze_achievements', JSON.stringify(updated));
  };

  // Complete level scoring execution
  const handleLevelComplete = (moves: number, timeSpent: number, starsCount: number) => {
    stopGameplayTimer();
    if (!currentLevel) return;

    const isDaily = currentLevel.id === 9999;
    
    // Reward calculation
    const baseCoins = isDaily ? 35 : 20;
    const starCoins = starsCount * 15;
    const isPerfect = starsCount === 3 && moves <= currentLevel.targetMoves;
    const perfectCoinsBonus = isPerfect ? 30 : 0;
    const coinsEarned = baseCoins + starCoins + perfectCoinsBonus;

    const baseXP = isDaily ? 80 : 50;
    const starXP = starsCount * 30;
    const perfectXPBonus = isPerfect ? 50 : 0;
    const xpEarned = baseXP + starXP + perfectXPBonus;

    let unlockedCosmetic = "";
    const unlockedSkins = playerStats.unlockedSkins ? [...playerStats.unlockedSkins] : ['cube'];
    const unlockedTrails = playerStats.unlockedTrails ? [...playerStats.unlockedTrails] : ['default'];
    const unlockedThemes = playerStats.unlockedThemes ? [...playerStats.unlockedThemes] : ['slate'];

    if (isDaily) {
      // 1. Process Daily Challenge rewards & Streak
      const todayStr = new Date().toISOString().split('T')[0];
      const nextStats = { ...playerStats };

      if (nextStats.lastDailyDate !== todayStr) {
        // Increment streak if last date completed was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (nextStats.lastDailyDate === yesterdayStr || nextStats.dailyStreak === 0) {
          nextStats.dailyStreak += 1;
        } else {
          nextStats.dailyStreak = 1; // broken
        }
        nextStats.lastDailyDate = todayStr;
      }

      // Add double stars bonus
      nextStats.totalStars += starsCount * 2;
      nextStats.coins = (nextStats.coins || 0) + coinsEarned;
      nextStats.xp = (nextStats.xp || 0) + xpEarned;
      setPlayerStats(nextStats);
      localStorage.setItem('cs_maze_stats', JSON.stringify(nextStats));

      setRunResults({
        moves,
        time: timeSpent,
        stars: starsCount,
        coinsEarned,
        xpEarned,
        unlockedCosmetic: "",
      });
      setActiveScreen('victory_screen');

      // Trigger daily solved achievement
      updateAchievementProgress('daily_solved', 1);
      return;
    }

    // Handcrafted Level tracking updates
    let alreadyCompleted = false;
    const nextProgress = progress.map((prog) => {
      if (prog.levelId === currentLevel.id) {
        alreadyCompleted = prog.completed;
        const highestStars = Math.max(prog.stars, starsCount);
        const bestMoves = prog.bestMoves === 0 ? moves : Math.min(prog.bestMoves, moves);
        const bestTime = prog.bestTime === 0 ? timeSpent : Math.min(prog.bestTime, timeSpent);

        return {
          ...prog,
          completed: true,
          stars: highestStars,
          bestMoves,
          bestTime,
          perfectRun: highestStars === 3 || prog.perfectRun,
        };
      }

      // Unlock next level sequentially
      if (prog.levelId === currentLevel.id + 1) {
        return {
          ...prog,
          unlocked: true,
        };
      }

      return prog;
    });

    // Save level updates
    setProgress(nextProgress);
    localStorage.setItem('cs_maze_progress', JSON.stringify(nextProgress));

    // Update global dashboard statistics
    const totalStars = nextProgress.reduce((acc, p) => acc + p.stars, 0);
    const levelsCompleted = nextProgress.filter((p) => p.completed).length;

    // Check level completed cosmetics milestones on FIRST completion of milestones
    if (!alreadyCompleted) {
      if (levelsCompleted === 5) {
        if (!unlockedSkins.includes('sphere')) {
          unlockedSkins.push('sphere');
          unlockedCosmetic = "Sphere Skin";
        }
      } else if (levelsCompleted === 10) {
        if (!unlockedTrails.includes('ghost')) {
          unlockedTrails.push('ghost');
          unlockedCosmetic = "Ghost Trail";
        }
      } else if (levelsCompleted === 15) {
        if (!unlockedThemes.includes('neon')) {
          unlockedThemes.push('neon');
          unlockedCosmetic = "Neon Theme";
        }
      } else if (levelsCompleted === 20) {
        if (!unlockedSkins.includes('gem')) {
          unlockedSkins.push('gem');
          unlockedCosmetic = "Gem Skin";
        }
      } else if (levelsCompleted === 25) {
        if (!unlockedTrails.includes('sparkle')) {
          unlockedTrails.push('sparkle');
          unlockedCosmetic = "Sparkle Trail";
        }
      } else if (levelsCompleted === 30) {
        if (!unlockedThemes.includes('royal')) {
          unlockedThemes.push('royal');
          unlockedCosmetic = "Royal Theme";
        }
      }
    }

    const updatedStats = {
      ...playerStats,
      totalStars,
      levelsCompleted,
      totalMoves: playerStats.totalMoves + moves,
      totalTime: playerStats.totalTime + timeSpent,
      coins: (playerStats.coins || 0) + coinsEarned,
      xp: (playerStats.xp || 0) + xpEarned,
      unlockedSkins,
      unlockedTrails,
      unlockedThemes,
    };
    setPlayerStats(updatedStats);
    localStorage.setItem('cs_maze_stats', JSON.stringify(updatedStats));

    setRunResults({
      moves,
      time: timeSpent,
      stars: starsCount,
      coinsEarned,
      xpEarned,
      unlockedCosmetic,
    });
    setActiveScreen('victory_screen');

    // --- PROCESS ACHIEVEMENT UNLOCKS ---
    // Palette color harmonizer: triggers upon first color shifting Pad arrival
    updateAchievementProgress('first_shift', 1);

    // Star Gatherer trophies (collected stars on canvas)
    updateAchievementProgress('star_finder', starsCount);

    // Door shatterer keymaster
    if (currentLevel.grid.some(row => row.includes('D'))) {
      updateAchievementProgress('door_shatterer', 1);
    }

    // Perfect run flawlessness
    if (starsCount === 3 && moves <= currentLevel.targetMoves) {
      updateAchievementProgress('perfect_run', 1);
    }

    // Conquered Level 30 Master Spectro
    if (currentLevel.id === 30) {
      updateAchievementProgress('level_master', 1);
    }
  };

  // Move to next stage handler
  const loadNextLevel = () => {
    if (!currentLevel) return;
    const nextId = currentLevel.id + 1;
    if (nextId <= LEVELS.length) {
      launchLevel(nextId);
    } else {
      setActiveScreen('levels_menu');
    }
  };

  return (
    <div className="w-full h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {showLoader && (
        <LoadingScreen onComplete={() => setShowLoader(false)} />
      )}

      {/* Background Decorative Glows for Frosted Glass Depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#007aff] rounded-full blur-[140px] opacity-25 pointer-events-none z-0 animate-pulse [animation-duration:10s]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ff3b30] rounded-full blur-[140px] opacity-15 pointer-events-none z-0 animate-pulse [animation-duration:8s]"></div>

      {/* Dynamic Unlocked Trophy popdown toast */}
      <AnimatePresence>
        {unlockedAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm glass-panel p-4 rounded-2xl border border-amber-500/30 flex items-center gap-3 bg-slate-950/90 shadow-2xl shadow-amber-500/10"
          >
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400">
              <Award className="animate-pulse" size={20} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-500 uppercase">
                ACHIEVEMENT UNLOCKED!
              </span>
              <h4 className="text-xs font-bold text-white uppercase">{unlockedAchievement.title}</h4>
              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                {unlockedAchievement.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Transit Controller */}
      <div className="flex-1 w-full h-full relative">
        <AnimatePresence mode="wait">
          {activeScreen === 'main_menu' && (
            <motion.div
              key="main_menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MainMenu
                onStartGame={() => {
                  // Launch first incomplete level or level 1
                  const nextIncomplete = progress.find((p) => p.unlocked && !p.completed);
                  const startId = nextIncomplete ? nextIncomplete.levelId : 1;
                  launchLevel(startId);
                }}
                onOpenLevels={() => setActiveScreen('levels_menu')}
                onOpenSettings={() => setActiveScreen('settings_menu')}
                onOpenAchievements={() => setActiveScreen('achievements_menu')}
                onOpenHowToPlay={() => setActiveScreen('how_to_play')}
                onOpenDailyChallenge={() => setActiveScreen('daily_challenge')}
                onOpenCustomizer={() => setActiveScreen('customizer_menu')}
                onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
                playerStats={playerStats}
                sfxVolume={sfxVolume}
                musicVolume={musicVolume}
                onSfxVolumeChange={handleSfxVolumeChange}
                onMusicVolumeChange={handleMusicVolumeChange}
                vibration={vibration}
                onVibrationToggle={handleVibrationToggle}
                isMuted={isMuted}
                isMusicEnabled={isMusicEnabled}
                onMuteToggle={handleMuteToggle}
                onMusicToggle={handleMusicToggle}
              />
            </motion.div>
          )}

          {activeScreen === 'levels_menu' && (
            <motion.div
              key="levels_menu"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              className="absolute inset-0"
            >
              <LevelsMenu
                levels={LEVELS}
                progress={progress}
                onSelectLevel={launchLevel}
                onBack={() => setActiveScreen('main_menu')}
              />
            </motion.div>
          )}

          {activeScreen === 'customizer_menu' && (
            <motion.div
              key="customizer_menu"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              className="absolute inset-0"
            >
              <Customizer
                playerStats={playerStats}
                onBack={() => setActiveScreen('main_menu')}
                onUpdateStats={(newStats) => {
                  setPlayerStats(newStats);
                  localStorage.setItem('cs_maze_stats', JSON.stringify(newStats));
                }}
              />
            </motion.div>
          )}

          {activeScreen === 'settings_menu' && (
            <motion.div
              key="settings_menu"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              className="absolute inset-0"
            >
              <SettingsMenu
                onBack={() => setActiveScreen('main_menu')}
                onResetProgress={triggerResetProgress}
                sfxVolume={sfxVolume}
                musicVolume={musicVolume}
                vibration={vibration}
                onMusicVolumeChange={handleMusicVolumeChange}
                onSfxVolumeChange={handleSfxVolumeChange}
                onVibrationToggle={handleVibrationToggle}
                isMuted={isMuted}
                isMusicEnabled={isMusicEnabled}
                onMuteToggle={handleMuteToggle}
                onMusicToggle={handleMusicToggle}
              />
            </motion.div>
          )}

          {activeScreen === 'achievements_menu' && (
            <motion.div
              key="achievements_menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0"
            >
              <AchievementsMenu
                onBack={() => setActiveScreen('main_menu')}
                achievements={achievements}
              />
            </motion.div>
          )}

          {activeScreen === 'how_to_play' && (
            <motion.div
              key="how_to_play"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className="absolute inset-0"
            >
              <HowToPlay onBack={() => setActiveScreen('main_menu')} />
            </motion.div>
          )}

          {activeScreen === 'daily_challenge' && (
            <motion.div
              key="daily_challenge"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0"
            >
              <DailyChallenge
                onBack={() => setActiveScreen('main_menu')}
                playerStats={playerStats}
                onLaunchDailyLevel={launchDailyRiftLevel}
              />
            </motion.div>
          )}

          {activeScreen === 'playing' && currentLevel && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col h-full select-none"
            >
              {/* Active HUD display strip */}
              <div className="px-5 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between z-10 select-none shadow-md">
                {/* Left indicators: index & timer */}
                <div className="flex flex-col gap-0.5">
                  <div className="text-xs font-semibold text-slate-300 font-display flex items-center gap-1 uppercase tracking-wide">
                    <Grid size={11} className="text-slate-400" />
                    {currentLevel.id === 9999 ? "DAILY RIFT" : `MAZE ${currentLevel.id}`}
                  </div>
                  <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                    <Clock size={13} className="text-slate-400 animate-pulse" /> {gameTimer}s
                  </div>
                </div>

                 {/* Center indicators: Stars & Lives */}
                <div className="flex items-center gap-2">
                  {/* Star visual flash targets */}
                  <div className="flex gap-1 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => {
                        // Star 1: auto on completion
                        // Star 2: moves target
                        // Star 3: star picked up
                        let active = true;
                        if (i === 1 && movesCount > currentLevel.targetMoves) active = false;
                        if (i === 2 && starsCollected === 0 && currentLevel.grid.some(row => row.includes('S'))) active = false;
                        
                        return (
                          <Star
                            key={i}
                            size={13}
                            fill={active ? '#fbbf24' : 'transparent'}
                            className={active ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-700'}
                          />
                        );
                      })}
                  </div>

                  {/* Lives indicator */}
                  <div className="flex gap-1 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-inner" title="Lives Remaining">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <Heart
                          key={i}
                          size={13}
                          fill={i < lives ? '#ef4444' : 'transparent'}
                          className={i < lives ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-slate-700'}
                        />
                      ))}
                  </div>
                </div>

                {/* Right controllers: pause / reset */}
                <div className="flex items-center gap-2">
                  <button
                    id="hud_btn_restart"
                    onClick={handleRestartLevel}
                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all cursor-pointer shadow-md select-none active:scale-95"
                    title="Restart Maze"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    id="hud_btn_pause"
                    onClick={() => {
                      audio.playClick();
                      setIsPaused(true);
                    }}
                    className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all cursor-pointer shadow-md select-none active:scale-95"
                  >
                    <Pause size={14} fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Subtitles Description banner */}
              <div className="bg-white/3 backdrop-blur-sm py-2 px-5 border-b border-white/5 text-center text-[11px] font-medium text-slate-300 tracking-wide select-none">
                🎯 Moves: {movesCount} / <span className="text-blue-400 font-mono font-bold">{currentLevel.targetMoves}</span>
              </div>

              {/* CANVAS GRAPHICS MODULE */}
              <div className="flex-1 w-full flex items-center justify-center relative bg-slate-950/40 backdrop-blur-md">
                <GameCanvas
                  level={currentLevel}
                  isPaused={isPaused || showGameOver || !!activeAd}
                  onMoveCountChange={setMovesCount}
                  onStarCollected={setStarsCollected}
                  onLevelComplete={handleLevelComplete}
                  onRestartRequest={handleRestartLevel}
                  onPlayerHurt={handlePlayerHurt}
                  playerStats={playerStats}
                />

                {/* Active Pause overlay menu */}
                <AnimatePresence>
                  {isPaused && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
                    >
                      {/* Ambient background glows */}
                      <div className="absolute w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="bg-slate-900/80 border border-white/10 p-6 rounded-3xl w-full max-w-[320px] text-center flex flex-col gap-4 shadow-2xl relative select-none backdrop-blur-xl"
                      >
                        {/* Header Details */}
                        <div className="flex flex-col gap-1 items-center">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 uppercase flex items-center gap-1">
                            <Clock size={11} className="animate-pulse" /> GAME PAUSED
                          </span>
                          <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mt-0.5">
                            {currentLevel ? currentLevel.name : 'Spectrum Core'}
                          </h3>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {currentLevel && currentLevel.id !== 9999 ? (
                              `Adventure Stage ${currentLevel.id} • Biome ${Math.floor((currentLevel.id - 1) / 15) + 1}`
                            ) : (
                              'Special Daily Dimension'
                            )}
                          </span>
                        </div>

                        {/* Interactive bento grid stats container */}
                        <div className="grid grid-cols-2 gap-2 my-1">
                          {/* Moves Card */}
                          <div className="bg-slate-950/60 border border-white/5 p-2.5 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">MOVES</span>
                            <span className="text-sm font-mono font-black text-white mt-0.5">
                              {movesCount}<span className="text-slate-500 text-xs font-normal">/{currentLevel?.targetMoves || 0}</span>
                            </span>
                          </div>

                          {/* Time Card */}
                          <div className="bg-slate-950/60 border border-white/5 p-2.5 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">DURATION</span>
                            <span className="text-sm font-mono font-black text-teal-400 mt-0.5">
                              {(() => {
                                const m = Math.floor(gameTimer / 60);
                                const s = gameTimer % 60;
                                return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                              })()}
                            </span>
                          </div>

                          {/* Lives Row (Spanning 2 Columns) */}
                          <div className="col-span-2 bg-slate-950/40 border border-white/5 p-2.5 rounded-2xl flex items-center justify-between px-4">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">LIVES REMAINING</span>
                            <div className="flex gap-1">
                              {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                  <Heart
                                    key={i}
                                    size={12}
                                    fill={i < lives ? '#ef4444' : 'transparent'}
                                    className={i < lives ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' : 'text-slate-700'}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Core Controls Stack */}
                        <div className="flex flex-col gap-2">
                          <motion.button
                            id="pause_btn_resume"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              audio.playClick();
                              setIsPaused(false);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 font-display font-black text-xs uppercase tracking-wider text-slate-950 rounded-2xl transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                          >
                            Resume Run
                          </motion.button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              id="pause_btn_restart"
                              onClick={handleRestartLevel}
                              className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-slate-200"
                            >
                              Restart
                            </button>

                            <button
                              id="pause_btn_levels"
                              onClick={() => {
                                audio.playClick();
                                setIsPaused(false);
                                setActiveScreen('levels_menu');
                              }}
                              className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-slate-200"
                            >
                              Campaign
                            </button>
                          </div>
                        </div>

                        {/* Divider Line */}
                        <div className="w-full h-[1px] bg-white/5 my-0.5" />

                        {/* Help / Ad Deck */}
                        <div className="flex flex-col gap-2">
                          {activeHint ? (
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center text-xs font-medium leading-relaxed text-blue-300 flex items-start gap-1.5 justify-center">
                              💡 <span>{activeHint}</span>
                            </div>
                          ) : (
                            <button
                              id="pause_btn_hint"
                              onClick={handleRevealHintAd}
                              className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 active:scale-98 border border-blue-500/20 text-blue-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Sparkles size={13} className="text-blue-400" /> Watch Ad for Hint
                            </button>
                          )}

                          <button
                            id="pause_btn_skip"
                            onClick={handleSkipLevelAd}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500/10 to-red-500/10 hover:from-amber-500/20 hover:to-red-500/20 active:scale-98 border border-amber-500/20 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <ArrowRight size={13} className="text-amber-400 animate-bounce" /> Skip Level with Ad
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Over Popup */}
                <AnimatePresence>
                  {showGameOver && !isWatchingAd && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none"
                    >
                      {/* Red pulse glow backdrop */}
                      <div className="absolute w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="glass-panel w-full max-w-sm rounded-3xl p-6 text-center border border-red-500/20 flex flex-col gap-5 shadow-2xl relative z-10 select-none"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase animate-pulse">
                            SPECTRUM COLLAPSED
                          </span>
                          <h2 className="text-2xl font-display font-bold text-white uppercase mt-0.5 max-w-[260px] mx-auto truncate">
                            GAME OVER
                          </h2>
                        </div>

                        {/* Broken Hearts visual indicator */}
                        <div className="flex gap-2.5 justify-center py-2 relative">
                          {Array(3)
                            .fill(null)
                            .map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.1, type: 'spring' }}
                              >
                                <Heart
                                  size={32}
                                  fill="transparent"
                                  className="text-slate-800"
                                />
                              </motion.div>
                            ))}
                          {/* Slashed lines on hearts or simple central skull / exclamation */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              0 LIVES LEFT
                            </span>
                          </div>
                        </div>

                        {/* Level Failure Info */}
                        <p className="text-xs text-slate-300 leading-relaxed max-w-[240px] mx-auto select-none">
                          You ran out of energy cores! Watch an ad to continue your run or restart the maze.
                        </p>

                        <div className="flex flex-col gap-2.5 mt-2">
                          {/* Watch Ad and Continue */}
                          <button
                            id="gameover_btn_watch_ad"
                            onClick={async () => {
                              audio.playClick();
                              const success = await AdsManager.showRewardedAd('revive');
                              if (success) {
                                setLives(3);
                                setShowGameOver(false);
                                startGameplayTimer();
                                audio.playUnlock();
                              }
                            }}
                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 font-display font-bold text-sm text-white rounded-xl shadow-lg shadow-red-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-red-400/20 active:scale-95"
                          >
                            <Sparkles size={14} className="animate-pulse" /> Watch Ad & Continue
                          </button>

                          {/* Restart Run */}
                          <button
                            id="gameover_btn_restart"
                            onClick={async () => {
                              audio.playClick();
                              await AdsManager.showInterstitialAd('game_over_retry');
                              handleRestartLevel();
                            }}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer select-none active:scale-95"
                          >
                            Restart Run
                          </button>

                          {/* Return Home / Levels */}
                          <button
                            id="gameover_btn_home"
                            onClick={() => {
                              audio.playClick();
                              setActiveScreen('levels_menu');
                            }}
                            className="text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 transition-all"
                          >
                            Return to Level Selection
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated Ad Playing Overlay */}
                <AnimatePresence>
                  {activeAd && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 select-none"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-panel w-full max-w-sm rounded-3xl p-6 text-center border border-white/10 flex flex-col gap-5 shadow-2xl relative z-10"
                      >
                        {/* Header banner */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-1.5 text-left">
                            <span className="px-1.5 py-0.5 bg-teal-500/10 border border-teal-500/30 rounded text-[8px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                              Sponsor
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-300">
                              {activeAd.placement.includes('poki') ? 'Poki Ad Network' :
                               activeAd.placement.includes('crazy') ? 'CrazyGames Ad' :
                               activeAd.placement.includes('gamedist') ? 'GameDistribution Ad' :
                               activeAd.placement.includes('y8') ? 'Y8 SDK Ad' : 'Global Ad Server'}
                            </span>
                          </div>

                          {/* Countdown progress circle / Close button */}
                          {adTimer > 0 ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                              <span>Ad playing...</span>
                              <span className="text-amber-400 font-bold px-1.5 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded font-mono">{adTimer}s</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                audio.playClick();
                                const ad = activeAd;
                                setActiveAd(null);
                                if (ad) ad.onAdComplete(true);
                              }}
                              className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-teal-500/20 active:scale-95 animate-pulse"
                            >
                              Skip Ad ✕
                            </button>
                          )}
                        </div>

                        {/* Interactive Game Demo Box */}
                        <div className="relative w-full aspect-video bg-slate-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 overflow-hidden group">
                          {/* Pulsing light */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/15 via-transparent to-blue-500/15 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
                          
                          <Sparkles size={28} className="text-teal-400 animate-spin [animation-duration:8s]" />

                          <div className="text-center z-10 px-4">
                            <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">
                              Color Shift Puzzle Adventure
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-normal">
                              Match color frequencies, slide past barricades, and master spatial matrices!
                            </p>
                          </div>

                          <button className="z-10 px-4 py-1.5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 font-display font-bold text-[10px] text-slate-950 rounded-lg shadow-lg shadow-teal-500/20 transition-all uppercase tracking-wider cursor-pointer active:scale-95">
                            Play Now
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-400 leading-normal flex flex-col gap-1">
                          <span className="font-semibold text-slate-300">
                            {activeAd.type === 'rewarded' ? '🏆 WATCH COMPLETE FOR MULTIPLIER REWARD 🏆' : 'Sponsored presentation keeps this game free!'}
                          </span>
                          <span>
                            {adTimer > 0 ? 'Your puzzle will load once the sponsor presentation completes.' : 'Click Skip Ad to continue.'}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeScreen === 'victory_screen' && currentLevel && runResults && (
            <motion.div
              key="victory_screen"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none z-50"
            >
              {/* Radial flare backdrop */}
              <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Victory Card */}
              <div className="glass-panel w-full max-w-sm rounded-3xl p-6 text-center border border-white/10 flex flex-col gap-5 shadow-2xl relative z-10 select-none">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                    MAZE COMPLETE
                  </span>
                  <h2 className="text-2xl font-display font-bold text-white uppercase mt-0.5 max-w-[260px] mx-auto truncate">
                    {currentLevel.name}
                  </h2>
                </div>

                {/* Stars Splash animations */}
                <div className="flex gap-2.5 justify-center py-2 relative">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.15, type: 'spring', stiffness: 200 }}
                      >
                        <Star
                          size={32}
                          fill={i < runResults.stars ? '#fbbf24' : 'transparent'}
                          className={i < runResults.stars ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'text-slate-800'}
                        />
                      </motion.div>
                    ))}
                </div>

                {/* Flawless prism badge */}
                {runResults.stars === 3 && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-wider mx-auto animate-pulse select-none">
                    <Sparkles size={11} fill="currentColor" /> FLAWLESS 3-STAR MATRIX
                  </div>
                )}

                {/* Rewards Panel */}
                <div className="flex flex-col gap-2 mx-auto w-full max-w-[280px]">
                  <div className="flex gap-4 items-center justify-center bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5">
                      <Coins size={14} className="text-amber-400 animate-pulse" />
                      <span className="text-sm font-mono font-black text-amber-300">+{runResults.coinsEarned}</span>
                      <span className="text-[10px] text-slate-300 uppercase font-mono">Coins</span>
                    </div>
                    <div className="text-white/20">|</div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-400" />
                      <span className="text-sm font-mono font-black text-blue-300">+{runResults.xpEarned}</span>
                      <span className="text-[10px] text-slate-300 uppercase font-mono font-bold">XP</span>
                    </div>
                  </div>

                  {!hasDoubleRewardWatched && (
                    <button
                      onClick={handleDoubleRewardAd}
                      className="py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-yellow-500/20 rounded-xl text-[11px] font-bold text-yellow-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none active:scale-95"
                    >
                      <Coins size={11} className="text-amber-400 animate-bounce" /> Watch Ad to Double Rewards!
                    </button>
                  )}

                  {(currentLevel.id === 3 || currentLevel.id === 8 || currentLevel.id === 15) && claimedMilestoneReward !== currentLevel.id && (
                    <div className="bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/25 p-2.5 rounded-xl flex flex-col gap-1 items-center">
                      <span className="text-[8px] font-mono font-bold text-purple-400 uppercase tracking-widest animate-pulse">Sponsor Milestone Bonus</span>
                      <span className="text-[10px] font-bold text-slate-200">
                        {currentLevel.id === 3 ? "Unlock Cosmic Star Skin & +500 Coins" : currentLevel.id === 8 ? "Unlock Rainbow Trail & +500 Coins" : "Unlock Cyberpunk Theme & +500 Coins"}
                      </span>
                      <button
                        onClick={handleClaimMilestoneAd}
                        className="mt-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Sparkles size={10} /> Watch Ad to Claim!
                      </button>
                    </div>
                  )}
                </div>

                {/* Unlocked Cosmetic Milestone banner */}
                {runResults.unlockedCosmetic && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col gap-1 items-center max-w-[280px] mx-auto"
                  >
                    <Trophy size={18} className="text-amber-400 animate-bounce" />
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest text-center">
                      COSMETIC MILESTONE UNLOCKED!
                    </span>
                    <span className="text-xs font-bold text-white uppercase text-center">
                      {runResults.unlockedCosmetic}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono text-center">
                      Equip it inside the Customizer Shop.
                    </span>
                  </motion.div>
                )}

                {/* Metrics detail table */}
                <div className="grid grid-cols-2 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                  <div>
                    <div className="text-xl font-mono font-bold text-white">{runResults.moves}</div>
                    <div className="text-[9px] text-slate-300 uppercase font-mono tracking-wide">
                      Moves (Goal: {currentLevel.targetMoves})
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-mono font-bold text-white">{runResults.time}s</div>
                    <div className="text-[9px] text-slate-300 uppercase font-mono tracking-wide">
                      Time (Goal: {currentLevel.targetTime}s)
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Retry Level */}
                    <button
                      id="vic_btn_retry"
                      onClick={() => {
                        audio.playClick();
                        launchLevel(currentLevel.id);
                      }}
                      className="py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer select-none active:scale-95"
                    >
                      Retry Run
                    </button>

                    {/* Show Leaderboard */}
                    <button
                      id="vic_btn_leaderboard"
                      onClick={() => {
                        audio.playClick();
                        setShowLeaderboard(true);
                      }}
                      className="py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer select-none active:scale-95"
                    >
                      <Trophy size={12} /> Rankings
                    </button>
                  </div>

                  {/* Continue Next Stage */}
                  <button
                    id="vic_btn_continue"
                    onClick={handleContinueNextLevel}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-display font-bold text-sm text-white rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-blue-400/20 active:scale-95"
                  >
                    Continue <ArrowRight size={14} />
                  </button>

                  {/* Return Home */}
                  <button
                    id="vic_btn_home"
                    onClick={() => {
                      audio.playClick();
                      setActiveScreen('main_menu');
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 py-1 transition-all"
                  >
                    Return to Lobby
                  </button>
                </div>
              </div>

              {/* Sub-leaderboard popdown */}
              <AnimatePresence>
                {showLeaderboard && (
                  <Leaderboard
                    levelId={currentLevel.id}
                    levelName={currentLevel.name}
                    targetMoves={currentLevel.targetMoves}
                    targetTime={currentLevel.targetTime}
                    playerScore={{
                      moves: runResults.moves,
                      time: runResults.time,
                      stars: runResults.stars,
                    }}
                    onClose={() => setShowLeaderboard(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isLuckySpinOpen && (
            <LuckySpin
              playerStats={playerStats}
              onUpdateStats={(stats) => {
                setPlayerStats(stats);
                localStorage.setItem('cs_maze_stats', JSON.stringify(stats));
              }}
              onClose={() => setIsLuckySpinOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
