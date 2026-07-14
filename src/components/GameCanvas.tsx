/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { GameColor, Level, Position, COLORS, MovingObstacleConfig, PlayerStats } from '../types';
import { audio } from '../audio';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface GameCanvasProps {
  level: Level;
  isPaused: boolean;
  onMoveCountChange: (moves: number) => void;
  onStarCollected: (count: number) => void;
  onLevelComplete: (moves: number, timeSpent: number, starsCount: number) => void;
  onRestartRequest: () => void;
  onPlayerHurt: () => void;
  playerStats: PlayerStats;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'spark' | 'confetti' | 'glow' | 'bubble';
}

interface TrailNode {
  x: number;
  y: number;
  color: string;
  alpha: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  isPaused,
  onMoveCountChange,
  onStarCollected,
  onLevelComplete,
  onRestartRequest,
  onPlayerHurt,
  playerStats,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core level state
  const [grid, setGrid] = useState<string[][]>([]);
  const [playerGridPos, setPlayerGridPos] = useState<Position>({ x: 0, y: 0 });
  const [playerColor, setPlayerColor] = useState<GameColor>('red');
  const [collectedStarsCount, setCollectedStarsCount] = useState(0);
  const [totalStarsInLevel, setTotalStarsInLevel] = useState(0);
  const [keysHeld, setKeysHeld] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const movesCountRef = useRef(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Time tracking
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  // Animation & Physics states
  const playerPixelPos = useRef({ x: 0, y: 0 });
  const playerTargetPos = useRef({ x: 0, y: 0 });
  const playerScale = useRef({ x: 1, y: 1 }); // squash / stretch
  const playerTrail = useRef<TrailNode[]>([]);
  const particles = useRef<Particle[]>([]);
  const teleporterCooldowns = useRef<Record<string, number>>({}); // Cooldown counter per teleporter key

  // Moving obstacles state (run-time positions)
  const obstaclesState = useRef<{ id: string; x: number; y: number; progress: number; direction: number }[]>([]);

  // Screen shake
  const shakeIntensity = useRef(0);

  // Camera offsets for smooth kinetic follow & lead
  const cameraOffset = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef({ x: 0, y: 0 });

  // Input states
  const isMoving = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastMoveDir = useRef<Position | null>(null);
  const moveStartPosRef = useRef({ x: 0, y: 0 });
  const moveStartTimeRef = useRef(0);
  const bufferedInput = useRef<{ dx: number; dy: number } | null>(null);

  // Layout metrics
  const [tileSize, setTileSize] = useState(40);
  const [canvasWidth, setCanvasWidth] = useState(400);
  const [canvasHeight, setCanvasHeight] = useState(400);

  // Initialize Level
  useEffect(() => {
    // Reset core states
    const initialGrid = level.grid.map(row => [...row]);
    setGrid(initialGrid);
    setPlayerGridPos({ ...level.startPos });
    setPlayerColor(level.startColor);
    setCollectedStarsCount(0);
    setKeysHeld(0);
    movesCountRef.current = 0;
    setMovesCount(0);
    setIsCompleted(false);
    onMoveCountChange(0);
    onStarCollected(0);

    // Count total stars
    let stars = 0;
    initialGrid.forEach(row => {
      row.forEach(cell => {
        if (cell === 'S') stars++;
      });
    });
    setTotalStarsInLevel(stars);

    // Position setup
    playerGridPosRef.current = { ...level.startPos };
    playerPixelPos.current = { x: level.startPos.x, y: level.startPos.y };
    playerTargetPos.current = { x: level.startPos.x, y: level.startPos.y };
    moveStartPosRef.current = { x: level.startPos.x, y: level.startPos.y };
    moveStartTimeRef.current = 0;
    bufferedInput.current = null;
    playerTrail.current = [];
    particles.current = [];
    isMoving.current = false;
    cameraOffset.current = { x: 0, y: 0 };
    cameraTarget.current = { x: 0, y: 0 };
    startTimeRef.current = Date.now();
    elapsedRef.current = 0;

    // Reset obstacles state
    if (level.obstacles) {
      obstaclesState.current = level.obstacles.map(obs => ({
        id: obs.id,
        x: obs.path[0].x,
        y: obs.path[0].y,
        progress: 0,
        direction: 1,
      }));
    } else {
      obstaclesState.current = [];
    }

    // Spawn entrance ripple particles
    spawnShiftParticles(level.startPos.x, level.startPos.y, level.startColor);

  }, [level]);

  // Keep a ref of player grid position to bypass closure lock in event listeners
  const playerGridPosRef = useRef<Position>({ x: 0, y: 0 });
  useEffect(() => {
    playerGridPosRef.current = playerGridPos;
  }, [playerGridPos]);

  // Handle Resize beautifully
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current || grid.length === 0) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const gridCols = grid[0].length;
      const gridRows = grid.length;

      // Compute tile size to fit both dimension constraint
      const maxTileW = Math.floor(containerWidth / gridCols);
      const maxTileH = Math.floor(containerHeight / gridRows);
      const computedTile = Math.max(28, Math.min(60, maxTileW, maxTileH));

      setTileSize(computedTile);
      setCanvasWidth(gridCols * computedTile);
      setCanvasHeight(gridRows * computedTile);
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    handleResize();

