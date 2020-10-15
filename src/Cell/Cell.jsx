import React, { useContext } from 'react';
import { SettingsContext, HoveredContext } from '../Sudoku/Sudoku';
import './Cell.css';

export function Cell(props) {
  const settings = useContext(SettingsContext);
  const [hoveredCell, setHoveredCell] = useContext(HoveredContext);

  const { value, cellId, quadrantId, setCellValue, sudokuDimension } = props;

  function shouldBeHighlighted(settings, hoveredCell) {
    if (settings.highlight && hoveredCell) {
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

  function calculateCoords(quadrantId, cellId, sudokuDimension) {
    const positionFromLeftByQuadrantId = quadrantId % sudokuDimension;
    const positionFromTopByQuadrantId = Math.floor(quadrantId / sudokuDimension);

    const positionFromLeftByCellId = cellId % sudokuDimension;
    const positionFromTopByCellId = Math.floor(cellId / sudokuDimension);

    const columnId = positionFromLeftByQuadrantId * sudokuDimension + positionFromLeftByCellId;
    const rowId = positionFromTopByQuadrantId * sudokuDimension + positionFromTopByCellId;

    return [columnId, rowId];
  }

  return (
    <input
      className={
        shouldBeHighlighted(settings, hoveredCell)
          ? "Cell Cell_Highlighted"
          : "Cell"
      }
      value={value === 0 ? '' : value}
      onChange={(event) => setCellValue(quadrantId, cellId, event.target.value)}
      onMouseEnter={() => setHoveredCell({ quadrantId, cellId })}
      onMouseLeave={() => setHoveredCell()}
    ></input>
  );
}
