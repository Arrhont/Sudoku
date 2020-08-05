import React from 'react';
import './Quadrant.css';
import { Cell } from './Cell';

export function Quadrant(props) {
    const { numbers, quadrantId, changeState } = props;

    return (
        <div
            className="Quadrant"
            style={{
                gridTemplateColumns: `repeat(${Math.sqrt(
                    numbers.length
                )}, 1fr)`,
                gridTemplateRows: `repeat(${Math.sqrt(numbers.length)}, 1fr)`,
            }}
        >
            {numbers.map((value, index) => (
                <Cell
                    value={value}
                    key={index}
                    cellId={index}
                    quadrantId={quadrantId}
                    changeState={changeState}
                ></Cell>
            ))}
        </div>
    );
}
