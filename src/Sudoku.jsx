import React, { useState } from 'react';
import { Quadrant } from './Quadrant';
import './Sudoku.css';

export function Sudoku() {
    const [state, setState] = useState(createInitialState());
    
    function createInitialState(dimension = 3) {
        const state = [];

        for (let i = 0; i < dimension * dimension; i++) {
            const quadrant = new Array(dimension * dimension);

            for (let j = 0; j < dimension * dimension; quadrant[j++] = 0);

            state[i] = quadrant;
        }

        return state;
    }

    return (
        <div>
            <div
                className="Sudoku"
                style={{
                    gridTemplateColumns: `repeat(${Math.sqrt(
                        state.length
                    )}, 1fr)`,
                    gridTemplateRows: `repeat(${Math.sqrt(state.length)}, 1fr)`,
                }}
            >
                {state.map((quadrant, index) => (
                    <Quadrant
                        numbers={quadrant}
                        key={index}
                        quadrantId={index}
                        setState={setState}
                    />
                ))}
            </div>
            <button
                onClick={() =>
                    setState((prevState) =>
                        createInitialState(Math.sqrt(prevState.length) + 1)
                    )
                }
            >
                Увеличить размер
            </button>
            <button
                onClick={() =>
                    setState((prevState) =>
                        createInitialState(Math.sqrt(prevState.length) - 1)
                    )
                }
            >
                Уменьшить размер
            </button>
        </div>
    );
}
