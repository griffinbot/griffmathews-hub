export const MINI_PUZZLE = {
  grid: [
    ["S", "U", "N", "#", "P"],
    ["E", "A", "R", "L", "E"],
    ["A", "#", "T", "#", "N"],
    ["L", "E", "M", "O", "N"],
    ["#", "B", "I", "R", "D"],
  ],
  clues: {
    across: {
      1: "Daylight source in our solar system",
      4: "A poet's old-timey before",
      6: "Single answer abbreviation",
      7: "Citrus fruit that is bright yellow",
      8: "Flying animal with feathers",
    },
    down: {
      1: "Water body bordering land",
      2: "Common opening for " + '"To whom it may concern"',
      3: "Descriptive written language",
      4: "Writing instrument that leaves ink",
      5: "Tree that drops acorns",
    },
  },
};

export function isFillableCell(puzzle, row, col) {
  return Boolean(puzzle.grid[row] && puzzle.grid[row][col] && puzzle.grid[row][col] !== "#");
}

export function buildNumbering(puzzle) {
  let number = 1;
  const numbered = [];

  for (let row = 0; row < puzzle.grid.length; row += 1) {
    for (let col = 0; col < puzzle.grid[row].length; col += 1) {
      if (!isFillableCell(puzzle, row, col)) continue;

      const startsAcross = col === 0 || !isFillableCell(puzzle, row, col - 1);
      const startsDown = row === 0 || !isFillableCell(puzzle, row - 1, col);

      if (startsAcross || startsDown) {
        numbered.push({ number, row, col, startsAcross, startsDown });
        number += 1;
      }
    }
  }

  return numbered;
}

export function createInitialState(puzzle = MINI_PUZZLE) {
  const entries = puzzle.grid.map((row) =>
    row.map((cell) =>
      cell === "#"
        ? null
        : {
            value: "",
            mode: "pen",
            checked: false,
            revealed: false,
            incorrect: false,
          },
    ),
  );

  const first = buildNumbering(puzzle)[0];

  return {
    entries,
    cursor: { row: first.row, col: first.col },
    direction: "across",
    completed: false,
  };
}

export function getWordCells(puzzle, row, col, direction) {
  if (!isFillableCell(puzzle, row, col)) return [];

  const dr = direction === "across" ? 0 : 1;
  const dc = direction === "across" ? 1 : 0;

  let startRow = row;
  let startCol = col;

  while (isFillableCell(puzzle, startRow - dr, startCol - dc)) {
    startRow -= dr;
    startCol -= dc;
  }

  const cells = [];
  let currentRow = startRow;
  let currentCol = startCol;

  while (isFillableCell(puzzle, currentRow, currentCol)) {
    cells.push({ row: currentRow, col: currentCol });
    currentRow += dr;
    currentCol += dc;
  }

  return cells;
}

export function moveCursor(puzzle, state, dr, dc) {
  let row = state.cursor.row + dr;
  let col = state.cursor.col + dc;

  while (row >= 0 && col >= 0 && row < puzzle.grid.length && col < puzzle.grid[0].length) {
    if (isFillableCell(puzzle, row, col)) {
      state.cursor = { row, col };
      return true;
    }
    row += dr;
    col += dc;
  }

  return false;
}

export function stepForward(puzzle, state) {
  const moved =
    state.direction === "across"
      ? moveCursor(puzzle, state, 0, 1)
      : moveCursor(puzzle, state, 1, 0);

  if (!moved) {
    jumpToNextClue(puzzle, state, 1);
  }
}

export function stepBackward(puzzle, state) {
  const moved =
    state.direction === "across"
      ? moveCursor(puzzle, state, 0, -1)
      : moveCursor(puzzle, state, -1, 0);

  if (!moved) {
    jumpToNextClue(puzzle, state, -1);
  }
}

export function enterLetter(puzzle, state, rawLetter, mode = "pen") {
  const letter = rawLetter.toUpperCase();
  if (!/^[A-Z]$/.test(letter)) return;

  const { row, col } = state.cursor;
  const entry = state.entries[row][col];
  if (!entry) return;

  entry.value = letter;
  entry.mode = mode;
  entry.checked = false;
  entry.incorrect = false;

  stepForward(puzzle, state);
  state.completed = isSolved(puzzle, state);
}

export function eraseCurrent(puzzle, state) {
  const { row, col } = state.cursor;
  const current = state.entries[row][col];
  if (!current) return;

  if (current.value) {
    current.value = "";
    current.checked = false;
    current.incorrect = false;
    state.completed = false;
    return;
  }

  stepBackward(puzzle, state);
  const previous = state.entries[state.cursor.row][state.cursor.col];
  if (previous) {
    previous.value = "";
    previous.checked = false;
    previous.incorrect = false;
  }
  state.completed = false;
}

export function toggleDirection(state) {
  state.direction = state.direction === "across" ? "down" : "across";
}

export function jumpToNextClue(puzzle, state, delta = 1) {
  const directionKey = state.direction === "across" ? "startsAcross" : "startsDown";
  const starts = buildNumbering(puzzle).filter((item) => item[directionKey]);
  const index = starts.findIndex((item) => item.row === state.cursor.row && item.col === state.cursor.col);
  const base = index >= 0 ? index : 0;
  const nextIndex = (base + delta + starts.length) % starts.length;
  const next = starts[nextIndex];

  if (next) {
    state.cursor = { row: next.row, col: next.col };
  }
}

export function checkAll(puzzle, state) {
  for (let row = 0; row < puzzle.grid.length; row += 1) {
    for (let col = 0; col < puzzle.grid[row].length; col += 1) {
      if (!isFillableCell(puzzle, row, col)) continue;
      const entry = state.entries[row][col];
      entry.checked = true;
      entry.incorrect = entry.value !== "" && entry.value !== puzzle.grid[row][col];
    }
  }
  state.completed = isSolved(puzzle, state);
}

export function revealAll(puzzle, state) {
  for (let row = 0; row < puzzle.grid.length; row += 1) {
    for (let col = 0; col < puzzle.grid[row].length; col += 1) {
      if (!isFillableCell(puzzle, row, col)) continue;
      const entry = state.entries[row][col];
      entry.value = puzzle.grid[row][col];
      entry.revealed = true;
      entry.checked = false;
      entry.incorrect = false;
      entry.mode = "pen";
    }
  }
  state.completed = true;
}

export function clearPuzzle(state) {
  for (const row of state.entries) {
    for (const entry of row) {
      if (!entry) continue;
      entry.value = "";
      entry.mode = "pen";
      entry.checked = false;
      entry.revealed = false;
      entry.incorrect = false;
    }
  }
  state.completed = false;
}

export function isSolved(puzzle, state) {
  for (let row = 0; row < puzzle.grid.length; row += 1) {
    for (let col = 0; col < puzzle.grid[row].length; col += 1) {
      if (!isFillableCell(puzzle, row, col)) continue;
      if (state.entries[row][col].value !== puzzle.grid[row][col]) {
        return false;
      }
    }
  }
  return true;
}

export function formatSeconds(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
