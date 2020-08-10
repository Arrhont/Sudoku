import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Sudoku } from './Sudoku/Sudoku';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Sudoku />
      </header>
    </div>
  );
}

export default App;
