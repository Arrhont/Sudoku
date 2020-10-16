import React, { useState } from 'react';
import { Quadrant } from '../Quadrant/Quadrant';
import { Sudoku as SudokuSolver } from './solver';
import { defaultSettings } from '../settings';
import cloneDeep from 'lodash/cloneDeep';
import './Sudoku.css';

const hardmock = [
  [0, 1, 2, 0, 0, 0, 5, 0, 0],
  [4, 0, 0, 6, 0, 0, 0, 9, 2],
  [9, 0, 7, 0, 0, 2, 0, 0, 4],
  [0, 0, 8, 4, 0, 5, 7, 0, 0],
  [0, 0, 0, 8, 0, 0, 0, 0, 0],
  [0, 1, 9, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 5, 0, 4, 7, 0, 0],
  [8, 0, 0, 0, 2, 0, 3, 0, 0],
];

const mediumMock = [
  [0, 0, 0, 0, 0, 6, 0, 0, 9],
  [0, 8, 0, 0, 5, 4, 6, 0, 0],
  [7, 0, 4, 0, 0, 0, 1, 0, 0],
  [0, 0, 2, 5, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 3],
  [5, 7, 8, 3, 0, 0, 0, 1, 2],
  [0, 3, 0, 0, 6, 0, 9, 0, 0],
  [0, 0, 1, 4, 0, 5, 3, 0, 0],
  [6, 0, 0, 8, 3, 7, 0, 5, 0],
];

export const SettingsContext = React.createContext();
export const HoveredContext = React.createContext();

export function Sudoku() {
  const [quadrants, setQuadrants] = useState(mediumMock);
  const [hoveredCell, setHoveredCell] = useState({ quadrantId: null, cellId: null, value: null });
  const [settings, setSettings] = useState(defaultSettings);

  const sudokuSize = quadrants.length;
  const quadrantSize = Math.sqrt(quadrants.length);

  function createEmptyQuadrantsState(size = 9) {
    const state = [];

    for (let i = 0; i < size; i++) {
      const quadrant = new Array(size).fill(0);
      state[i] = quadrant;
    }

    return state;
  }

  function setCellValue(quadrantId, cellId, value) {
    const newQuadrants = cloneDeep(quadrants);
    const numberedValue = Number(value);

    if (!validate(numberedValue)) {
      return;
    }

    newQuadrants[quadrantId][cellId] = numberedValue;

    setQuadrants(newQuadrants);
  }

  function validate(value) {
    if (isNaN(value)) {
      return false;
    }

    if (value > sudokuSize) {
      return false;
    }

    return true;
  }

  function solve() {
    const sudoku = new SudokuSolver(quadrants);
    console.log(sudoku);
    sudoku.solve();

    setQuadrants(sudoku.getValuesByQuadrants());
  }

  function toggleColumnAndRowHighLight() {
    setSettings((prevSettings) => {
      const newSettings = cloneDeep(prevSettings);
      newSettings.highlight = !prevSettings.highlight;

      return newSettings;
    });
  }

  function toggleEasyMode() {
    setSettings((prevSettings) => {
      const newSettings = cloneDeep(prevSettings);
      newSettings.easyMode = !prevSettings.easyMode;

      return newSettings;
    });
  }

  return (
    <SettingsContext.Provider value={settings}>
      <HoveredContext.Provider value={[hoveredCell, setHoveredCell]}>
        <div
          className="Sudoku"
          style={{
            gridTemplateColumns: `repeat(${quadrantSize}, 1fr)`,
            gridTemplateRows: `repeat(${quadrantSize}, 1fr)`,
          }}
          onKeyDown={(event) => {
            if(hoveredCell.value !== null) {
              console.log(event.key);
              setCellValue(hoveredCell.quadrantId, hoveredCell.cellId, event.key);
            }
          }}
        >
          {quadrants.map((quadrant, index) => (
            <Quadrant
              cellValues={quadrant}
              key={index}
              quadrantId={index}
              setCellValue={setCellValue}
            />
          ))}
        </div>
        <input
          type="number"
          value={quadrantSize}
          onChange={(event) => {
            const size = event.target.value * event.target.value;
            setQuadrants(createEmptyQuadrantsState(size));
          }}
        ></input>
        <div>
          <button onClick={solve}>Решить</button>
        </div>
        <div>
          <input type="checkbox" onChange={toggleColumnAndRowHighLight}></input>{' '}
          Подсвечивать колонки и столбцы
        </div>
        <div>
          <input type="checkbox" onChange={toggleEasyMode}></input>{' '}
          Простой режим
        </div>
      </HoveredContext.Provider>
    </SettingsContext.Provider>
  );
}