    return () => {
      observer.disconnect();
    };
  }, [grid]);

  // Screen shake trigger
  const triggerShake = (intensity: number) => {
    shakeIntensity.current = intensity;
  };

  // Particles generator
  const spawnShiftParticles = (gx: number, gy: number, colorKey: GameColor, count = 25) => {
    const colorHex = COLORS[colorKey].hex;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      particles.current.push({
        x: gx + 0.5,
        y: gy + 0.5,
        vx: Math.cos(angle) * speed * 0.05,
        vy: Math.sin(angle) * speed * 0.05,
        color: colorHex,
        size: 3 + Math.random() * 5,
        alpha: 1,
        life: 0,
        maxLife: 30 + Math.random() * 30,
        type: 'spark',
      });
    }
  };

  const spawnConfetti = (gx: number, gy: number, count = 60) => {
    const palette = Object.values(COLORS).map(c => c.hex);
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 4 - Math.random() * Math.PI / 2; // Spray upwards
      const speed = 2.0 + Math.random() * 6.0;
      particles.current.push({
        x: gx + 0.5,
        y: gy + 0.5,
        vx: Math.cos(angle) * speed * 0.06,
        vy: Math.sin(angle) * speed * 0.06,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 4 + Math.random() * 6,
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        type: 'confetti',
      });
    }
  };

  const spawnKeyCollectionParticles = (gx: number, gy: number) => {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.0;
      particles.current.push({
        x: gx + 0.5,
        y: gy + 0.5,
        vx: Math.cos(angle) * speed * 0.04,
        vy: Math.sin(angle) * speed * 0.04,
        color: '#ffcc00', // Gold sparkles
        size: 2.5 + Math.random() * 4,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 20,
        type: 'spark',
      });
    }
  };

  // Movement Logic
  const initiateMove = (dx: number, dy: number) => {
    if (isPaused || isCompleted) return;

    if (isMoving.current) {
      // Buffer any input pressed during active sliding animation to queue it instantly
      bufferedInput.current = { dx, dy };
      return;
    }

    const curPos = playerGridPosRef.current;
    const targetX = curPos.x + dx;
    const targetY = curPos.y + dy;

    // Boundary check
    if (targetY < 0 || targetY >= grid.length || targetX < 0 || targetX >= grid[0].length) {
      return;
    }

    const cell = grid[targetY][targetX];

    // Gate matching constraints
    const isRedGateBlocked = cell === 'r' && playerColor !== 'red';
    const isGreenGateBlocked = cell === 'g' && playerColor !== 'green';
    const isBlueGateBlocked = cell === 'b' && playerColor !== 'blue';
    const isYellowGateBlocked = cell === 'y' && playerColor !== 'yellow';
    const isPurpleGateBlocked = cell === 'p' && playerColor !== 'purple';
    const isOrangeGateBlocked = cell === 'o' && playerColor !== 'orange';

    const isGateBlocked = isRedGateBlocked || isGreenGateBlocked || isBlueGateBlocked || isYellowGateBlocked || isPurpleGateBlocked || isOrangeGateBlocked;

    // Check collision
    const isWall = cell === '#';
    const isDoorLocked = cell === 'D' && keysHeld <= 0;

    if (isWall || isGateBlocked || isDoorLocked) {
      // Squash effect into collision direction
      playerScale.current = {
        x: dx !== 0 ? 0.75 : 1.15,
        y: dy !== 0 ? 0.75 : 1.15,
      };
      triggerShake(1.5);
      audio.playBlocked();
      return;
    }

    // Valid move! Unlock locked door instantly
    if (cell === 'D' && keysHeld > 0) {
      const updatedGrid = grid.map(row => [...row]);
      updatedGrid[targetY][targetX] = '.'; // Unlock door
      setGrid(updatedGrid);
      setKeysHeld(prev => prev - 1);
      audio.playUnlock();
      spawnKeyCollectionParticles(targetX, targetY);
      triggerShake(0.8);
    }

    // Set movement targets and start reference metrics
    moveStartPosRef.current = { x: curPos.x, y: curPos.y };
    moveStartTimeRef.current = performance.now();
    playerTargetPos.current = { x: targetX, y: targetY };
    isMoving.current = true;
    lastMoveDir.current = { x: dx, y: dy };

    // Register move counter
    movesCountRef.current += 1;
    setMovesCount(movesCountRef.current);
    onMoveCountChange(movesCountRef.current);

    // Save node trail
    playerTrail.current.unshift({
      x: curPos.x,
      y: curPos.y,
      color: COLORS[playerColor].hex,
      alpha: 0.6,
    });
    if (playerTrail.current.length > 5) playerTrail.current.pop();
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isCompleted) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          initiateMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          initiateMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          initiateMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          initiateMove(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, playerColor, keysHeld, isPaused, isCompleted]);

  // Swipe controls helper
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPaused || isCompleted) return;
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || isPaused || isCompleted) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const minSwipeDist = 30; // Min px threshold
    if (Math.max(absX, absY) > minSwipeDist) {
      if (absX > absY) {
        // Horizontal
        initiateMove(dx > 0 ? 1 : -1, 0);
      } else {
        // Vertical
        initiateMove(0, dy > 0 ? 1 : -1);
      }
    }
    touchStart.current = null;
  };

  // Run loops for game physics & render frame (RequestAnimationFrame)
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      if (isPaused || grid.length === 0) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(gameLoop);
        return;
      }

      // --- 1. PHYSICS UPDATE ---

      if (isMoving.current) {
        const now = performance.now();
        const elapsed = now - moveStartTimeRef.current;
        const duration = 130; // ms (within the 120ms - 180ms range for extreme snap)
        const t = Math.min(1, elapsed / duration);
        const easedT = 1 - Math.pow(1 - t, 3); // Ease-Out Cubic

        playerPixelPos.current.x = moveStartPosRef.current.x + (playerTargetPos.current.x - moveStartPosRef.current.x) * easedT;
        playerPixelPos.current.y = moveStartPosRef.current.y + (playerTargetPos.current.y - moveStartPosRef.current.y) * easedT;

        // Decelerating spring oscillation on squash scales
        playerScale.current.x += (1 - playerScale.current.x) * 0.15;
        playerScale.current.y += (1 - playerScale.current.y) * 0.15;

        // Snapping check when animation completes
        if (t >= 1) {
          playerPixelPos.current = { ...playerTargetPos.current };
          setPlayerGridPos({ ...playerTargetPos.current });
          isMoving.current = false;

          // Process triggers upon arriving exactly at the target cell
          handleCellArrival(playerTargetPos.current.x, playerTargetPos.current.y);

          // Consume buffered input instantly if present
          if (bufferedInput.current) {
            const nextMove = bufferedInput.current;
            bufferedInput.current = null;
            initiateMove(nextMove.dx, nextMove.dy);
          }
        }
      } else {
        // Recover scale
        playerScale.current.x += (1 - playerScale.current.x) * 0.15;
        playerScale.current.y += (1 - playerScale.current.y) * 0.15;
      }

      // Kinetic camera lead-ahead calculation
      if (isMoving.current && lastMoveDir.current) {
        cameraTarget.current.x = lastMoveDir.current.x * 0.12;
        cameraTarget.current.y = lastMoveDir.current.y * 0.12;
      } else {
        cameraTarget.current.x = 0;
        cameraTarget.current.y = 0;
      }
      cameraOffset.current.x += (cameraTarget.current.x - cameraOffset.current.x) * 0.12;
      cameraOffset.current.y += (cameraTarget.current.y - cameraOffset.current.y) * 0.12;

      // Cooldown timer reduction
      Object.keys(teleporterCooldowns.current).forEach(key => {
        if (teleporterCooldowns.current[key] > 0) {
          teleporterCooldowns.current[key] -= 16.6; // ~1 frame in ms
        }
      });

      // Moving obstacles kinematics
      if (level.obstacles && obstaclesState.current.length > 0) {
        level.obstacles.forEach((obs, idx) => {
          const state = obstaclesState.current[idx];
          const path = obs.path;
          if (path.length < 2) return;

          // Compute distance along path segments
          state.progress += (obs.speed * 0.01) * state.direction;

          if (state.progress >= path.length - 1) {
            state.progress = path.length - 1;
            state.direction = -1; // Reverse
          } else if (state.progress <= 0) {
            state.progress = 0;
            state.direction = 1; // Reverse
          }

          // Compute exact x, y in grid coordinates
          const segmentIndex = Math.floor(state.progress);
          const t = state.progress - segmentIndex;
          const startSeg = path[segmentIndex];
          const endSeg = path[Math.min(path.length - 1, segmentIndex + 1)];

          state.x = startSeg.x + (endSeg.x - startSeg.x) * t;
          state.y = startSeg.y + (endSeg.y - startSeg.y) * t;

          // Collision check against current player pixel position
          const dx = playerPixelPos.current.x - state.x;
          const dy = playerPixelPos.current.y - state.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Standard size of obstacle and player is approx 0.8 cell size, collision radius ~0.65
          if (dist < 0.65 && !isCompleted) {
            handleObstacleCrash();
          }
        });
      }

      // Update screen shake
      if (shakeIntensity.current > 0.05) {
        shakeIntensity.current *= 0.9;
      } else {
        shakeIntensity.current = 0;
      }

      // Update particles
      particles.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - (p.life / p.maxLife);
      });
      // Filter dead particles
      particles.current = particles.current.filter(p => p.life < p.maxLife);

      // Generate ambient sparkles near portal (E), stars (S), and keys (K) to boost game feel
      if (Math.random() < 0.12 && !isCompleted) {
        const candidates: Position[] = [];
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            if (['S', 'E', 'K', '1', '2', '3', '4'].includes(grid[y][x])) {
              candidates.push({ x, y });
            }
          }
        }
        if (candidates.length > 0) {
          const target = candidates[Math.floor(Math.random() * candidates.length)];
          const cellType = grid[target.y][target.x];
          // color selection based on element type
          let color = '#fbbf24'; // Star gold
          if (cellType === 'E') color = '#a855f7'; // Portal violet
          else if (['1', '2', '3', '4'].includes(cellType)) color = '#06b6d4'; // Teleporter cyan
          else if (cellType === 'K') color = '#fbbf24'; // Key amber

          particles.current.push({
            x: target.x + 0.1 + Math.random() * 0.8,
            y: target.y + 0.1 + Math.random() * 0.8,
            vx: (Math.random() - 0.5) * 0.015,
            vy: -0.01 - Math.random() * 0.02, // Drift upwards slowly
            color,
            size: 1.5 + Math.random() * 2.5,
            alpha: 1,
            life: 0,
            maxLife: 35 + Math.random() * 25,
            type: 'glow',
          });
        }
      }

      // --- 2. RENDER LOOP ---
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Resolve Active Theme Cosmetics
      const activeTheme = playerStats?.activeTheme || 'slate';
      let floorColor = '#1e293b';
      let wallColor = '#0f172a';
      let wallBorderColor = '#1e293b';
      let cellBorderColor = 'rgba(255, 255, 255, 0.02)';

      if (activeTheme === 'neon') {
        floorColor = '#030712';
        wallColor = '#0b0f19';
        wallBorderColor = '#06b6d4';
        cellBorderColor = 'rgba(6, 182, 212, 0.1)';
      } else if (activeTheme === 'royal') {
        floorColor = '#11071c';
        wallColor = '#1d0c2b';
        wallBorderColor = '#d97706';
        cellBorderColor = 'rgba(217, 119, 6, 0.15)';
      } else if (activeTheme === 'cyber') {
        floorColor = '#05020c';
        wallColor = '#11071c';
        wallBorderColor = '#ec4899';
        cellBorderColor = 'rgba(236, 72, 153, 0.15)';
      } else if (activeTheme === 'forest_theme') {
        floorColor = '#14532d';
        wallColor = '#052e16';
        wallBorderColor = '#22c55e';
        cellBorderColor = 'rgba(34, 197, 94, 0.05)';
      } else if (activeTheme === 'desert_theme') {
        floorColor = '#7c2d12';
        wallColor = '#451a03';
        wallBorderColor = '#f97316';
        cellBorderColor = 'rgba(249, 115, 22, 0.05)';
      } else if (activeTheme === 'snow_theme') {
        floorColor = '#0f172a';
        wallColor = '#1e293b';
        wallBorderColor = '#38bdf8';
        cellBorderColor = 'rgba(56, 189, 248, 0.05)';
      } else if (activeTheme === 'ancient_theme') {
        floorColor = '#1c1917';
        wallColor = '#0c0a09';
        wallBorderColor = '#78716c';
        cellBorderColor = 'rgba(120, 113, 108, 0.05)';
      } else if (activeTheme === 'night_theme') {
        floorColor = '#020617';
        wallColor = '#090d16';
        wallBorderColor = '#475569';
        cellBorderColor = 'rgba(71, 85, 105, 0.05)';
      } else if (activeTheme === 'space_theme') {
        floorColor = '#1e1b4b';
        wallColor = '#0f0b29';
        wallBorderColor = '#8b5cf6';
        cellBorderColor = 'rgba(139, 92, 246, 0.05)';
      }

      // Render Screen Shake Offsets
      ctx.save();
      if (shakeIntensity.current > 0) {
        const shakeX = (Math.random() - 0.5) * shakeIntensity.current * 10;
        const shakeY = (Math.random() - 0.5) * shakeIntensity.current * 10;
        ctx.translate(shakeX, shakeY);
      }

      // Apply kinetic camera shift for dynamic juice & smooth movement leading
      ctx.translate(cameraOffset.current.x * tileSize, cameraOffset.current.y * tileSize);

      // Draw Floor Background tiles
      const activeTile = playerStats?.activeTile || 'tile_standard';
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          const type = grid[y][x];
          const px = x * tileSize;
          const py = y * tileSize;

          if (type !== '#') {
            // Draw floor slot with subtle glassmorphism overlay grid
            ctx.fillStyle = floorColor;
            ctx.fillRect(px + 1, py + 1, tileSize - 2, tileSize - 2);

            // Draw custom tile design
            if (activeTile === 'tile_grid') {
              ctx.strokeStyle = cellBorderColor;
              ctx.lineWidth = 1;
              ctx.strokeRect(px + 3, py + 3, tileSize - 6, tileSize - 6);
            } else if (activeTile === 'tile_diamond') {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
              ctx.beginPath();
              ctx.moveTo(px + tileSize / 2, py + 4);
              ctx.lineTo(px + tileSize - 4, py + tileSize / 2);
              ctx.lineTo(px + tileSize / 2, py + tileSize - 4);
              ctx.lineTo(px + 4, py + tileSize / 2);
              ctx.closePath();
              ctx.fill();
            } else if (activeTile === 'tile_tech') {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(px + tileSize / 2, py + 2);
              ctx.lineTo(px + tileSize / 2, py + tileSize - 2);
              ctx.moveTo(px + 2, py + tileSize / 2);
              ctx.lineTo(px + tileSize - 2, py + tileSize / 2);
              ctx.stroke();
              ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
              ctx.beginPath();
              ctx.arc(px + tileSize / 2, py + tileSize / 2, 2.5, 0, Math.PI * 2);
              ctx.fill();
            } else if (activeTile === 'tile_brick') {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(px, py + tileSize / 2);
              ctx.lineTo(px + tileSize, py + tileSize / 2);
              ctx.moveTo(px + tileSize / 2, py);
              ctx.lineTo(px + tileSize / 2, py + tileSize / 2);
              ctx.moveTo(px + tileSize / 4, py + tileSize / 2);
              ctx.lineTo(px + tileSize / 4, py + tileSize);
              ctx.moveTo(px + 3 * tileSize / 4, py + tileSize / 2);
              ctx.lineTo(px + 3 * tileSize / 4, py + tileSize);
              ctx.stroke();
            } else if (activeTile === 'tile_hologram') {
              const holoGrad = ctx.createLinearGradient(px, py, px + tileSize, py + tileSize);
              holoGrad.addColorStop(0, 'rgba(6, 182, 212, 0.03)');
              holoGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.03)');
              holoGrad.addColorStop(1, 'rgba(168, 85, 247, 0.03)');
              ctx.fillStyle = holoGrad;
              ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
            } else if (activeTile === 'tile_runes') {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
              ctx.font = '8px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const runes = ['ᛖ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ'];
              const rune = runes[(x * 7 + y * 13) % runes.length];
              ctx.fillText(rune, px + tileSize / 2, py + tileSize / 2);
            } else if (activeTile === 'tile_honeycomb') {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              const r = tileSize * 0.45;
              const cx = px + tileSize / 2;
              const cy = py + tileSize / 2;
              for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = cx + Math.cos(angle) * r;
                const hy = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
              }
              ctx.closePath();
              ctx.stroke();
            } else if (activeTile === 'tile_crystal') {
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
              ctx.lineWidth = 0.75;
              ctx.beginPath();
              ctx.moveTo(px + 2, py + 2);
              ctx.lineTo(px + tileSize - 4, py + tileSize - 2);
              ctx.moveTo(px + tileSize - 2, py + 4);
              ctx.lineTo(px + 4, py + tileSize - 4);
              ctx.stroke();
            } else if (activeTile === 'tile_royal') {
              ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
              ctx.lineWidth = 1.5;
              ctx.strokeRect(px + 3, py + 3, tileSize - 6, tileSize - 6);
              ctx.fillStyle = 'rgba(217, 119, 6, 0.05)';
              ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
            }

            // Draw faint cell borders
            ctx.strokeStyle = cellBorderColor;
            ctx.strokeRect(px, py, tileSize, tileSize);
          }
        }
      }

      // Draw Maze Features (Pads, Gates, Items, Portals)
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          const cell = grid[y][x];
          const px = x * tileSize;
          const py = y * tileSize;

          if (cell === '#') {
            // Rounded Wall block
            ctx.fillStyle = wallColor;
            ctx.fillRect(px, py, tileSize, tileSize);

            // Border stroke
            ctx.strokeStyle = wallBorderColor;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          } else if (cell === 'E') {
            // Active Exit Portal swirling vortex
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            const radius = tileSize * 0.42;
            const time = Date.now() * 0.003;

            // Swirling rings
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(time);

            // Glowing base
            const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius);
            grad.addColorStop(0, '#a855f7');
            grad.addColorStop(0.5, '#3b82f6');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            // Intersecting swirling lines
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.moveTo(0, 0);
              ctx.quadraticCurveTo(radius * 0.5, radius * 0.5, radius, 0);
            }
            ctx.stroke();
            ctx.restore();
          } else if (['R', 'G', 'B', 'Y', 'P', 'O'].includes(cell)) {
            // Color Shift Pads (Glowing landing pads)
            let colorKey: GameColor = 'red';
            if (cell === 'G') colorKey = 'green';
            if (cell === 'B') colorKey = 'blue';
            if (cell === 'Y') colorKey = 'yellow';
            if (cell === 'P') colorKey = 'purple';
            if (cell === 'O') colorKey = 'orange';

            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            const radius = tileSize * 0.35;
            const colorHex = COLORS[colorKey].hex;

            // Draw glowing outer ring
            ctx.strokeStyle = colorHex;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Inner flashing core
            ctx.fillStyle = `rgba(${hexToRgb(colorHex)}, ${0.15 + Math.sin(Date.now() * 0.005) * 0.08})`;
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
            ctx.fill();

            // Center glowing core point
            ctx.fillStyle = colorHex;
            ctx.beginPath();
            ctx.arc(cx, cy, 4 + Math.sin(Date.now() * 0.008) * 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (['r', 'g', 'b', 'y', 'p', 'o'].includes(cell)) {
            // Gate Barriers (Red, Green, Blue, etc.)
            let gateColor: GameColor = 'red';
            if (cell === 'g') gateColor = 'green';
            if (cell === 'b') gateColor = 'blue';
            if (cell === 'y') gateColor = 'yellow';
            if (cell === 'p') gateColor = 'purple';
            if (cell === 'o') gateColor = 'orange';

            const colorHex = COLORS[gateColor].hex;
            const isMatch = playerColor === gateColor;

            ctx.save();
            ctx.translate(px, py);

            if (isMatch) {
              // Open state: Draw open side arches with neon glowing green indicator
              ctx.strokeStyle = `rgba(${hexToRgb(colorHex)}, 0.25)`;
              ctx.lineWidth = 2;
              ctx.strokeRect(4, 4, tileSize - 8, tileSize - 8);

              // Little neon dots inside
              ctx.fillStyle = colorHex;
              ctx.beginPath();
              ctx.arc(4, tileSize/2, 2.5, 0, Math.PI*2);
              ctx.arc(tileSize - 4, tileSize/2, 2.5, 0, Math.PI*2);
              ctx.fill();
            } else {
              // Blocked state: Solid brick barrier with neon hazard lines
              ctx.fillStyle = `rgba(${hexToRgb(colorHex)}, 0.15)`;
              ctx.fillRect(3, 3, tileSize - 6, tileSize - 6);

              ctx.strokeStyle = colorHex;
              ctx.lineWidth = 3;
              ctx.strokeRect(3, 3, tileSize - 6, tileSize - 6);

              // Draw heavy barricade line
              ctx.beginPath();
              ctx.moveTo(3, 3);
              ctx.lineTo(tileSize - 3, tileSize - 3);
              ctx.moveTo(tileSize - 3, 3);
              ctx.lineTo(3, tileSize - 3);
              ctx.stroke();
            }
            ctx.restore();
          } else if (cell === 'S') {
            // Pulsating gold Collectible Star
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            const scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.1;
            
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            drawStarIcon(ctx, 0, 0, 5, tileSize * 0.3, tileSize * 0.13, '#ffcc00');
            ctx.restore();
          } else if (cell === 'K') {
            // floating brass Key icon
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2 + Math.sin(Date.now() * 0.006) * 3;

            ctx.save();
            ctx.translate(cx, cy);
            // Draw Key vector
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.5;

            // Key Head
            ctx.beginPath();
            ctx.arc(-4, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Key shaft & teeth
            ctx.beginPath();
            ctx.moveTo(1, 0);
            ctx.lineTo(11, 0);
            ctx.lineTo(11, 4);
            ctx.lineTo(9, 4);
            ctx.lineTo(9, 0);
            ctx.lineTo(7, 0);
            ctx.lineTo(7, 4);
            ctx.lineTo(5, 4);
            ctx.lineTo(5, 0);
            ctx.stroke();
            ctx.restore();
          } else if (cell === 'D') {
            // Locked Door (glass pane with a padlock symbol)
            ctx.save();
            ctx.translate(px, py);

            // Translucent glass block
            ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
            ctx.fillRect(4, 4, tileSize - 8, tileSize - 8);

            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(4, 4, tileSize - 8, tileSize - 8);

            // Lock core symbol
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(tileSize / 2, tileSize / 2, 4, 0, Math.PI * 2);
            ctx.fill();

            // Shackle
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(tileSize / 2, tileSize / 2 - 3, 3, Math.PI, 0);
            ctx.stroke();
            ctx.restore();
          } else if (cell === 'd') {
            // Toggled Door (OPEN)
            ctx.save();
            ctx.translate(px, py);
            ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(6, 6, tileSize - 12, tileSize - 12);
            ctx.restore();
          } else if (cell === 'X') {
            // Static Spikes
            ctx.save();
            ctx.translate(px, py);
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#7f1d1d';
            ctx.lineWidth = 1.5;

            // Draw 4 spike cones
            const spikeW = tileSize / 4;
            for (let i = 0; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(i * spikeW, tileSize - 2);
              ctx.lineTo(i * spikeW + spikeW/2, tileSize * 0.3);
              ctx.lineTo((i + 1) * spikeW, tileSize - 2);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();
          } else if (cell === 't') {
            // Pressure plate 't'
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            const radius = tileSize * 0.32;

            ctx.fillStyle = '#64748b';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner circle plate
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
            ctx.fill();
          } else if (['1', '2', '3', '4'].includes(cell)) {
            // Teleporters (Glowing sci-fi portals)
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            const radius = tileSize * 0.38;
            const time = Date.now() * 0.005;

            // Spiral halo
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-time);

            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2;
            ctx.strokeRect(-radius/2, -radius/2, radius, radius);

            ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
            ctx.beginPath();
            ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
            ctx.fill();

            // Central Portal code number
            ctx.fillStyle = '#22d3ee';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cell, 0, 0);

            ctx.restore();
          }
        }
      }

      // Draw Player Node Trail (Pre-render fade nodes)
      const activeTrail = playerStats?.activeTrail || 'default';
      playerTrail.current.forEach((node, idx) => {
        const opacity = node.alpha * (1 - idx / playerTrail.current.length);
        if (opacity <= 0.05) return;

        const tx = node.x * tileSize + tileSize / 2;
        const ty = node.y * tileSize + tileSize / 2;
        const size = (tileSize * 0.34) * (1 - idx / playerTrail.current.length);

        if (activeTrail === 'ghost') {
          // Rounded square traces
          ctx.fillStyle = node.color;
          ctx.globalAlpha = opacity * 0.65;
          ctx.beginPath();
          ctx.roundRect(tx - size, ty - size, size * 2, size * 2, 5);
          ctx.fill();
        } else if (activeTrail === 'sparkle' || activeTrail === 'star_trail') {
          // Golden sparkle stars
          ctx.save();
          ctx.translate(tx, ty);
          ctx.globalAlpha = opacity;
          drawStarIcon(ctx, 0, 0, 4, size * 1.3, size * 0.45, '#fbbf24');
          ctx.restore();
        } else if (activeTrail === 'rainbow' || activeTrail === 'prism_trail') {
          // Hue cycling stream
          const hue = (idx * 30 + Date.now() * 0.1) % 360;
          ctx.fillStyle = `hsla(${hue}, 95%, 60%, 1)`;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'matrix') {
          // Binary matrix text stream
          ctx.fillStyle = '#22c55e';
          ctx.font = `bold ${Math.max(8, size * 1.5)}px monospace`;
          ctx.globalAlpha = opacity;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((idx % 2 === 0 ? '1' : '0'), tx, ty);
        } else if (activeTrail === 'smoke') {
          // Grey smoke puffs
          ctx.fillStyle = '#64748b';
          ctx.globalAlpha = opacity * 0.5;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 1.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'leaves') {
          // Orange autumn leaves
          ctx.fillStyle = '#f97316';
          ctx.globalAlpha = opacity;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(idx * 45);
          ctx.beginPath();
          ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (activeTrail === 'snow') {
          // White ice crystals
          ctx.fillStyle = '#e0f2fe';
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'cloud') {
          // Fluffy white clouds
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = opacity * 0.65;
          ctx.beginPath();
          ctx.arc(tx - size/2, ty, size, 0, Math.PI * 2);
          ctx.arc(tx + size/2, ty, size, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'fire_trail') {
          // Warm fiery sparks
          ctx.fillStyle = '#ef4444';
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'ice_trail') {
          // Sub-zero frosty trails
          ctx.fillStyle = '#0ea5e9';
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'pixel_trail') {
          // 8-bit retro gaming blocks
          ctx.fillStyle = node.color;
          ctx.globalAlpha = opacity;
          ctx.fillRect(tx - size, ty - size, size * 2, size * 2);
        } else if (activeTrail === 'hearts') {
          // Cute pink hearts
          ctx.fillStyle = '#ec4899';
          ctx.globalAlpha = opacity;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.beginPath();
          ctx.moveTo(0, -size/2);
          ctx.bezierCurveTo(-size, -size, -size, size/2, 0, size);
          ctx.bezierCurveTo(size, size/2, size, -size, 0, -size/2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (activeTrail === 'electric' || activeTrail === 'laser') {
          // Neon cyan lightning lines
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 2;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(tx - size, ty + (Math.random() - 0.5) * size);
          ctx.lineTo(tx, ty + (Math.random() - 0.5) * size);
          ctx.lineTo(tx + size, ty + (Math.random() - 0.5) * size);
          ctx.stroke();
        } else if (activeTrail === 'magic') {
          // Magical purple spark nodes
          ctx.fillStyle = '#a855f7';
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'comet') {
          // Bright comet trail nodes
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = opacity * 0.9;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 0.75, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeTrail === 'shadow_trail') {
          // Eerie dark shadow blobs
          ctx.fillStyle = '#0f172a';
          ctx.globalAlpha = opacity * 0.8;
          ctx.beginPath();
          ctx.arc(tx, ty, size * 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Default soft fading circles
          ctx.fillStyle = node.color;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(tx, ty, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0; // Reset alpha

      // Draw Player Node
      const pPixelX = playerPixelPos.current.x * tileSize + tileSize / 2;
      const pPixelY = playerPixelPos.current.y * tileSize + tileSize / 2;
      const playerSize = tileSize * 0.36;

      ctx.save();
      ctx.translate(pPixelX, pPixelY);

      // Apply squash and stretch physics
      ctx.scale(playerScale.current.x, playerScale.current.y);

      const pColorHex = COLORS[playerColor].hex;

      // Outer color shadow glow
      const outerGlowGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, playerSize * 1.5);
      outerGlowGrad.addColorStop(0, `rgba(${hexToRgb(pColorHex)}, 0.6)`);
      outerGlowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, playerSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      const activeSkin = playerStats?.activeSkin || 'cube';

      if (activeSkin === 'sphere') {
        // Luminous Sphere (gradient 3D ball)
        const ballGrad = ctx.createRadialGradient(-playerSize * 0.3, -playerSize * 0.3, 2, 0, 0, playerSize);
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.2, pColorHex);
        ballGrad.addColorStop(1, `rgba(${hexToRgb(pColorHex)}, 0.8)`);
        
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, playerSize, 0, Math.PI * 2);
        ctx.fill();

        // White border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, playerSize, 0, Math.PI * 2);
        ctx.stroke();

        // Sparkle core point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'gem') {
        // Prism Octahedron (slow rotating crystal prism)
        ctx.rotate(Date.now() * 0.0035);

        ctx.fillStyle = pColorHex;
        ctx.beginPath();
        ctx.moveTo(0, -playerSize * 1.25);
        ctx.lineTo(playerSize * 1.25, 0);
        ctx.lineTo(0, playerSize * 1.25);
        ctx.lineTo(-playerSize * 1.25, 0);
        ctx.closePath();
        ctx.fill();

        // 3D faces shading lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, -playerSize * 1.25);
        ctx.lineTo(0, playerSize * 1.25);
        ctx.moveTo(-playerSize * 1.25, 0);
        ctx.lineTo(playerSize * 1.25, 0);
        ctx.stroke();

        // Main white border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -playerSize * 1.25);
        ctx.lineTo(playerSize * 1.25, 0);
        ctx.lineTo(0, playerSize * 1.25);
        ctx.lineTo(-playerSize * 1.25, 0);
        ctx.closePath();
        ctx.stroke();

        // Sparkling center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'cyber_eye') {
        // AI Sentinel core scanner eye
        ctx.strokeStyle = pColorHex;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, playerSize, 0, Math.PI * 2);
        ctx.stroke();

        // Inner camera ring
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, playerSize * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        // AI central pupil scanner
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5 + Math.sin(Date.now() * 0.012) * 1.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'star_cube') {
        // Star cube (cosmic star-shaped entity)
        ctx.rotate(Date.now() * 0.001);

        // draw star body
        drawStarIcon(ctx, 0, 0, 5, playerSize * 1.3, playerSize * 0.55, pColorHex);

        // Outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const outerR = playerSize * 1.3;
        const innerR = playerSize * 0.55;
        const cx = 0, cy = 0, spikes = 5;
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerR;
          y = cy + Math.sin(rot) * outerR;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerR;
          y = cy + Math.sin(rot) * innerR;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerR);
        ctx.closePath();
        ctx.stroke();

        // Inner glowing spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'shadow') {
        // Shadow Cube
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.stroke();

        // glowing core purple
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(0, 0, 4 + Math.sin(Date.now() * 0.006) * 1.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'robot') {
        // Robot Sentry
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(-playerSize + 3, -playerSize + 3, playerSize * 2 - 6, playerSize * 2 - 6);

        // Robot camera scan visor
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-playerSize + 4, -4, playerSize * 2 - 8, 8);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(Math.sin(Date.now() * 0.005) * (playerSize - 8), 0, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'knight') {
        // Iron Knight
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.stroke();

        // Visor slit
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-playerSize + 6, -3, playerSize * 2 - 12, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-2, -3, 4, 6);

      } else if (activeSkin === 'ghost_skin') {
        // Apparition ghost skin
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 10);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 10);
        ctx.stroke();

        // ghost glow eyes
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(-playerSize/2, -playerSize/4, 2.5, 0, Math.PI * 2);
        ctx.arc(playerSize/2, -playerSize/4, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'ninja') {
        // Ninja Skin
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Red head wrap sash
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-playerSize, -playerSize/3, playerSize * 2, playerSize * 0.7);

        // Ninja glowing eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-playerSize/2, -1, 2, 0, Math.PI * 2);
        ctx.arc(playerSize/2, -1, 2, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'pirate') {
        // Corsair Pirate
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Gold pirate eye patch
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-playerSize/2 - 2, -playerSize/2, playerSize, playerSize * 0.8);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-playerSize/4, -playerSize/8, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'forest') {
        // Mossy Forest
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-playerSize + 3, -playerSize + 3, playerSize * 2 - 6, playerSize * 2 - 6);

        // draw leaf lines
        ctx.strokeStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(0, -playerSize + 4);
        ctx.lineTo(0, playerSize - 4);
        ctx.stroke();

      } else if (activeSkin === 'ice') {
        // Glacier Frost
        ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 6);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 6);
        ctx.stroke();

        // Frost cracks
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-playerSize + 4, -playerSize + 4);
        ctx.lineTo(playerSize - 4, playerSize - 4);
        ctx.stroke();

      } else if (activeSkin === 'neon_skin') {
        // Grid Cyber neon skin
        ctx.fillStyle = '#030712';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'samurai') {
        // Shogun Ronin
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Gold helmet horns
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(-playerSize/2, -playerSize);
        ctx.lineTo(0, -playerSize * 1.5);
        ctx.lineTo(playerSize/2, -playerSize);
        ctx.lineTo(0, -playerSize * 0.7);
        ctx.closePath();
        ctx.fill();

      } else if (activeSkin === 'wizard') {
        // Arcane Wizard
        ctx.fillStyle = '#4c1d95';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // gold star decoration
        ctx.fillStyle = '#fbbf24';
        drawStarIcon(ctx, 0, 0, 4, 6, 2.5, '#fbbf24');

      } else if (activeSkin === 'fire') {
        // Magma core
        ctx.fillStyle = '#7c2d12';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.stroke();

        // Magma heat core
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 5 + Math.sin(Date.now() * 0.01) * 2, 0, Math.PI * 2);
        ctx.fill();

      } else if (activeSkin === 'steampunk') {
        // Brass Dynamo
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Draw interlocking brass cog wheels
        ctx.save();
        ctx.rotate(Date.now() * 0.002);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-6, -6, 12, 12);
        ctx.restore();

      } else if (activeSkin === 'dragon') {
        // Drake Scales
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // draw red scale textures
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-playerSize + 4, -playerSize + 4, playerSize * 2 - 8, playerSize * 2 - 8);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(4, 4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();

      } else if (activeSkin === 'astronaut') {
        // Apollo Visor
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 10);
        ctx.fill();

        // visor
        const visorGrad = ctx.createLinearGradient(-playerSize/2, -playerSize/2, playerSize/2, playerSize/2);
        visorGrad.addColorStop(0, '#0284c7');
        visorGrad.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.roundRect(-playerSize * 0.7, -playerSize * 0.6, playerSize * 1.4, playerSize * 1.0, 6);
        ctx.fill();

      } else {
        // Default Standard Rounded Glass Cube
        ctx.fillStyle = pColorHex;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Glare highlight overlay to make it look 3D glass
        const highlight = ctx.createLinearGradient(-playerSize, -playerSize, playerSize, playerSize);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlight.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
        highlight.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.fill();

        // Clean stroke
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-playerSize, -playerSize, playerSize * 2, playerSize * 2, 8);
        ctx.stroke();

        // Inner color core point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw Moving Obstacles (Guard sentinels)
      if (level.obstacles && obstaclesState.current.length > 0) {
        obstaclesState.current.forEach((obs) => {
          const ox = obs.x * tileSize + tileSize / 2;
          const oy = obs.y * tileSize + tileSize / 2;
          const obsSize = tileSize * 0.32;
          const cycle = Date.now() * 0.007;

          ctx.save();
          ctx.translate(ox, oy);
          ctx.rotate(cycle);

          // Glowing hazard core
          const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, obsSize * 1.3);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, obsSize * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Spike spike ball spikes
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(-4, -obsSize);
            ctx.lineTo(0, -obsSize * 1.4);
            ctx.lineTo(4, -obsSize);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Central security body
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, obsSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Flashing eye
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 4 + Math.sin(Date.now() * 0.015) * 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      }

      // Draw active particles
      const activeParticle = playerStats?.activeParticle || 'part_spark';
      particles.current.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        const px_val = p.x * tileSize;
        const py_val = p.y * tileSize;

        ctx.beginPath();
        if (p.type === 'confetti') {
          // Draw little confetti rects
          ctx.translate(px_val, py_val);
          ctx.rotate(p.life * 0.08);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (activeParticle === 'part_bubble') {
          // Draw transparent bubbles
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1;
          ctx.arc(px_val, py_val, p.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          // shininess dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(px_val - p.size / 5, py_val - p.size / 5, p.size / 10, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeParticle === 'part_ember') {
          // Glowing hot volcanic diamond/ember
          ctx.fillStyle = '#f97316';
          ctx.translate(px_val, py_val);
          ctx.rotate(p.life * 0.05);
          ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        } else if (activeParticle === 'part_digital') {
          // Draw digital grid 1s and 0s
          ctx.fillStyle = p.color;
          ctx.font = 'bold 8px monospace';
          ctx.fillText((p.life % 2 === 0 ? '1' : '0'), px_val, py_val);
        } else if (activeParticle === 'part_petals') {
          // Pink cherry blossom petals
          ctx.fillStyle = '#fbcfe8';
          ctx.translate(px_val, py_val);
          ctx.rotate(p.life * 0.03);
          ctx.scale(1.2, 0.6);
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeParticle === 'part_snowflakes') {
          // Snowflake crystals (plus sign + diagonal cross)
          ctx.strokeStyle = '#e0f2fe';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px_val - p.size/2, py_val);
          ctx.lineTo(px_val + p.size/2, py_val);
          ctx.moveTo(px_val, py_val - p.size/2);
          ctx.lineTo(px_val, py_val + p.size/2);
          ctx.stroke();
        } else if (activeParticle === 'part_ring') {
          // Expanding ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.arc(px_val, py_val, p.size * (0.5 + (p.life / p.maxLife) * 0.5), 0, Math.PI * 2);
          ctx.stroke();
        } else if (activeParticle === 'part_shockwave') {
          // Expanding sound ripple
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.arc(px_val, py_val, p.size * (0.2 + (p.life / p.maxLife) * 1.5), 0, Math.PI * 2);
          ctx.stroke();
        } else if (activeParticle === 'part_fireflies') {
          // Blinking glowing green bug
          const blink = Math.sin(p.life * 0.2) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(163, 230, 53, ${blink})`;
          ctx.arc(px_val, py_val, p.size / 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (activeParticle === 'part_golden') {
          // Shiny golden cascades
          ctx.fillStyle = '#facc15';
          ctx.arc(px_val, py_val, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // Standard sparks
          ctx.arc(px_val, py_val, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.restore(); // Exit screen shake state

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [grid, playerColor, keysHeld, isPaused, canvasWidth, canvasHeight, isCompleted, level]);

  // Handler for arriving exactly at a grid cell
  const handleCellArrival = (gx: number, gy: number) => {
    const cell = grid[gy][gx];

    // 1. Color shift pad triggering
    if (['R', 'G', 'B', 'Y', 'P', 'O'].includes(cell)) {
      let targetColor: GameColor = 'red';
      if (cell === 'R') targetColor = 'red';
      if (cell === 'G') targetColor = 'green';
      if (cell === 'B') targetColor = 'blue';
      if (cell === 'Y') targetColor = 'yellow';
      if (cell === 'P') targetColor = 'purple';
      if (cell === 'O') targetColor = 'orange';

      if (playerColor !== targetColor) {
        setPlayerColor(targetColor);
        audio.playColorShift(targetColor);
        spawnShiftParticles(gx, gy, targetColor, 35);
        triggerShake(1.2);
      }
    }

    // 2. Star collector triggering
    if (cell === 'S') {
      const updatedGrid = grid.map(row => [...row]);
      updatedGrid[gy][gx] = '.'; // Collect star
      setGrid(updatedGrid);

      const nextStarsCount = collectedStarsCount + 1;
      setCollectedStarsCount(nextStarsCount);
      onStarCollected(nextStarsCount);
      audio.playStar();
      spawnKeyCollectionParticles(gx, gy);
      triggerShake(0.8);
    }

    // 3. Key collector triggering
    if (cell === 'K') {
      const updatedGrid = grid.map(row => [...row]);
      updatedGrid[gy][gx] = '.'; // Collect key
      setGrid(updatedGrid);

      setKeysHeld(prev => prev + 1);
      audio.playKey();
      spawnKeyCollectionParticles(gx, gy);
      triggerShake(0.8);
    }

    // 4. Teleporter triggering
    if (['1', '2', '3', '4'].includes(cell)) {
      const portalId = cell;
      // Safeguard teleport spamming instantly
      const lastWarp = teleporterCooldowns.current[portalId] || 0;
      if (lastWarp <= 0) {
        // Search grid for corresponding portal cell partner
        let destX = -1;
        let destY = -1;

        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === portalId && (x !== gx || y !== gy)) {
              destX = x;
              destY = y;
              break;
            }
          }
          if (destX !== -1) break;
        }

        if (destX !== -1 && destY !== -1) {
          // Trigger portal jump!
          audio.playTeleport();
          spawnShiftParticles(gx, gy, playerColor, 15);

          // Warp player
          playerPixelPos.current = { x: destX, y: destY };
          playerTargetPos.current = { x: destX, y: destY };
          setPlayerGridPos({ x: destX, y: destY });

          // Set temporary cooldown
          teleporterCooldowns.current[portalId] = 1200; // 1.2 second cool down

          spawnShiftParticles(destX, destY, playerColor, 20);
          triggerShake(1.4);
        }
      }
    }

    // 4.5. Pressure plate 't' triggering
    if (cell === 't') {
      const updatedGrid = grid.map(row => {
        return row.map(item => {
          if (item === 'D') return 'd';
          if (item === 'd') return 'D';
          return item;
        });
      });
      setGrid(updatedGrid);
      audio.playUnlock();
      spawnKeyCollectionParticles(gx, gy);
      triggerShake(1.0);
    }

    // 5. Spikes static hazard collision
    if (cell === 'X') {
      handleObstacleCrash();
    }

    // 6. Exit Portal reached!
    if (cell === 'E') {
      handleLevelVictory();
    }
  };

  // Obstacle or hazard collision handler
  const handleObstacleCrash = () => {
    if (isCompleted) return;
    triggerShake(4.0);
    audio.playFailure();
    onPlayerHurt();

    // Spawn fracture red explosion particles
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 5.5;
      particles.current.push({
        x: playerPixelPos.current.x + 0.5,
        y: playerPixelPos.current.y + 0.5,
        vx: Math.cos(angle) * speed * 0.05,
        vy: Math.sin(angle) * speed * 0.05,
        color: '#ef4444',
        size: 3 + Math.random() * 6,
        alpha: 1,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        type: 'spark',
      });
    }

    // Reset player position and configurations to starting values
    setPlayerGridPos({ ...level.startPos });
    setPlayerColor(level.startColor);
    playerPixelPos.current = { x: level.startPos.x, y: level.startPos.y };
    playerTargetPos.current = { x: level.startPos.x, y: level.startPos.y };
    moveStartPosRef.current = { x: level.startPos.x, y: level.startPos.y };
    moveStartTimeRef.current = 0;
    bufferedInput.current = null;
    isMoving.current = false;

    // Reset items collected inside this level run
    const freshGrid = level.grid.map(row => [...row]);
    setGrid(freshGrid);
    setCollectedStarsCount(0);
    setKeysHeld(0);
    onStarCollected(0);
  };

  const handleLevelVictory = () => {
    setIsCompleted(true);
    audio.playVictory();
    spawnConfetti(playerGridPos.x, playerGridPos.y, 80);

    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Star computation
    // Star 1: Complete level (automatic)
    // Star 2: Under moves target
    // Star 3: Collected all stars in layout
    let starsAwarded = 1;
    if (movesCountRef.current <= level.targetMoves) {
      starsAwarded++;
    }
    if (collectedStarsCount === totalStarsInLevel && totalStarsInLevel > 0) {
      starsAwarded++;
    } else if (totalStarsInLevel === 0 && elapsedSeconds <= level.targetTime) {
      // If no collectible stars layout, award star 3 based on speed targets
      starsAwarded++;
    }

    setTimeout(() => {
      onLevelComplete(movesCountRef.current, elapsedSeconds, starsAwarded);
    }, 1500);
  };

  // Helper function to draw procedural vector stars
  const drawStarIcon = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    color: string
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    // Star outline glow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // Hex to RGB parser for transparent fills
  const hexToRgb = (hex: string): string => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map(char => char + char).join('');
    }
    const num = parseInt(cleaned, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
  };

  const handleButtonPress = (e: React.PointerEvent<HTMLButtonElement>, dx: number, dy: number) => {
    e.preventDefault();
    audio.playClick();
    if (navigator.vibrate) {
      try {
        navigator.vibrate(10); // Subtle tick for perfect physical feedback
      } catch (err) {}
    }
    initiateMove(dx, dy);
  };

  return (
    <div className="w-full h-full flex flex-col landscape:flex-row items-center justify-center relative select-none gap-4 md:gap-8 max-w-7xl mx-auto overflow-hidden p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pl-[calc(env(safe-area-inset-left)+12px)] pr-[calc(env(safe-area-inset-right)+12px)]">
      {/* Game view area containing Canvas and Hint banner */}
      <div className="flex flex-col items-center justify-center flex-1 max-h-[55%] landscape:max-h-full w-full landscape:w-auto relative gap-3 overflow-hidden">
        {/* Maze Drawing Port Container */}
        <div
          ref={containerRef}
          className="w-full flex-1 flex items-center justify-center relative outline-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="rounded-xl shadow-2xl border border-slate-800 bg-slate-950/80 transition-all cursor-pointer max-w-full max-h-full object-contain"
          />

          {/* Visual Key HUD showing Keys held on-board */}
          {keysHeld > 0 && (
            <div className="absolute top-4 left-4 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-amber-400 font-bold text-xs shadow-lg shadow-amber-500/10 animate-pulse">
              🔑 Keys: {keysHeld}
            </div>
          )}
        </div>

        {/* Dynamic Hint banner (Natural Teaching with no annoying Popups) */}
        {level.description && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            key={level.id + '_' + playerGridPos.x + '_' + playerGridPos.y}
            className="px-4 py-2.5 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl text-[12px] text-center text-slate-200 max-w-[320px] leading-relaxed shadow-lg shadow-cyan-500/5 flex items-center justify-center gap-2 select-none"
          >
            <Sparkles size={13} className="text-cyan-400 animate-pulse flex-shrink-0" />
            <span>
              {level.id === 1 ? (
                playerGridPos.x === 1 ? "Swipe or click ➜ on the D-pad to slide your red cube!" :
                (playerGridPos.x === 2 || playerGridPos.x === 3) ? "Red Gate is open! Your red cube passes red barriers." :
                "Now slide into the cyan portal to complete the level!"
              ) : level.description}
            </span>
          </motion.div>
        )}
      </div>

      {/* Tactile Mobile D-PAD controls (Sleek Circular Glassmorphism Layout) */}
      <div className="flex-shrink-0 flex items-center justify-center w-full landscape:w-auto mt-2 landscape:mt-0 select-none pb-2">
        <div className="relative p-[clamp(12px,2.5vw,20px)] rounded-[32px] bg-slate-950/65 backdrop-blur-md border border-slate-800/80 flex items-center justify-center shadow-2xl select-none">
          {/* Dynamic spectrum halo backing matching current cube's dye color */}
          <div 
            className="absolute inset-0 rounded-[32px] opacity-10 blur-xl transition-all duration-300"
            style={{ backgroundColor: COLORS[playerColor].hex }}
          />
          
          <div className="grid grid-cols-3 grid-rows-3 gap-[clamp(8px,1.5vw,16px)] relative z-10">
            {/* Row 1, Col 1: Empty Spacer */}
            <div />
            
            {/* Row 1, Col 2: UP Button */}
            <motion.button
              id="control_up"
              onPointerDown={(e) => handleButtonPress(e, 0, -1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-[clamp(52px,11vw,76px)] h-[clamp(52px,11vw,76px)] flex items-center justify-center touch-none select-none cursor-pointer border-none outline-none bg-transparent p-0 relative"
            >
              <div 
                className="w-full h-full rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-700/50 flex items-center justify-center shadow-lg transition-all text-slate-300 hover:text-white group"
                style={{
                  boxShadow: `0 0 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none blur-md"
                  style={{ backgroundColor: COLORS[playerColor].hex }}
                />
                <ArrowUp size={24} className="relative z-10 transition-transform group-active:scale-90" />
              </div>
            </motion.button>
            
            {/* Row 1, Col 3: Empty Spacer */}
            <div />

            {/* Row 2, Col 1: LEFT Button */}
            <motion.button
              id="control_left"
              onPointerDown={(e) => handleButtonPress(e, -1, 0)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-[clamp(52px,11vw,76px)] h-[clamp(52px,11vw,76px)] flex items-center justify-center touch-none select-none cursor-pointer border-none outline-none bg-transparent p-0 relative"
            >
              <div 
                className="w-full h-full rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/95 border border-slate-700/50 flex items-center justify-center shadow-lg transition-all text-slate-300 hover:text-white group"
                style={{
                  boxShadow: `0 0 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none blur-md"
                  style={{ backgroundColor: COLORS[playerColor].hex }}
                />
                <ArrowLeft size={24} className="relative z-10 transition-transform group-active:scale-90" />
              </div>
            </motion.button>
            
            {/* Row 2, Col 2: Glowing Core Centerpiece */}
            <div className="flex items-center justify-center w-[clamp(52px,11vw,76px)] h-[clamp(52px,11vw,76px)] relative animate-pulse">
              <div 
                className="w-[clamp(14px,3vw,20px)] h-[clamp(14px,3vw,20px)] rounded-full blur-[0.5px] transition-all duration-300 shadow-lg"
                style={{ 
                  backgroundColor: COLORS[playerColor].hex,
                  boxShadow: `0 0 20px ${COLORS[playerColor].hex}, 0 0 8px ${COLORS[playerColor].hex}` 
                }}
              />
            </div>
            
            {/* Row 2, Col 3: RIGHT Button */}
            <motion.button
              id="control_right"
              onPointerDown={(e) => handleButtonPress(e, 1, 0)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-[clamp(52px,11vw,76px)] h-[clamp(52px,11vw,76px)] flex items-center justify-center touch-none select-none cursor-pointer border-none outline-none bg-transparent p-0 relative"
            >
              <div 
                className="w-full h-full rounded-2xl bg-gradient-to-l from-slate-900/90 to-slate-950/95 border border-slate-700/50 flex items-center justify-center shadow-lg transition-all text-slate-300 hover:text-white group"
                style={{
                  boxShadow: `0 0 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none blur-md"
                  style={{ backgroundColor: COLORS[playerColor].hex }}
                />
                <ArrowRight size={24} className="relative z-10 transition-transform group-active:scale-90" />
              </div>
            </motion.button>

            {/* Row 3, Col 1: Empty Spacer */}
            <div />
            
            {/* Row 3, Col 2: DOWN Button */}
            <motion.button
              id="control_down"
              onPointerDown={(e) => handleButtonPress(e, 0, 1)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-[clamp(52px,11vw,76px)] h-[clamp(52px,11vw,76px)] flex items-center justify-center touch-none select-none cursor-pointer border-none outline-none bg-transparent p-0 relative"
            >
              <div 
                className="w-full h-full rounded-2xl bg-gradient-to-t from-slate-900/90 to-slate-950/95 border border-slate-700/50 flex items-center justify-center shadow-lg transition-all text-slate-300 hover:text-white group"
                style={{
                  boxShadow: `0 0 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none blur-md"
                  style={{ backgroundColor: COLORS[playerColor].hex }}
                />
                <ArrowDown size={24} className="relative z-10 transition-transform group-active:scale-90" />
              </div>
            </motion.button>
            
            {/* Row 3, Col 3: Empty Spacer */}
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};
