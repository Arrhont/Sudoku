import React, { useState } from 'react';
import { Quadrant } from '../Quadrant/Quadrant';
import cloneDeep from 'lodash/cloneDeep';
import { Sudoku as SudokuSolver } from './solver'
import './Sudoku.css';

export function Sudoku() {
    const [quadrants, setQuadrants] = useState(createEmptyQuadrantsState());
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
        debugger;
        sudoku.solve();

        setQuadrants(sudoku.getValuesByQuadrant());
    }

    return (
        <div>
            <div
                className="Sudoku"
                style={{
                    gridTemplateColumns: `repeat(${quadrantSize}, 1fr)`,
                    gridTemplateRows: `repeat(${quadrantSize}, 1fr)`,
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
        </div>
    );
}
