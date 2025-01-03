import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: 100%;
  max-width: 600px;
  aspect-ratio: ${(props) => props.columns / props.rows};
  background-color: solid rgba(255, 255, 255, 0.05);
  gap: 5px;

`;

const Cell = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => (props.color ? props.color : 'black')};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.1s ease;
  opacity: 1;
`;

const ControlsWrapper = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #ff9800;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e68a00;
  }
`;

const sunlightColors = ['#8B0000', '#FF4500', '#FFD700', '#32CD32', '#1E90FF', '#800080', '#8A2BE2'];

const generateGradient = (length, color) => {
  const [r, g, b] = color.match(/\w\w/g).map(hex => parseInt(hex, 16));
  return Array.from({ length }, (_, i) => {
    const factor = i / length;
    const dimColor = `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
    return dimColor;
  });
};

const FallingRain = ({ rows, columns, snakeLength, speed, currentColor, isRunning }) => {
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () => Array(columns).fill(null))
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => row.slice());
        const gradient = generateGradient(snakeLength, currentColor);

        for (let col = 0; col < columns; col++) {
          for (let row = rows - 1; row >= 0; row--) {
            if (newGrid[row][col]) {
              const colorIndex = gradient.indexOf(newGrid[row][col]);
              newGrid[row][col] = null;
              if (row + 1 < rows && colorIndex >= 0) {
                newGrid[row + 1][col] = gradient[colorIndex];
              }
            }
          }

          // Spawn new snake at the top row
          if (!newGrid[0][col] && Math.random() < 0.05) {
            for (let i = 0; i < snakeLength; i++) {
              if (i < rows) {
                newGrid[i][col] = gradient[i];
              }
            }
          }
        }

        return newGrid;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [columns, rows, snakeLength, speed, currentColor, isRunning]);

  useEffect(() => {
    setGrid(prevGrid => {
      const gradient = generateGradient(snakeLength, currentColor);
      return prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell) {
            const index = Math.min(snakeLength - 1, rowIndex); // Match color index
            return gradient[index];
          }
          return cell;
        })
      );
    });
  }, [currentColor, snakeLength]);

  return (
    <GridWrapper rows={rows} columns={columns}>
      {grid.flat().map((color, idx) => (
        <Cell key={idx} color={color} />
      ))}
    </GridWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #121212;
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box; /* This ensures padding is included in the 100vh */
`;


const Header = styled.h1`
  margin-bottom: 20px;
  color: #ff9800;
`;

const App = () => {
  const rows = 15;
  const columns = 20;
  const snakeLength = 5;
  const speed = 100;

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prevIndex => (prevIndex + 1) % sunlightColors.length);
    }, 5000); // Color change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentColor = sunlightColors[currentColorIndex];

  return (
    <AppWrapper>
      <Header>Falling Rain Pattern</Header>
      <FallingRain
        rows={rows}
        columns={columns}
        snakeLength={snakeLength}
        speed={speed}
        currentColor={currentColor}
        isRunning={isRunning}
      />
      <ControlsWrapper>
        <Button onClick={() => setIsRunning(prev => !prev)}>
          {isRunning ? 'Stop' : 'Start'}
        </Button>
      </ControlsWrapper>
    </AppWrapper>

  );
};

export default App;
