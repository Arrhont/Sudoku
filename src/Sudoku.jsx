import React, { useState } from 'react';
import { Quadrant } from './Quadrant';
import cloneDeep from 'lodash/cloneDeep';
import isNaN from 'lodash/isNaN';
import './Sudoku.css';

export function Sudoku() {
  const [state, setState] = useState(createInitialState());
  const MAX = 9;

  function createInitialState(dimension = 3) {
    const state = [];

    for (let i = 0; i < dimension * dimension; i++) {
      const quadrant = new Array(dimension * dimension);

      for (let j = 0; j < dimension * dimension; quadrant[j++] = 0);

      state[i] = quadrant;
    }

    return state;
  }

  function changeState(quadrantId, cellId, value) {
    const prevValue = state[quadrantId][cellId];
    const newState = cloneDeep(state);

    const validatedValue = validate(value, prevValue);
    newState[quadrantId][cellId] = validatedValue;

    setState(newState);
  }

  function validate(value, prevValue) {
    const validatedValue = Number(value);

    if (isNaN(validatedValue)) {
      return prevValue;
    }

    if (validatedValue > MAX) {
        return prevValue;
    }

    return validatedValue;
  }

  return (
    <div>
      <div
        className="Sudoku"
        style={{
          gridTemplateColumns: `repeat(${Math.sqrt(state.length)}, 1fr)`,
          gridTemplateRows: `repeat(${Math.sqrt(state.length)}, 1fr)`,
        }}
      >
        {state.map((quadrant, index) => (
          <Quadrant
            numbers={quadrant}
            key={index}
            quadrantId={index}
            changeState={changeState}
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
