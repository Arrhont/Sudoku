import React from 'react';
import './Cell.css';

export function Cell(props) {
    const { value, cellId, quadrantId, changeState } = props;

    return (
        <input
            className="Cell"
            value={(value === 0) ? '' : value}
            onChange={(event) => changeState(quadrantId, cellId, event.target.value)}
        ></input>
    );
}
