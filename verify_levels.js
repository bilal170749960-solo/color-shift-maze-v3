const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

const LEVELS = [
  // --- TUTORIAL SECTION (Levels 1-10) ---
  {
    id: 1,
    name: "A Simple Step",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Swipe or click arrow buttons on the D-pad to slide into the cyan portal!"
  },
  {
    id: 2,
    name: "First Shift",
    startPos: { x: 1, y: 1 },
    startColor: "red",
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
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "#", "#", "1", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step on the cyan teleporter '1' to warp instantly across space."
  },
  {
    id: 7,
    name: "Warp and Key",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "K", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "#", "#", "1", ".", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect the key first, then warp through the teleporter '1' to open the door."
  },
  {
    id: 8,
    name: "Warp and Colors",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "#", "#", "#", "#", ".", "g", "#"],
      ["#", ".", "1", "#", "#", "#", "1", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Turn Green first, then use the teleporter to bypass the wall and enter the Green Gate."
  },
  {
    id: 9,
    name: "Color, Gate, and Key",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", ".", "b", ".", "K", "#"],
      ["#", "#", "#", "#", "#", "#", "D", "#"],
      ["#", ".", ".", ".", ".", ".", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Turn Blue, cross the gate, grab the key, and unlock the door below."
  },
  {
    id: 10,
    name: "The Academy Exam",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "G", "1", "#", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "1", ".", "g", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Grab the key, shift green, warp, and slide through the gate to unlock the exit."
  },

  // --- EASY SECTION (Levels 11-20) ---
  {
    id: 11,
    name: "Starry Path",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "G", "g", "S", "E", "#"],
      ["#", ".", "#", "#", "#", "#", ".", "#"],
      ["#", ".", "B", "b", "S", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Plan your path: collect the blue star below first, then turn green to reach the portal."
  },
  {
    id: 12,
    name: "The Double Lock",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", ".", "D", "D", "E"],
      ["#", ".", ".", ".", ".", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Gather both golden keys before attempting to unlock the double barrier."
  },
  {
    id: 13,
    name: "Teleport Maze",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", ".", "2", ".", "1", "2", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Warp back and forth between teleporters 1 and 2 to crack the layout."
  },
  {
    id: 14,
    name: "Divergent Spectrum",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "#", "B", "#", "g", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "b", "S", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Turn blue to unlock the secret star chamber, then turn green to exit."
  },
  {
    id: 15,
    name: "Spike Hop",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "S", "X", ".", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid static spikes 'X'. Hop down to the lower path to bypass them safely."
  },
  {
    id: 16,
    name: "Pressure Toggle",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "d", "S", "t", ".", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Step on the pressure plate 't' to invert the doors: 'd' closes, 'D' opens."
  },
  {
    id: 17,
    name: "Yellow Junction",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "Y", "#", "y", "E", "#"],
      ["#", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "The Yellow pad 'Y' and gate 'y' require you to color-shift to Yellow."
  },
  {
    id: 18,
    name: "Symmetrical Gateways",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "B", "#", "E", "#"],
      ["#", ".", "g", ".", "b", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Shift to Green, cross the green gate, shift to Blue, then bypass to the exit."
  },
  {
    id: 19,
    name: "Switchback",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "G", "g", "E", "#"],
      ["#", ".", ".", "D", ".", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Toggle the door open using the switch, pass through, and dye your cube green."
  },
  {
    id: 20,
    name: "The Red Carpet",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "#", ".", "r", "S", "E", "#"],
      ["#", ".", "#", ".", "#", "#", "#", "#"],
      ["#", ".", ".", "R", ".", ".", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "You start blue. Find the Red Pad to match the gate blocking the exit portal."
  },

  // --- MEDIUM SECTION (Levels 21-30) ---
  {
    id: 21,
    name: "The Two-Tone Lock",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "K", "1", "#", "1", "B", "b", "D", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Solve the green chamber to get the key, warp, then solve the blue chamber."
  },
  {
    id: 22,
    name: "The Purple Rift",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "#", "#", "R", "r", "E", "#"],
      ["#", ".", ".", "p", ".", ".", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Enter the purple gateway to unlock the side, shift red, and exit with the star."
  },
  {
    id: 23,
    name: "The Pressure Chamber",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "d", "S", "t", ".", "D", "E", "#"],
      ["#", ".", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", "D", "t", "d", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Navigate two interlocking chambers by flipping the pressure switches sequentially."
  },
  {
    id: 24,
    name: "Teleport Junction",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "#", "#", "1", "S", "r", "E"],
      ["#", ".", ".", ".", "R", ".", ".", ".", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Use the lower loop to turn Red, warp through the teleporter, and unlock the exit."
  },
  {
    id: 25,
    name: "Orange Trail",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "#", "G", "g", "E", "#"],
      ["#", ".", ".", ".", "S", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect the star in the bottom gap, change colors, and pass through both gates."
  },
  {
    id: 26,
    name: "The Locked Chamber",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "R", "r", "D", "E", "#"],
      ["#", ".", ".", ".", ".", "#", "#", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Collect the key, route to the Red Pad, then unlock the final door."
  },
  {
    id: 27,
    name: "Double Path Teleport",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "1", "#", "B", ".", "E", "#"],
      ["#", ".", ".", ".", "#", "1", "g", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Shift to Green, step into the portal, grab the star, and exit through the green gate."
  },
  {
    id: 28,
    name: "Spike Alley",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", "K", "X", "#", "D", "E", "#"],
      ["#", ".", ".", ".", ".", ".", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Snake around the spikes on the lower path to retrieve the key safely."
  },
  {
    id: 29,
    name: "The Red & Blue Dance",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "R", "r", "#", "B", "b", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Perform a double color-shift dance to clear the matching barriers."
  },
  {
    id: 30,
    name: "Grand Central Spectrum",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "B", "b", "Y", "y", "S", "E", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Shift green, shift blue, shift yellow. The ultimate tutorial spectrum!"
  },

  // --- HARD SECTION (Levels 31-40) ---
  {
    id: 31,
    name: "Prismatic Crossing",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", "R", "r", ".", "Y", "y", "S", "E", "#"],
      ["#", "#", "#", "S", "#", "#", "#", "#", "#"],
      ["#", "Y", "y", ".", "R", "r", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Double back to cross the red and yellow gates from different sides."
  },
  {
    id: 32,
    name: "Orange Crush",
    startPos: { x: 1, y: 3 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "O", "o", "S", "B", "b", "E", "#"],
      ["#", "#", "#", "#", ".", "#", "#", "#", "#"],
      ["#", "R", "r", "S", "O", "o", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Manage multiple Orange locks while collecting the yellow star caches."
  },
  {
    id: 33,
    name: "Symmetrical Squeeze",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", ".", "#", ".", "R", "r", "E", "#"],
      ["#", "S", "#", "#", "1", "#", "1", "#", "#", "S", "#"],
      ["#", "R", "r", ".", "#", ".", "#", ".", "B", "b", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Symmetrical rooms linked by portal 1 require dual shifts to unlock both wings."
  },
  {
    id: 34,
    name: "The Triple Lock",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "K", "#", "K", "#", "K", "#", "#", "#"],
      ["#", ".", ".", ".", ".", ".", ".", "D", "D", "D"],
      ["#", ".", "#", "#", "#", "#", "#", "#", "#", "E"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Locate all 3 keys to break open the massive triple lock vault."
  },
  {
    id: 35,
    name: "Laser Grid",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "X", ".", "X", ".", "X", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dodge the static laser lines by weaving up and down through the empty cells."
  },
  {
    id: 36,
    name: "Dodge & Shift",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", ".", "B", "b", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid the moving sentinel on the bottom floor while matching color gates.",
    obstacles: [
      {
        id: "h1",
        type: "patrol",
        speed: 2.5,
        path: [
          { x: 1, y: 2 },
          { x: 7, y: 2 }
        ]
      }
    ]
  },
  {
    id: 37,
    name: "Purple Rain",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "P", "p", "#", "O", "o", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Avoid the fast patroller on the lower path to complete your color sequence.",
    obstacles: [
      {
        id: "h2",
        type: "patrol",
        speed: 3.0,
        path: [
          { x: 1, y: 2 },
          { x: 7, y: 2 }
        ]
      }
    ]
  },
  {
    id: 38,
    name: "The Double Switch",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "d", "t", ".", "D", "E", "#"],
      ["#", ".", ".", ".", "D", ".", ".", "d", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Intersecting pressure switches toggle conflicting paths. Route with care."
  },
  {
    id: 39,
    name: "Spiral of Doom",
    startPos: { x: 3, y: 3 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", "E", "X", "X", "X", "S", "#"],
      ["#", ".", "#", "#", "#", "X", "#"],
      ["#", ".", ".", ".", "#", "X", "#"],
      ["#", "#", "#", ".", "#", "X", "#"],
      ["#", "K", "X", ".", ".", "X", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Unravel the spiral: collect the key at the bottom left, then escape to the top left."
  },
  {
    id: 40,
    name: "Quantum Maze",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "1", "#", "2", "#", "3", "#", "K", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "D", "#"],
      ["#", "1", "#", "2", "#", "3", "#", "S", ".", "D", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Three separate warp pairs contain pieces of the solution puzzle. Gather the key!"
  },

  // --- EXPERT SECTION (Levels 41-50) ---
  {
    id: 41,
    name: "Spectrum Ring",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "R", "r", "G", "g", "#"],
      ["#", ".", "#", "#", "#", "B", "#"],
      ["#", ".", ".", "E", "#", "b", "#"],
      ["#", ".", "#", "#", "#", "Y", "#"],
      ["#", "o", "O", "p", "P", "y", "#"],
      ["#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Travel in a full spectrum circle around the central core to reach the exit portal."
  },
  {
    id: 42,
    name: "The Gatekeeper",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "1", "#", "1", "S", "D", "E", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "K", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "A fast drone guards the narrow bridge. Use color-shifting and warp portals to bypass.",
    obstacles: [
      {
        id: "h3",
        type: "patrol",
        speed: 3.5,
        path: [
          { x: 1, y: 2 },
          { x: 9, y: 2 }
        ]
      }
    ]
  },
  {
    id: 43,
    name: "Two-Side Splicer",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "R", "r", "1", "#", "1", "B", "b", "E", "#"],
      ["#", ".", "B", "b", ".", "#", ".", "R", "r", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Symmetrical splicing. Cross-color pads allow you to navigate both chambers perfectly."
  },
  {
    id: 44,
    name: "Key Hunt",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "R", "r", "K", "#", "G", "g", "K", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "b", "S", "D", "D", "E", "#", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Dye red, get key 1, dye green, get key 2, then return blue to open the exit."
  },
  {
    id: 45,
    name: "The Ultimate Switch",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "t", "#", "d", "D", "1", "#", "E", "#", "#"],
      ["#", ".", "G", "g", ".", "#", ".", "#", "D", "#", "#"],
      ["#", ".", "1", "#", ".", "K", ".", ".", "d", "S", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Combines teleporters, color shifts, keys, and pressure doors in a massive trial."
  },
  {
    id: 46,
    name: "The Maze of Six",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "B", "b", "Y", "y", "P", "p", "O", "o", "E"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "All six spectrum shifts lined up in perfect progression. Speed and moves are key."
  },
  {
    id: 47,
    name: "Spike Corridor",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "X", ".", "X", ".", "X", ".", "X", "E", "#"],
      ["#", ".", "G", "g", "B", "b", "Y", "y", "S", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Weave through the spike ceiling and matching gate chambers to reach the portal."
  },
  {
    id: 48,
    name: "Warp & Dye",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "1", "#", "1", "B", "b", "E", "#"],
      ["#", ".", ".", "K", "#", "#", "#", "D", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Double back through the central portal to collect the key and change spectrum dyes."
  },
  {
    id: 49,
    name: "The Symmetrical Nexus",
    startPos: { x: 1, y: 1 },
    startColor: "blue",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "B", "b", ".", "#", ".", "R", "r", "E", "#"],
      ["#", "S", "#", "#", "1", "#", "1", "#", "#", "S", "#"],
      ["#", "R", "r", ".", "#", ".", "#", ".", "B", "b", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Solve both wings symmetrically by routing your cube through colors and warp portals."
  },
  {
    id: 50,
    name: "The Grand Finale: Master Spectrum",
    startPos: { x: 1, y: 1 },
    startColor: "red",
    grid: [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", "G", "g", "1", "#", "K", "D", ".", "#", ".", "E", "#"],
      ["#", ".", "X", ".", "#", "#", "Y", "#", ".", "#", ".", ".", "#"],
      ["#", ".", "1", ".", "B", "b", ".", "S", "t", "P", "D", "p", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ],
    description: "Conquer the ultimate spectral puzzle! Use every single mechanic you've learned to escape!"
  }
];

// BFS Solver function to verify level solvability
function verifyLevel(level) {
  const grid = level.grid;
  const startPos = level.startPos;
  const startColor = level.startColor;

  // Find all stars and keys in the original grid
  let originalKeyCount = 0;
  let originalStarCount = 0;
  const teleporterCoords = {}; // Maps portal symbol to array of positions
  
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      if (cell === 'K') originalKeyCount++;
      if (cell === 'S') originalStarCount++;
      if (['1', '2', '3', '4'].includes(cell)) {
        if (!teleporterCoords[cell]) teleporterCoords[cell] = [];
        teleporterCoords[cell].push({ x, y });
      }
    }
  }

  // State representation in BFS:
  // x, y, color, keys, collectedKeysSet, collectedStarsSet, plateFlipped
  // We can serialize state for visited set
  const queue = [];
  const visited = new Set();

  function serializeState(state) {
    const sortedKeys = Array.from(state.collectedKeys).sort().join(';');
    const sortedStars = Array.from(state.collectedStars).sort().join(';');
    return `${state.x},${state.y},${state.color},${state.keys},${sortedKeys},${sortedStars},${state.plateFlipped ? '1' : '0'}`;
  }

  const startState = {
    x: startPos.x,
    y: startPos.y,
    color: startColor,
    keys: 0,
    collectedKeys: new Set(),
    collectedStars: new Set(),
    plateFlipped: false,
    moves: 0
  };

  queue.push(startState);
  visited.add(serializeState(startState));

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
  ];

  let solved = false;
  let minMoves = Infinity;
  let solutionState = null;

  while (queue.length > 0) {
    const curr = queue.shift();

    // Check if we reached the exit
    const cellAtCurr = grid[curr.y][curr.x];
    if (cellAtCurr === 'E') {
      solved = true;
      if (curr.moves < minMoves) {
        minMoves = curr.moves;
        solutionState = curr;
      }
      continue;
    }

    for (const dir of directions) {
      let nx = curr.x + dir.dx;
      let ny = curr.y + dir.dy;

      // Boundary check
      if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length) continue;

      let cell = grid[ny][nx];

      // Gate check
      const isRedGateBlocked = cell === 'r' && curr.color !== 'red';
      const isGreenGateBlocked = cell === 'g' && curr.color !== 'green';
      const isBlueGateBlocked = cell === 'b' && curr.color !== 'blue';
      const isYellowGateBlocked = cell === 'y' && curr.color !== 'yellow';
      const isPurpleGateBlocked = cell === 'p' && curr.color !== 'purple';
      const isOrangeGateBlocked = cell === 'o' && curr.color !== 'orange';
      const isGateBlocked = isRedGateBlocked || isGreenGateBlocked || isBlueGateBlocked || isYellowGateBlocked || isPurpleGateBlocked || isOrangeGateBlocked;

      // Door check
      let isDoorLocked = false;
      let isDoorCollectible = false;

      // We need to resolve what cell is considering plateFlipped
      let actualCell = cell;
      if (cell === 'D') {
        actualCell = curr.plateFlipped ? 'd' : 'D';
      } else if (cell === 'd') {
        actualCell = curr.plateFlipped ? 'D' : 'd';
      }

      if (actualCell === 'D') {
        // If it's a door, check if we have keys and haven't unlocked it yet
        const doorKeyStr = `${nx},${ny}`;
        const doorAlreadyUnlocked = curr.collectedKeys.has(doorKeyStr); // reuse same key tracking as unlock tracking
        if (!doorAlreadyUnlocked) {
          if (curr.keys > 0) {
            isDoorCollectible = true; // can step onto it and consume key
          } else {
            isDoorLocked = true;
          }
        }
      }

      const isWall = cell === '#';
      const isSpike = cell === 'X';

      // Walls, locked gates, locked doors, and spikes are impassable
      if (isWall || isGateBlocked || isDoorLocked || isSpike) continue;

      // If we pass, we step onto (nx, ny)
      // Resolve collections and triggers
      let nextColor = curr.color;
      let nextKeys = curr.keys;
      const nextCollectedKeys = new Set(curr.collectedKeys);
      const nextCollectedStars = new Set(curr.collectedStars);
      let nextPlateFlipped = curr.plateFlipped;

      const cellCoordStr = `${nx},${ny}`;

      // Color Shift Pads
      if (['R', 'G', 'B', 'Y', 'P', 'O'].includes(actualCell)) {
        if (actualCell === 'R') nextColor = 'red';
        if (actualCell === 'G') nextColor = 'green';
        if (actualCell === 'B') nextColor = 'blue';
        if (actualCell === 'Y') nextColor = 'yellow';
        if (actualCell === 'P') nextColor = 'purple';
        if (actualCell === 'O') nextColor = 'orange';
      }

      // Star collectible
      if (actualCell === 'S' && !nextCollectedStars.has(cellCoordStr)) {
        nextCollectedStars.add(cellCoordStr);
      }

      // Key collectible
      if (actualCell === 'K' && !nextCollectedKeys.has(cellCoordStr)) {
        nextCollectedKeys.add(cellCoordStr);
        nextKeys++;
      }

      // Door unlocking (step onto D with key)
      if (isDoorCollectible) {
        const doorKeyStr = `${nx},${ny}`;
        nextCollectedKeys.add(doorKeyStr); // mark unlocked
        nextKeys--;
      }

      // Pressure plate toggle
      if (actualCell === 't') {
        nextPlateFlipped = !nextPlateFlipped;
      }

      // Teleporter warp
      let finalX = nx;
      let finalY = ny;
      if (['1', '2', '3', '4'].includes(actualCell)) {
        const teleId = actualCell;
        const pairs = teleporterCoords[teleId] || [];
        const partner = pairs.find(p => p.x !== nx || p.y !== ny);
        if (partner) {
          finalX = partner.x;
          finalY = partner.y;
        }
      }

      const nextState = {
        x: finalX,
        y: finalY,
        color: nextColor,
        keys: nextKeys,
        collectedKeys: nextCollectedKeys,
        collectedStars: nextCollectedStars,
        plateFlipped: nextPlateFlipped,
        moves: curr.moves + 1
      };

      const serialized = serializeState(nextState);
      if (!visited.has(serialized)) {
        visited.add(serialized);
        queue.push(nextState);
      }
    }
  }

  return {
    solved,
    minMoves,
    solutionState,
    originalStarCount,
    collectedStarCount: solutionState ? solutionState.collectedStars.size : 0
  };
}

// Run solver over all levels
console.log("=== RUNNING BFS PUZZLE VALIDATION ENGINE ===");
let allPassed = true;
LEVELS.forEach(lvl => {
  const result = verifyLevel(lvl);
  if (result.solved) {
    console.log(`✓ Level ${lvl.id}: "${lvl.name}" solved in ${result.minMoves} moves (Collected ${result.collectedStarCount}/${result.originalStarCount} stars).`);
  } else {
    console.log(`❌ Level ${lvl.id}: "${lvl.name}" is IMPOSSIBLE!`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("=== ALL 50 LEVELS SUCCESSFULLY SOLVED & RATED PERFECT! ===");
} else {
  console.log("=== VALIDATION FAILED! PLEASE ADJUST IMPOSSIBLE LEVELS! ===");
}
