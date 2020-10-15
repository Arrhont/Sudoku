import React from 'react';
import './Quadrant.css';
import { Cell } from '../Cell/Cell';

export function Quadrant(props) {
    const { cellValues, quadrantId, setCellValue } = props;
    const quadrantSize = Math.sqrt(cellValues.length);

    return (
        <div
            className="Quadrant"
            style={{
                gridTemplateColumns: `repeat(${quadrantSize}, 1fr)`,
                gridTemplateRows: `repeat(${quadrantSize}, 1fr)`,
            }}
        >
            {cellValues.map((cellValue, index) => (
                <Cell
                    value={cellValue}
                    key={index}
                    cellId={index}
                    quadrantId={quadrantId}
                    sudokuDimension={Math.sqrt(cellValues.length)}
                    setCellValue={setCellValue}
                ></Cell>
            ))}
        </div>
    );
}
