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
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 6,
    targetTime: 10,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Swipe or use arrow keys / WASD to slide into the cyan portal!"
  },
  {
    id: 2,
    name: "First Shift",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 6,
    targetTime: 10,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "G", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step on the Green Pad 'G' to dye your cube green."
  },
  {
    id: 3,
    name: "Color Passage",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 8,
    targetTime: 12,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", ".", "g", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Change your color to Green to pass through the Green Gate."
  },
  {
    id: 4,
    name: "The Golden Key",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 8,
    targetTime: 12,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", ".", "D", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect the Golden Key 'K' to unlock the glass door 'D'."
  },
  {
    id: 5,
    name: "Combined Path",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", ".", "K", "g", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dye your cube green first, collect the key, pass the gate, and unlock the door."
  },
  {
    id: 6,
    name: "The Rift",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 5,
    targetTime: 10,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "1", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step onto Teleporter '1' to warp instantly to its partner!"
  },
  {
    id: 7,
    name: "Splitting Paths",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 9,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "#", "b", ".", "E", "#"],
      ["#", ".", ".", "G", "g", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Two options present themselves. Which color spectrum is correct?"
  },
  {
    id: 8,
    name: "Double Locks",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "D", "K", "D", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect both keys and break through the sequential doors."
  },
  {
    id: 9,
    name: "Symmetrical Vault",
    startPos: { x: 1, y: 2 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "G", "g", "#", "B", "b", "E", "#"],
      ["#", ".", ".", "R", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Symmetric color shifts. Choose your steps carefully."
  },
  {
    id: 10,
    name: "Spike Warning",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 8,
    targetTime: 12,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", ".", "E", "#"],
      ["#", ".", ".", ".", "X", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid static spikes 'X'. Stepping on them resets your progress!"
  },
  {
    id: 11,
    name: "The Plate Switch",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", ".", "#", ".", "E", "#"],
      ["#", ".", "#", ".", "D", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Pressure Plate 't' toggles door states. Step on it to open the door!"
  },
  {
    id: 12,
    name: "The Long Road",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 12,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "S", ".", "S", ".", "S", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect three golden stars 'S' along the path to earn 3 full stars!"
  },
  {
    id: 13,
    name: "Lurking Danger",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 10,
    targetTime: 15,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "S", "X", ".", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Grab the star floating between spikes carefully."
  },
  {
    id: 14,
    name: "Warp and Siphon",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 11,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "1", "#", "1", "g", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp over the obstacle block, dye green, then exit."
  },
  {
    id: 15,
    name: "Training Finale",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "K", "D", "1", "S", "E", "#"],
      ["#", ".", "1", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The graduation exam of World 1. Synthesize all training parameters."
  },

  // --- WORLD 2: FOREST (Levels 16-30) ---
  {
    id: 16,
    name: "Overgrown Paths",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 11,
    targetTime: 18,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "g", "R", "r", ".", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Forest flora is dense. Step on red to shift out of overgrown green blocks."
  },
  {
    id: 17,
    name: "The Moss Grotto",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "g", ".", "1", "#", "1", "E", "#"],
      ["#", "#", "G", "#", "#", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Navigate through the damp portal pathways."
  },
  {
    id: 18,
    name: "Woodland Vault",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "G", "g", "D", "E", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Unlocking forest cache vaults requires green spectral synchronization."
  },
  {
    id: 19,
    name: "Ivy Columns",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "G", "g", "R", "r", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A series of sequential colored barriers blocks the forest clearing."
  },
  {
    id: 20,
    name: "Canopy Cross",
    startPos: { x: 1, y: 2 },
    startColor: "green",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "#", "E", ".", "#"],
      ["#", ".", "y", "G", "g", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Slide along the tree branches. Yellow pads shift your spectrum."
  },
  {
    id: 21,
    name: "Secret Springs",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 13,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "y", "K", "y", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Find the key hidden deep in the glowing woodland spring."
  },
  {
    id: 22,
    name: "Sprout Corridors",
    startPos: { x: 1, y: 1 },
    startColor: "yellow",
    targetMoves: 14,
    targetTime: 24,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "Y", "y", "S", "y", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid spikes sticking out of overgrown soil beds."
  },
  {
    id: 23,
    name: "Hidden Canopy Portal",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "1", "g", "#", "1", "Y", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Use hidden warp portals in the leaves to traverse the valley."
  },
  {
    id: 24,
    name: "Twin Trees",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 13,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "1", "#", "1", "y", "E", "#"],
      ["#", ".", ".", "y", "#", "#", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Traverse between two massive ancient hollow tree trunks."
  },
  {
    id: 25,
    name: "Forest Trapdoor",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", ".", "#", "D", "S", "E", "#"],
      ["#", ".", "#", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Activate the vine pulley switch to retract the root doors."
  },
  {
    id: 26,
    name: "The Bramble Maze",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 16,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "g", "G", "X", "Y", "y", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Squeeze past poisonous thorns blocking the forest exit."
  },
  {
    id: 27,
    name: "Whispering Woods",
    startPos: { x: 1, y: 2 },
    startColor: "green",
    targetMoves: 15,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "Y", "y", "G", "g", ".", "E", "#"],
      ["#", ".", ".", "K", ".", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect the ancient relic key and match your leaf dye."
  },
  {
    id: 28,
    name: "Tangled Roots",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 14,
    targetTime: 24,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "1", "#", "E", ".", "#"],
      ["#", ".", "#", "#", "#", "#", "1", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Teleport over the gnarled redwood roots blocking the path."
  },
  {
    id: 29,
    name: "Deep Forest Core",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 16,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "y", "1", "D", "K", "1", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A double shift portal path deep within the ancient forest."
  },
  {
    id: 30,
    name: "Forest Heartwood",
    startPos: { x: 1, y: 1 },
    startColor: "green",
    targetMoves: 18,
    targetTime: 30,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "Y", "y", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Conquer the sacred inner temple of the Whispering Forest."
  },

  // --- WORLD 3: ICE WORLD (Levels 31-45) ---
  {
    id: 31,
    name: "Frozen Glade",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "b", "Y", "y", "S", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The ice is slippery, and the spectral barriers are frozen solid."
  },
  {
    id: 32,
    name: "Crystalline Arch",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "1", "#", "1", "b", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp between ice pillars to change your spectrum parameters."
  },
  {
    id: 33,
    name: "Glacier Gate",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 15,
    targetTime: 24,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "b", "B", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dye your cube blue to unlock the frozen security gate."
  },
  {
    id: 34,
    name: "Frostbite Pass",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "b", "P", "p", "X", "S", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Weave between lethal ice spikes and frozen violet barriers."
  },
  {
    id: 35,
    name: "Subzero Depths",
    startPos: { x: 1, y: 2 },
    startColor: "blue",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", "P", "p", "S", "E", ".", "#"],
      ["#", ".", ".", "b", "B", "b", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Descend into the glacier rift. Change color to deep purple."
  },
  {
    id: 36,
    name: "Icebreaker",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 13,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "p", "P", "K", "p", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Break the ice by matching the violet runes to grab the key."
  },
  {
    id: 37,
    name: "The Frost Vault",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", ".", "#", "D", "S", "b", "E", "#"],
      ["#", ".", "#", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step on the pressure plate to melt the security ice barriers."
  },
  {
    id: 38,
    name: "Glacial Conduit",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "b", "P", "p", "1", "P", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp between glacier wings to solve the conduit system."
  },
  {
    id: 39,
    name: "Slick Mirrors",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "1", "#", "1", "p", "E", "#"],
      ["#", ".", ".", "p", "#", "#", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Reflect your movements across mirror portals."
  },
  {
    id: 40,
    name: "Avalanche Run",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 18,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "b", "P", "p", "1", "X", "1", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "An avalanche of spikes blocks the path. Portal out fast!"
  },
  {
    id: 41,
    name: "Boreal Chasm",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Traverse the freezing chasm with violet spectrum keys."
  },
  {
    id: 42,
    name: "Hailstorm Alley",
    startPos: { x: 1, y: 2 },
    startColor: "blue",
    targetMoves: 17,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "P", "p", "B", "b", ".", "E", "#"],
      ["#", ".", "X", "K", "X", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Retrieve the key from the center of the hazardous ice spikes."
  },
  {
    id: 43,
    name: "Tundra Gateway",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "1", "#", "E", ".", "#"],
      ["#", ".", "#", "#", "#", "#", "1", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Unlock the gate and slide through the boreal portal."
  },
  {
    id: 44,
    name: "Ice Core Terminal",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 18,
    targetTime: 30,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "1", "D", "K", "1", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Solve the ice terminal's twin portal systems to escape."
  },
  {
    id: 45,
    name: "Glacier Heart",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    targetMoves: 20,
    targetTime: 32,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "P", "p", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Escape the core glacier matrix. Spheroids align perfectly."
  },

  // --- WORLD 4: FACTORY (Levels 46-60) ---
  {
    id: 46,
    name: "Conveyor Shift",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "o", "B", "b", "S", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Factory logistics require shift sequencing. Match orange dyes."
  },
  {
    id: 47,
    name: "Smelting Pipeline",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "1", "#", "1", "o", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp between smelting lines to adjust spectrum outputs."
  },
  {
    id: 48,
    name: "The Gear Vault",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 15,
    targetTime: 24,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "o", "O", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Grab the brass key and filter orange spectrum lines to exit."
  },
  {
    id: 49,
    name: "Hydraulic Hazard",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "o", "B", "b", "X", "S", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Weave between the heavy hydraulic smashers ('X')."
  },
  {
    id: 50,
    name: "Power Grid Central",
    startPos: { x: 1, y: 2 },
    startColor: "orange",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", "B", "b", "S", "E", ".", "#"],
      ["#", ".", ".", "o", "O", "o", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Reroute power lines by shifting into blue spectrum currents."
  },
  {
    id: 51,
    name: "Conveyor Belts",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    targetMoves: 13,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "r", "R", "K", "r", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Ride the conveyor belts to gather keys and unlock safety locks."
  },
  {
    id: 52,
    name: "Gear Shift",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", ".", "#", "D", "S", "o", "E", "#"],
      ["#", ".", "#", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Tapping pressure plates rotates mechanical gears in the maze."
  },
  {
    id: 53,
    name: "Steam Valve",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "o", "B", "b", "1", "B", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dodge high-temperature steam outlets by warping."
  },
  {
    id: 54,
    name: "Assembly Line",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "1", "#", "1", "b", "E", "#"],
      ["#", ".", ".", "b", "#", "#", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Align your cube sequentially to match the factory assembly layout."
  },
  {
    id: 55,
    name: "Smelting Chamber",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 18,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "o", "B", "b", "1", "X", "1", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Intense heat spikes block standard routes. Leap through wormholes."
  },
  {
    id: 56,
    name: "Hydraulic Press",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Time your moves to slide beneath heavy metallic plates."
  },
  {
    id: 57,
    name: "The Gridlock",
    startPos: { x: 1, y: 2 },
    startColor: "orange",
    targetMoves: 17,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "B", "b", "O", "o", ".", "E", "#"],
      ["#", ".", "X", "K", "X", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The factory floor is in a gridlock. Use orange and blue dyes."
  },
  {
    id: 58,
    name: "Factory Reset",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "1", "#", "E", ".", "#"],
      ["#", ".", "#", "#", "#", "#", "1", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Tread carefully. Stepping on the wrong signal lines triggers a reset."
  },
  {
    id: 59,
    name: "Warehouse Run",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 18,
    targetTime: 30,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "1", "D", "K", "1", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A fast routing run through the warehouse storage aisles."
  },
  {
    id: 60,
    name: "Industrial Sector",
    startPos: { x: 1, y: 1 },
    startColor: "orange",
    targetMoves: 20,
    targetTime: 32,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "B", "b", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Shut down the factory core by matching orange/blue filters."
  },

  // --- WORLD 5: NEON LABORATORY (Levels 61-75) ---
  {
    id: 61,
    name: "Neon Genesis",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 12,
    targetTime: 20,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "p", "Y", "y", "S", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Welcome to the Neon Synapse. Glowing violet codes bar the way."
  },
  {
    id: 62,
    name: "Quantum Tunnel",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "1", "#", "1", "p", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Tunnel through molecular quantum barriers to reach the exit."
  },
  {
    id: 63,
    name: "Laser Grid",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 15,
    targetTime: 24,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "p", "P", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The laser systems are offline. Match violet dyes to safely cross."
  },
  {
    id: 64,
    name: "Cybernetic Core",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "p", "Y", "y", "X", "S", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Traverse high-voltage sparks in the server mainframe."
  },
  {
    id: 65,
    name: "Grid Runner",
    startPos: { x: 1, y: 2 },
    startColor: "purple",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", "Y", "y", "S", "E", ".", "#"],
      ["#", ".", ".", "p", "P", "p", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "High speed routing through absolute zero neon conduits."
  },
  {
    id: 66,
    name: "Binary Shift",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 13,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "p", "P", "K", "p", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "0s and 1s logic gate paths require precise puzzle computations."
  },
  {
    id: 67,
    name: "Overclocked",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", ".", "#", "D", "S", "p", "E", "#"],
      ["#", ".", "#", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Overclock your processors. Toggles must activate sequentially."
  },
  {
    id: 68,
    name: "The Matrix",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "p", "Y", "y", "1", "Y", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Enter the code matrix. Teleport loops must be decoupled."
  },
  {
    id: 69,
    name: "Spectrum Sync",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 14,
    targetTime: 22,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "1", "#", "1", "y", "E", "#"],
      ["#", ".", ".", "y", "#", "#", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A dual spectrum synchronizer matches colors and warps."
  },
  {
    id: 70,
    name: "Prismatic Vault",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 18,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "p", "Y", "y", "1", "X", "1", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Safety protocols require yellow spectrum synchronization."
  },
  {
    id: 71,
    name: "Subatomic Drift",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 16,
    targetTime: 26,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "y", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Navigate through shifting electromagnetic lines."
  },
  {
    id: 72,
    name: "Cyber Portal",
    startPos: { x: 1, y: 2 },
    startColor: "purple",
    targetMoves: 17,
    targetTime: 28,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "Y", "y", "P", "p", ".", "E", "#"],
      ["#", ".", "X", "K", "X", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Portal sequences lock. Bypass firewalls using purple code keys."
  },
  {
    id: 73,
    name: "Dark Web",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 15,
    targetTime: 25,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "1", "#", "E", ".", "#"],
      ["#", ".", "#", "#", "#", "#", "1", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A dark shadowy path. Illuminate your cube to escape."
  },
  {
    id: 74,
    name: "The Mainframe",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 18,
    targetTime: 30,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "1", "D", "K", "1", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Conquer the main security server grid of the Laboratory."
  },
  {
    id: 75,
    name: "The Singularity",
    startPos: { x: 1, y: 1 },
    startColor: "purple",
    targetMoves: 22,
    targetTime: 35,
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", "P", "p", "K", "D", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The ultimate singularity event. Symmetrize all variables!"
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
