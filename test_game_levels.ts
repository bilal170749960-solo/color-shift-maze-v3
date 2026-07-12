import { LEVELS } from './src/levels';
import { Level, Position } from './src/types';

interface SolverState {
  x: number;
  y: number;
  color: string;
  keys: number;
  collectedStars: string; // sorted list of coordinates e.g. "x,y;x,y"
  unlockedDoors: string;  // sorted list of coordinates of doors unlocked by keys
  plateFlipped: boolean;  // pressure plate flipped state
}

function serializeState(s: SolverState): string {
  return `${s.x},${s.y},${s.color},${s.keys},[${s.collectedStars}],[${s.unlockedDoors}],${s.plateFlipped ? '1' : '0'}`;
}

export function validateLevel(level: Level): {
  solved: boolean;
  minMoves: number;
  allStarsReached: boolean;
  errors: string[];
} {
  const grid = level.grid;
  const startPos = level.startPos;
  const startColor = level.startColor;

  const starCoords: string[] = [];
  const keyCoords: string[] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      if (cell === 'S') starCoords.push(`${x},${y}`);
      if (cell === 'K') keyCoords.push(`${x},${y}`);
    }
  }

  const reachedStars = new Set<string>();
  let exitReached = false;

  const visited = new Set<string>();
  const startState: SolverState = {
    x: startPos.x,
    y: startPos.y,
    color: startColor,
    keys: 0,
    collectedStars: "",
    unlockedDoors: "",
    plateFlipped: false
  };

  const queue: { state: SolverState; moves: number }[] = [{ state: startState, moves: 0 }];
  visited.add(serializeState(startState));

  // Mark starting position as visited for elements
  const checkInitialAndMark = (x: number, y: number, state: SolverState) => {
    const cell = grid[y][x];
    const coord = `${x},${y}`;
    if (cell === 'S') reachedStars.add(coord);
    if (cell === 'E') exitReached = true;
  };
  checkInitialAndMark(startPos.x, startPos.y, startState);

  let minMoves = -1;
  let bestEndState: SolverState | null = null;
  let head = 0;

  const portalMap: Record<string, Position[]> = {};
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      if (['1', '2', '3', '4'].includes(cell)) {
        if (!portalMap[cell]) portalMap[cell] = [];
        portalMap[cell].push({ x, y });
      }
    }
  }

  while (head < queue.length) {
    const { state, moves } = queue[head++];

    if (grid[state.y][state.x] === 'E') {
      if (minMoves === -1 || moves < minMoves) {
        minMoves = moves;
        bestEndState = state;
      }
    }

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];

    for (const d of dirs) {
      const nx = state.x + d.dx;
      const ny = state.y + d.dy;

      if (ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[ny].length) continue;

      const cell = grid[ny][nx];
      if (cell === '#') continue; // Wall
      if (cell === 'X') continue; // Spikes

      // Resolve door state (D or d)
      let actualCell = cell;
      if (cell === 'D') {
        actualCell = state.plateFlipped ? 'd' : 'D';
      } else if (cell === 'd') {
        actualCell = state.plateFlipped ? 'D' : 'd';
      }

      // Check gate barriers
      if (actualCell === 'r' && state.color !== 'red') continue;
      if (actualCell === 'g' && state.color !== 'green') continue;
      if (actualCell === 'b' && state.color !== 'blue') continue;
      if (actualCell === 'y' && state.color !== 'yellow') continue;
      if (actualCell === 'p' && state.color !== 'purple') continue;
      if (actualCell === 'o' && state.color !== 'orange') continue;

      // Check locked doors ('D') and keys
      let nextKeys = state.keys;
      const unlockedSet = new Set(state.unlockedDoors ? state.unlockedDoors.split(';') : []);
      const coordStr = `${nx},${ny}`;

      if (actualCell === 'D' && !unlockedSet.has(coordStr)) {
        if (nextKeys > 0) {
          nextKeys--;
          unlockedSet.add(coordStr);
        } else {
          continue; // Locked and no keys
        }
      }

      // If we got here, we can transition to (nx, ny)
      let nextColor = state.color;
      const starSet = new Set(state.collectedStars ? state.collectedStars.split(';') : []);

      // Color shift pads
      if (['R', 'G', 'B', 'Y', 'P', 'O'].includes(actualCell)) {
        if (actualCell === 'R') nextColor = 'red';
        else if (actualCell === 'G') nextColor = 'green';
        else if (actualCell === 'B') nextColor = 'blue';
        else if (actualCell === 'Y') nextColor = 'yellow';
        else if (actualCell === 'P') nextColor = 'purple';
        else if (actualCell === 'O') nextColor = 'orange';
      }

      // Collect star
      if (actualCell === 'S' && !starSet.has(coordStr)) {
        starSet.add(coordStr);
        reachedStars.add(coordStr);
      }

      // Collect key (keys can be collected once per coordinate in a path)
      if (actualCell === 'K' && !unlockedSet.has(`key_${coordStr}`)) {
        unlockedSet.add(`key_${coordStr}`);
        nextKeys++;
      }

      // Pressure plate toggle
      let nextPlateFlipped = state.plateFlipped;
      if (actualCell === 't') {
        nextPlateFlipped = !nextPlateFlipped;
      }

      // Exit portal check
      if (actualCell === 'E') {
        exitReached = true;
      }

      // Teleporters
      let finalX = nx;
      let finalY = ny;
      if (['1', '2', '3', '4'].includes(actualCell)) {
        const pairs = portalMap[actualCell] || [];
        const partner = pairs.find(p => p.x !== nx || p.y !== ny);
        if (partner) {
          finalX = partner.x;
          finalY = partner.y;
        }
      }

      const nextState: SolverState = {
        x: finalX,
        y: finalY,
        color: nextColor,
        keys: nextKeys,
        collectedStars: Array.from(starSet).sort().join(';'),
        unlockedDoors: Array.from(unlockedSet).sort().join(';'),
        plateFlipped: nextPlateFlipped
      };

      const serialized = serializeState(nextState);
      if (!visited.has(serialized)) {
        visited.add(serialized);
        queue.push({ state: nextState, moves: moves + 1 });
      }
    }
  }

  const errors: string[] = [];
  if (!exitReached) errors.push("Exit 'E' is unreachable");

  const unreachedStars = starCoords.filter(s => !reachedStars.has(s));
  const allStarsReached = unreachedStars.length === 0;

  return {
    solved: exitReached && errors.length === 0,
    minMoves,
    allStarsReached,
    errors
  };
}

console.log("=== ADVENTURE MODE LEVELS AUDIT ===");
let allPassed = true;
LEVELS.forEach(level => {
  const res = validateLevel(level);
  if (res.solved) {
    console.log(`Level ${level.id.toString().padStart(2, ' ')}: "${level.name}" -> SOLVED (${res.minMoves} moves). Stars fully reachable: ${res.allStarsReached}`);
  } else {
    console.log(`Level ${level.id.toString().padStart(2, ' ')}: "${level.name}" -> FAILED: ${res.errors.join(', ')}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\nALL ADVENTURE LEVELS ARE SOLVABLE!");
} else {
  console.log("\nSOME LEVELS ARE UNSOLVABLE!");
}
