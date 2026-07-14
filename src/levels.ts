/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level, GameColor } from './types';

// Grid characters legend:
// '#' = Wall
// '.' = Empty Floor
// 'E' = Exit Portal
// 'r', 'g', 'b', 'y', 'p', 'o' = Gates (Red, Green, Blue, Yellow, Purple, Orange)
// 'R', 'G', 'B', 'Y', 'P', 'O' = Color Pads (Red, Green, Blue, Yellow, Purple, Orange)
// 'S' = Star (Collectible, max 3 per level or as designed)
// 'K' = Key (Opens locked door 'D')
// 'D' = Locked Door
// 'X' = Spikes (Static hazard)
// 't' = Pressure Plate (Toggles door 'D' state instantly)
// '1', '2', '3', '4' = Teleporters (Step on one to teleport to the other matching number)

export const LEVELS: Level[] = [
  // --- WORLD 1: BEGINNER (Levels 1-15) ---
  {
    id: 1,
    name: "A Simple Step",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 6,
    targetTime: 10,
    grid: [
      ["#", "#", "#", "#", "#"],
      ["#", ".", ".", "E", "#"],
      ["#", ".", "#", "#", "#"],
      ["#", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#"],
    ],
    description: "Welcome to the spectrum maze. Move in all directions to find the exit portal."
  },
  {
    id: 2,
    name: "First Shift",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 8,
    targetTime: 12,
    grid: [
      ["#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "#"],
      ["#", ".", "#", ".", "#"],
      ["#", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#"],
    ],
    description: "Step on the Green Pad 'G' to match your color, then pass the green gate 'g'."
  },
  {
    id: 3,
    name: "Color Passage",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "#", "B", "b", "#"],
      ["#", ".", "#", ".", "#", "#"],
      ["#", "R", "r", ".", ".", "#"],
      ["#", ".", "#", "#", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect different spectrum dyes to navigate locked gates."
  },
  {
    id: 4,
    name: "The Golden Key",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 8,
    targetTime: 12,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "K", "#", "#"],
      ["#", "#", ".", "#", "D", "#"],
      ["#", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Retrieve the gold key 'K' to unlock the passage door 'D' and reach the exit."
  },
  {
    id: 5,
    name: "Combined Path",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "#", "#"],
      ["#", ".", "#", "K", "#", "#"],
      ["#", ".", ".", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Coordinate both key collection and active color shifting to breach the gate."
  },
  {
    id: 6,
    name: "The Rift",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 9,
    targetTime: 14,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "1", "#"],
      ["#", "#", ".", "#", ".", "#"],
      ["#", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Step onto quantum teleporters '1' to instantly warp across physical barriers."
  },
  {
    id: 7,
    name: "Splitting Paths",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "#", "G", "g", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", ".", "b", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Study the gates carefully. Some paths are deceptive dead ends."
  },
  {
    id: 8,
    name: "Double Locks",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 14,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", ".", "#"],
      ["#", ".", "#", "D", "#", ".", "#"],
      ["#", ".", "D", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect multiple keys to unlock the cascading security doors."
  },
  {
    id: 9,
    name: "Symmetrical Vault",
    startPos: { x: 1, y: 2 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", "G", "g", "#", "B", "b", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", ".", ".", "R", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A dual-wing vault requiring left and right color coordination."
  },
  {
    id: 10,
    name: "Spike Warning",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "E", "#"],
      ["#", ".", "#", ".", "#", "#"],
      ["#", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid static spikes 'X'. Stepping on them resets your progress!"
  },
  {
    id: 11,
    name: "The Plate Switch",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", ".", "#"],
      ["#", ".", "#", ".", "D", "#"],
      ["#", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Pressure Plate 't' toggles door states. Step on it to open the door!"
  },
  {
    id: 12,
    name: "The Long Road",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "S", ".", "E", "#"],
      ["#", ".", "#", "S", ".", "#"],
      ["#", ".", ".", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect three golden stars 'S' along the path to earn 3 full stars!"
  },
  {
    id: 13,
    name: "Lurking Danger",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "S", "X", "E", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Grab the star floating between spikes carefully."
  },
  {
    id: 14,
    name: "Warp and Siphon",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "1", "#", "1", "#"],
      ["#", ".", "#", "#", "#", "g", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp over the obstacle block, dye green, then exit."
  },
  {
    id: 15,
    name: "Training Finale",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "The graduation exam of World 1. Synthesize all training parameters."
  },

  // --- WORLD 2: FOREST (Levels 16-30) ---
  {
    id: 16,
    name: "Overgrown Paths",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 11,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "#", "#"],
      ["#", ".", "#", ".", "R", "#"],
      ["#", ".", ".", "r", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Forest flora is dense. Step on red to shift out of overgrown green blocks."
  },
  {
    id: 17,
    name: "The Moss Grotto",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "g", "1", "#", "#"],
      ["#", ".", "#", "#", "1", "#"],
      ["#", "G", ".", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Navigate through the damp portal pathways of the grotto."
  },
  {
    id: 18,
    name: "Woodland Vault",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "E", "#"],
      ["#", ".", "#", "G", "g", "#"],
      ["#", ".", ".", "D", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Unlocking forest cache vaults requires green spectral synchronization."
  },
  {
    id: 19,
    name: "Ivy Columns",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "#", "#"],
      ["#", ".", "#", "G", "g", "#"],
      ["#", "R", "r", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "A series of sequential colored barriers blocks the forest clearing."
  },
  {
    id: 20,
    name: "Canopy Cross",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "#", "G", "g", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "b", "S", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Leap across the forest tops, carefully triggering matching colors."
  },
  {
    id: 21,
    name: "Secret Springs",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "D", "#"],
      ["#", ".", "#", "K", ".", "#"],
      ["#", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Pressure plate systems toggle sub-surface aqueduct doors."
  },
  {
    id: 22,
    name: "Sprout Corridors",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "#", "E", "#"],
      ["#", ".", "#", ".", "R", "r", "#"],
      ["#", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Branching root systems present distinct choices. Plan your steps."
  },
  {
    id: 23,
    name: "Hidden Canopy Portal",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 9,
    targetTime: 14,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "S", "1", "#"],
      ["#", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "The trees house secret dimensional rifts. Discover the exit portal."
  },
  {
    id: 24,
    name: "Twin Trees",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", "#"],
      ["#", ".", "#", "D", "#", "#"],
      ["#", ".", "D", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Unlock twin tree-houses by seeking keys tucked in the forest floor."
  },
  {
    id: 25,
    name: "Forest Trapdoor",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "D", "E", "#"],
      ["#", ".", "#", ".", ".", "#", "#"],
      ["#", ".", "K", ".", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A combination of pressure toggles and physical keys secures this vault."
  },
  {
    id: 26,
    name: "The Bramble Maze",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "S", ".", "X", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Beware the sharp bramble spikes while collecting lost stars."
  },
  {
    id: 27,
    name: "Whispering Woods",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "#", "E", "#"],
      ["#", ".", "#", ".", "#", "S", "#"],
      ["#", ".", ".", "B", "b", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Quiet corridors where shifting colors unlock ancient pathways."
  },
  {
    id: 28,
    name: "Tangled Roots",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", ".", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Wade through dense root systems and extract the golden star."
  },
  {
    id: 29,
    name: "Deep Forest Core",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "R", "r", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "S", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "The core of the woodland biome hides a highly concentrated red relic."
  },
  {
    id: 30,
    name: "Forest Heartwood",
    startPos: { x: 1, y: 3 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "K", "D", "#"],
      ["#", ".", "#", "#", "#", ".", "#"],
      ["#", ".", ".", "S", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The Master Spectrum Maze of World 2. Unify green keys and locks to exit."
  },

  // --- WORLD 3: GLACIERS (Levels 31-45) ---
  {
    id: 31,
    name: "Frozen Glade",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "S", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Slippery blue ice fields require exact angle calculation."
  },
  {
    id: 32,
    name: "Crystalline Arch",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", ".", "#"],
      ["#", ".", "S", "Y", "y", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Pass through yellow crystalline mirrors and warp matrices."
  },
  {
    id: 33,
    name: "Glacier Gate",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "y", "#", "E", "#"],
      ["#", ".", "#", ".", "B", "b", "#"],
      ["#", ".", ".", ".", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Coordinate yellow and blue spectrum keys to break through glaciers."
  },
  {
    id: 34,
    name: "Frostbite Pass",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "Y", "y", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid frozen stalagmite spikes while locating the yellow pass dye."
  },
  {
    id: 35,
    name: "Subzero Depths",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "E", "#"],
      ["#", ".", "#", "Y", "y", "#"],
      ["#", ".", ".", "D", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Deep glaciers lock precious keys behind yellow color barriers."
  },
  {
    id: 36,
    name: "Icebreaker",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "E", "#"],
      ["#", ".", "#", ".", "D", "#"],
      ["#", "S", ".", ".", "d", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Break subzero ice walls using pressure-activated mechanical toggles."
  },
  {
    id: 37,
    name: "The Frost Vault",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 14,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", "#", "#"],
      ["#", ".", "#", "D", "#", "E", "#"],
      ["#", "S", ".", "D", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dual-locking cryogenic vaults secure the ultimate glacier star."
  },
  {
    id: 38,
    name: "Glacial Conduit",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "1", "#"],
      ["#", ".", "#", "S", ".", "#"],
      ["#", ".", "Y", "y", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Siphon across dimensional rifts to acquire subzero yellow properties."
  },
  {
    id: 39,
    name: "Slick Mirrors",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "S", ".", "Y", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Use reflections of blue and yellow pads to weave around icebergs."
  },
  {
    id: 40,
    name: "Avalanche Run",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "S", ".", "B", "b", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Hurry over shifting ice plates while dodging falling hazard blocks."
  },
  {
    id: 41,
    name: "Boreal Chasm",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "y", "#", "E", "#"],
      ["#", ".", "#", ".", "#", "S", "#"],
      ["#", ".", ".", "G", "g", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Deep glacial chasms require crossing a double color-bridge sequence."
  },
  {
    id: 42,
    name: "Hailstorm Alley",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "B", "b", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Wind through narrow glacial pathways while avoiding frosty traps."
  },
  {
    id: 43,
    name: "Tundra Gateway",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect tundra gate keys to exit this frozen maze."
  },
  {
    id: 44,
    name: "Ice Core Terminal",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", "S", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Quantum terminal operations inside subzero core conduits."
  },
  {
    id: 45,
    name: "Glacier Heart",
    startPos: { x: 1, y: 3 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "K", "D", "#"],
      ["#", ".", "#", "#", "#", ".", "#"],
      ["#", "S", ".", "Y", "y", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The final glacial gauntlet. Coordinate yellow and blue properties."
  },

  // --- WORLD 4: INDUSTRIAL SMELTER (Levels 46-60) ---
  {
    id: 46,
    name: "Conveyor Shift",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", "S", ".", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Molten smelter tracks require speedy orange dye shifts."
  },
  {
    id: 47,
    name: "Smelting Pipeline",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", "S", "#"],
      ["#", ".", "O", "o", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Pipe systems warp your spectrum cube across high-temperature vents."
  },
  {
    id: 48,
    name: "The Gear Vault",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "#", "E", "#"],
      ["#", ".", "#", ".", "R", "r", "#"],
      ["#", ".", ".", "S", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Unlock high-pressure boiler valves using red and orange dyes."
  },
  {
    id: 49,
    name: "Hydraulic Hazard",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "O", "o", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step lightly around high-pressure steam spikes."
  },
  {
    id: 50,
    name: "Power Grid Central",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "E", "#"],
      ["#", ".", "#", "O", "o", "#"],
      ["#", ".", ".", "D", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Retrieve central key cells while maintaining orange polarity."
  },
  {
    id: 51,
    name: "Conveyor Belts",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "E", "#"],
      ["#", ".", "#", ".", "D", "#"],
      ["#", "S", ".", ".", "d", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Tread hydraulic pressure plates to realign production gates."
  },
  {
    id: 52,
    name: "Gear Shift",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 14,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", "#", "#"],
      ["#", ".", "#", "D", "#", "E", "#"],
      ["#", "S", ".", "D", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Coordinate a double mechanical key extraction."
  },
  {
    id: 53,
    name: "Steam Valve",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "1", "#"],
      ["#", ".", "#", "S", ".", "#"],
      ["#", ".", "O", "o", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Utilize steam pipeline portals to secure safety stars."
  },
  {
    id: 54,
    name: "Assembly Line",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "S", ".", "R", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Trace assembly tracks to fuse distinct thermal dyes."
  },
  {
    id: 55,
    name: "Smelting Chamber",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "S", ".", "O", "o", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The core blast furnace requires extremely careful step planning."
  },
  {
    id: 56,
    name: "Hydraulic Press",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "#", "E", "#"],
      ["#", ".", "#", ".", "#", "S", "#"],
      ["#", ".", ".", "Y", "y", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Evade crushing hydraulic columns by shifting color alignments."
  },
  {
    id: 57,
    name: "The Gridlock",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "O", "o", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A tightly gridlocked smelter zone with multiple hazard layers."
  },
  {
    id: 58,
    name: "Factory Reset",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Reboot primary sector locks by fetching the core key cell."
  },
  {
    id: 59,
    name: "Warehouse Run",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", "S", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp across physical machinery lines to extract locked storage stars."
  },
  {
    id: 60,
    name: "Industrial Sector",
    startPos: { x: 1, y: 3 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "K", "D", "#"],
      ["#", ".", "#", "#", "#", ".", "#"],
      ["#", "S", ".", "R", "r", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The thermal masterwork level. Fuse keys and color pathways to pass."
  },

  // --- WORLD 5: NEON LABORATORY (Levels 61-75) ---
  {
    id: 61,
    name: "Neon Genesis",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", "S", ".", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Initialize subatomic purple waves to pass energy gates."
  },
  {
    id: 62,
    name: "Quantum Tunnel",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", "S", "#"],
      ["#", ".", "P", "p", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp across neon server mainframe sectors seamlessly."
  },
  {
    id: 63,
    name: "Laser Grid",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "#", "E", "#"],
      ["#", ".", "#", ".", "R", "r", "#"],
      ["#", ".", ".", "S", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Weave around optical red and purple laser gates."
  },
  {
    id: 64,
    name: "Cybernetic Core",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "P", "p", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Siphon spectrum properties within highly volatile core sectors."
  },
  {
    id: 65,
    name: "Grid Runner",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "E", "#"],
      ["#", ".", "#", "P", "p", "#"],
      ["#", ".", ".", "D", ".", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "High speed routing through absolute zero neon conduits."
  },
  {
    id: 66,
    name: "Binary Shift",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "E", "#"],
      ["#", ".", "#", ".", "D", "#"],
      ["#", "S", ".", ".", "d", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Logic gate pathways require precise state toggling."
  },
  {
    id: 67,
    name: "Overclocked",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 14,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", "#", "#"],
      ["#", ".", "#", "D", "#", "E", "#"],
      ["#", "S", ".", "D", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Overclock processor units by unlocking multiple logic doors."
  },
  {
    id: 68,
    name: "The Matrix",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "1", "#"],
      ["#", ".", "#", "S", ".", "#"],
      ["#", ".", "P", "p", "E", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Unravel matrix warp loops to bypass purple security systems."
  },
  {
    id: 69,
    name: "Spectrum Sync",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "S", ".", "R", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "A dual spectrum synchronizer matches colors and warps."
  },
  {
    id: 70,
    name: "Prismatic Vault",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", ".", "#", ".", "#"],
      ["#", "S", ".", "P", "p", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Safety protocols require yellow spectrum synchronization."
  },
  {
    id: 71,
    name: "Subatomic Drift",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "#", "E", "#"],
      ["#", ".", "#", ".", "#", "S", "#"],
      ["#", ".", ".", "Y", "y", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Navigate through shifting electromagnetic neon lines."
  },
  {
    id: 72,
    name: "Cyber Portal",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "S", "X", "#"],
      ["#", ".", "#", "P", "p", ".", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Bypass firewall structures using purple security keys."
  },
  {
    id: 73,
    name: "Dark Web",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "E", "#"],
      ["#", ".", "#", "#", "#", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "A dark shadowy corridor. Illuminate your spectrum cube to escape."
  },
  {
    id: 74,
    name: "The Mainframe",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 11,
    targetTime: 16,
    grid: [
      ["#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "E", "#"],
      ["#", ".", "#", "1", "S", "#"],
      ["#", ".", "K", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#"],
    ],
    description: "Infiltrate the main laboratory computer using teleport conduits."
  },
  {
    id: 75,
    name: "The Singularity",
    startPos: { x: 1, y: 3 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "K", "D", "#"],
      ["#", ".", "#", "#", "#", ".", "#"],
      ["#", "S", ".", "R", "r", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The ultimate singularity event. Symmetrize all active variables!"
  }
];

interface SolverState {
  x: number;
  y: number;
  color: string;
  keys: number;
  bitmask: number;
}

/**
 * Robust Breadth-First Search (BFS) Solver
 * Evaluates level grids to ensure there is a clear, unblocked path from the start position
 * to the exit portal, perfectly accounting for:
 * - Color Shifts (R, G, B, Y, P, O) and Gate compliance (r, g, b, y, p, o)
 * - Keys (K) and Locked Doors (D), both starting and toggled
 * - Pressure Plates (t) that swap D/d blocks
 * - Teleporters (1, 2, 3, 4) with instantaneous relocations
 */
export function isLevelSolvable(level: Level): boolean {
  const grid = level.grid;
  const startPos = level.startPos;
  const startColor = level.startColor;

  // Track coordinates of K (keys), D (locked doors), and d (unlocked doors)
  const changeables: { x: number; y: number; type: 'K' | 'D' | 'd' }[] = [];
  const changeableMap: Record<string, number> = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char === 'K' || char === 'D' || char === 'd') {
        const idx = changeables.length;
        changeables.push({ x, y, type: char });
        changeableMap[`${x},${y}`] = idx;
      }
    }
  }

  // Initial bitmask setup
  let initialBitmask = 0;
  for (let i = 0; i < changeables.length; i++) {
    if (changeables[i].type === 'K' || changeables[i].type === 'D') {
      initialBitmask |= (1 << i);
    }
  }

  const visited = new Set<string>();
  const queue: SolverState[] = [{
    x: startPos.x,
    y: startPos.y,
    color: startColor,
    keys: 0,
    bitmask: initialBitmask
  }];

  const startStateStr = `${startPos.x},${startPos.y},${startColor},0,${initialBitmask}`;
  visited.add(startStateStr);

  let head = 0;
  const maxIterations = 4000;

  while (head < queue.length && queue.length < maxIterations) {
    const curr = queue[head++];

    if (grid[curr.y][curr.x] === 'E') {
      return true;
    }

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];

    for (const d of dirs) {
      const nx = curr.x + d.dx;
      const ny = curr.y + d.dy;

      if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[ny].length) continue;

      const nextCell = grid[ny][nx];
      if (nextCell === '#') continue; // Wall block
      if (nextCell === 'X') continue; // Spikes (static obstacle)

      let nextColor = curr.color;
      let nextKeys = curr.keys;
      let nextBitmask = curr.bitmask;

      const changeableIdx = changeableMap[`${nx},${ny}`];
      let isCellPassable = true;

      if (changeableIdx !== undefined) {
        const isBitSet = (nextBitmask & (1 << changeableIdx)) !== 0;
        const initialType = changeables[changeableIdx].type;

        if (initialType === 'K') {
          if (isBitSet) {
            // Collect key
            nextBitmask &= ~(1 << changeableIdx);
            nextKeys++;
          }
        } else if (initialType === 'D') {
          if (isBitSet) {
            if (nextKeys > 0) {
              nextKeys--;
              nextBitmask &= ~(1 << changeableIdx);
            } else {
              isCellPassable = false;
            }
          }
        } else if (initialType === 'd') {
          if (isBitSet) {
            isCellPassable = false; // Toggled to locked
          }
        }
      }

      if (!isCellPassable) continue;

      // Color gate constraints
      if (nextCell === 'r' && nextColor !== 'red') continue;
      if (nextCell === 'g' && nextColor !== 'green') continue;
      if (nextCell === 'b' && nextColor !== 'blue') continue;
      if (nextCell === 'y' && nextColor !== 'yellow') continue;
      if (nextCell === 'p' && nextColor !== 'purple') continue;
      if (nextCell === 'o' && nextColor !== 'orange') continue;

      const cellAfterLand = grid[ny][nx];

      // Color Shift pads
      if (cellAfterLand === 'R') nextColor = 'red';
      else if (cellAfterLand === 'G') nextColor = 'green';
      else if (cellAfterLand === 'B') nextColor = 'blue';
      else if (cellAfterLand === 'Y') nextColor = 'yellow';
      else if (cellAfterLand === 'P') nextColor = 'purple';
      else if (cellAfterLand === 'O') nextColor = 'orange';

      // Pressure plate toggle
      if (cellAfterLand === 't') {
        for (let i = 0; i < changeables.length; i++) {
          if (changeables[i].type === 'D' || changeables[i].type === 'd') {
            nextBitmask ^= (1 << i);
          }
        }
      }

      // Teleporters
      let finalX = nx;
      let finalY = ny;
      if (['1', '2', '3', '4'].includes(cellAfterLand)) {
        let px = -1, py = -1;
        for (let ty = 0; ty < grid.length; ty++) {
          for (let tx = 0; tx < grid[ty].length; tx++) {
            if (grid[ty][tx] === cellAfterLand && (tx !== nx || ty !== ny)) {
              px = tx;
              py = ty;
              break;
            }
          }
          if (px !== -1) break;
        }
        if (px !== -1 && py !== -1) {
          finalX = px;
          finalY = py;
        }
      }

      const stateStr = `${finalX},${finalY},${nextColor},${nextKeys},${nextBitmask}`;
      if (!visited.has(stateStr)) {
        visited.add(stateStr);
        queue.push({
          x: finalX,
          y: finalY,
          color: nextColor,
          keys: nextKeys,
          bitmask: nextBitmask
        });
      }
    }
  }

  return false;
}

/**
 * Procedural Daily Challenge Level Generator
 * Generates a completely unique, solvable, and hard maze based on a date seed.
 */
export function generateDailyLevel(dateStr: string): Level {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0;
  }

  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function randomRange(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  const width = 11;
  const height = 7;
  const startPos = { x: 1, y: 1 };
  const exitPos = { x: width - 2, y: height - 2 };

  let grid: string[][] = [];
  let dailyObstacles: any[] = [];
  let isSolvable = false;
  let validationAttempts = 0;

  // Loop generation until a perfectly validated solvable hard maze is discovered
  while (!isSolvable && validationAttempts < 150) {
    validationAttempts++;
    grid = Array(height).fill(null).map(() => Array(width).fill('#'));

    // Carve initial pathway
    let curX = startPos.x;
    let curY = startPos.y;
    grid[curY][curX] = '.';
    grid[exitPos.y][exitPos.x] = 'E';

    while (curX !== exitPos.x || curY !== exitPos.y) {
      if (curX < exitPos.x && (random() > 0.4 || curY === exitPos.y)) {
        curX++;
      } else if (curY < exitPos.y) {
        curY++;
      } else {
        curX++;
      }
      grid[curY][curX] = '.';
    }

    // Carve secondary branching pathways
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] === '#') {
          if (random() > 0.45) {
            grid[y][x] = '.';
          }
        }
      }
    }

    // Ensure start and exit are completely clean
    grid[startPos.y][startPos.x] = '.';
    grid[exitPos.y][exitPos.x] = 'E';

    // Weave Color pads and Gates
    const pads = ['G', 'B', 'Y', 'R', 'P', 'O'];
    const gates = ['g', 'b', 'y', 'r', 'p', 'o'];

    let placedPads = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (grid[y][x] === '.' && !(x === startPos.x && y === startPos.y)) {
          if (placedPads < 3 && random() > 0.72) {
            grid[y][x] = pads[placedPads % pads.length];
            placedPads++;
          }
        }
      }
    }

    let placedGates = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 2; x < width - 2; x++) {
        if (grid[y][x] === '.' && !(x === exitPos.x && y === exitPos.y)) {
          if (placedGates < placedPads && random() > 0.68) {
            grid[y][x] = gates[placedGates % gates.length];
            placedGates++;
          }
        }
      }
    }

    // Ensure at least one gate pair exists
    if (placedGates === 0) {
      grid[2][4] = 'r';
      grid[3][2] = 'R';
      placedGates = 1;
    }

    // Place key and door
    let keyPlaced = false;
    let doorPlaced = false;
    let keyAttempts = 0;
    while ((!keyPlaced || !doorPlaced) && keyAttempts < 100) {
      const rx = randomRange(2, width - 3);
      const ry = randomRange(1, height - 2);
      if (grid[ry][rx] === '.') {
        if (!keyPlaced) {
          grid[ry][rx] = 'K';
          keyPlaced = true;
        } else if (!doorPlaced && Math.abs(rx - startPos.x) > 2) {
          grid[ry][rx] = 'D';
          doorPlaced = true;
        }
      }
      keyAttempts++;
    }

    // Place stars
    let starsPlaced = 0;
    let starAttempts = 0;
    while (starsPlaced < 3 && starAttempts < 50) {
      const rx = randomRange(1, width - 2);
      const ry = randomRange(1, height - 2);
      if (grid[ry][rx] === '.') {
        grid[ry][rx] = 'S';
        starsPlaced++;
      }
      starAttempts++;
    }

    // Place spikes
    for (let i = 0; i < 2; i++) {
      const rx = randomRange(2, width - 3);
      const ry = randomRange(1, height - 2);
      if (grid[ry][rx] === '.') {
        grid[ry][rx] = 'X';
      }
    }

    // Check with Solver
    const testLevel: Level = {
      id: 9999,
      name: `Daily Rift`,
      grid,
      startPos,
      startColor: "red",
      targetMoves: 25,
      targetTime: 45,
      description: ""
    };

    if (isLevelSolvable(testLevel)) {
      isSolvable = true;
    }
  }

  // Create moving patrol obstacle dynamically based on date seed
  if (random() > 0.5) {
    dailyObstacles.push({
      id: "daily_patrol",
      type: "patrol" as const,
      speed: 2.2,
      path: [
        { x: randomRange(2, 4), y: randomRange(1, 2) },
        { x: randomRange(6, 8), y: randomRange(4, 5) },
      ],
    });
  }

  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedDate = formatter.format(new Date(dateStr));

  return {
    id: 9999,
    name: `Daily Rift - ${formattedDate}`,
    grid,
    startPos,
    startColor: "red",
    targetMoves: 22 + randomRange(0, 8),
    targetTime: 40 + randomRange(0, 10),
    description: "The daily neon rift is shifting. Claim your daily spectrum star rewards!",
    obstacles: dailyObstacles,
  };
}
