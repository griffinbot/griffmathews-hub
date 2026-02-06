import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MINI_PUZZLE,
  checkAll,
  clearPuzzle,
  createInitialState,
  enterLetter,
  formatSeconds,
  isSolved,
  jumpToNextClue,
  revealAll,
  toggleDirection,
} from '../src/lib/miniCrossword.js';

test('letter entry advances cursor', () => {
  const state = createInitialState(MINI_PUZZLE);
  const start = { ...state.cursor };
  enterLetter(MINI_PUZZLE, state, 's', 'pen');
  assert.equal(state.entries[start.row][start.col].value, 'S');
  assert.notDeepEqual(state.cursor, start);
});

test('tab jumps to next clue in active direction', () => {
  const state = createInitialState(MINI_PUZZLE);
  jumpToNextClue(MINI_PUZZLE, state, 1);
  assert.deepEqual(state.cursor, { row: 0, col: 4 });
});

test('direction toggles across/down', () => {
  const state = createInitialState(MINI_PUZZLE);
  assert.equal(state.direction, 'across');
  toggleDirection(state);
  assert.equal(state.direction, 'down');
});

test('check marks incorrect cells', () => {
  const state = createInitialState(MINI_PUZZLE);
  state.entries[0][0].value = 'Z';
  checkAll(MINI_PUZZLE, state);
  assert.equal(state.entries[0][0].incorrect, true);
});

test('reveal completes puzzle and clear resets', () => {
  const state = createInitialState(MINI_PUZZLE);
  revealAll(MINI_PUZZLE, state);
  assert.equal(isSolved(MINI_PUZZLE, state), true);
  clearPuzzle(state);
  assert.equal(state.entries[0][0].value, '');
  assert.equal(state.completed, false);
});

test('timer formatter output', () => {
  assert.equal(formatSeconds(0), '00:00');
  assert.equal(formatSeconds(125), '02:05');
});
