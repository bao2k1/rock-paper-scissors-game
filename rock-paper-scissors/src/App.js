// src/App.js
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Game from './components/Game';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background: #f0f2f5;
    color: #333;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Game />
    </>
  );
}

export default App;