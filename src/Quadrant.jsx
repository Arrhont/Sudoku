import React from 'react';
import './Quadrant.css';
import { Cell } from './Cell';

export function Quadrant(props) {
    const { numbers, quadrantId, setState } = props;

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
                    setState={setState}
                ></Cell>
            ))}
        </div>
    );
}
