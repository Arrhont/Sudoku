import React from 'react';
import './Cell.css';
import  cloneDeep   from 'lodash/cloneDeep';

export function Cell(props) {
    const { value, cellId, quadrantId, setState } = props;

    return (
        <input
            className="Cell"
            value={value}
            onChange={(event) => setState((prevState) => {
              const newState = cloneDeep(prevState);
              debugger;
              newState[quadrantId][cellId] = Number(event.target.value);
              debugger;
              return newState;
            })}
        ></input>
    );
}
