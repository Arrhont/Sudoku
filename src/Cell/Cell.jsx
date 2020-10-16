import React, { useContext } from 'react';
import { SettingsContext, HoveredContext } from '../Sudoku/Sudoku';
import { ClassName } from '../utils';
import './Cell.css';

export function Cell(props) {
    const settings = useContext(SettingsContext);
    const [hoveredCell, setHoveredCell] = useContext(HoveredContext);

    const { value, cellId, quadrantId, setCellValue, sudokuDimension } = props;

    function shouldHighlightCursor(settings, hoveredCell) {
        if (settings.highlight && hoveredCell.quadrantId !== null) {
            if (
                hoveredCell.quadrantId === quadrantId &&
                hoveredCell.cellId === cellId
            ) {
                return false;
            }

            const [hoveredCellColumnId, hoveredCellRowId] = calculateCoords(
                hoveredCell.quadrantId,
                hoveredCell.cellId,
                sudokuDimension
            );
            const [cellColumnId, cellRowId] = calculateCoords(
                quadrantId,
                cellId,
                sudokuDimension
            );

            if (
                hoveredCellColumnId === cellColumnId ||
                hoveredCellRowId === cellRowId
            ) {
                return true;
            }
        }

        return false;
    }

    function shouldHighlightSameValues(settings, value, hoveredCellValue) {
        if (settings.easyMode && value === hoveredCellValue && value !== 0) {
            return true;
        }

        return false;
    }

    function calculateCoords(quadrantId, cellId, sudokuDimension) {
        const positionFromLeftByQuadrantId = quadrantId % sudokuDimension;
        const positionFromTopByQuadrantId = Math.floor(
            quadrantId / sudokuDimension
        );

        const positionFromLeftByCellId = cellId % sudokuDimension;
        const positionFromTopByCellId = Math.floor(cellId / sudokuDimension);

        const columnId =
            positionFromLeftByQuadrantId * sudokuDimension +
            positionFromLeftByCellId;
        const rowId =
            positionFromTopByQuadrantId * sudokuDimension +
            positionFromTopByCellId;

        return [columnId, rowId];
    }

    return (
        <input
            className={new ClassName('Cell')
                .addByCondition(
                    shouldHighlightCursor(settings, hoveredCell),
                    'Cell_Highlighted'
                )
                .addByCondition(
                    shouldHighlightSameValues(
                        settings,
                        value,
                        hoveredCell.value
                    ),
                    'Cell_CellWithSameValue'
                )
                .toString()}
            value={value === 0 ? '' : value}
            onChange={(event) =>
                setCellValue(quadrantId, cellId, event.target.value)
            }
            onMouseEnter={() => setHoveredCell({ quadrantId, cellId, value })}
            onMouseLeave={() => setHoveredCell({ quadrantId: null, cellId: null, value: null })}
        ></input>
    );
}
