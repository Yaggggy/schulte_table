import React, { useState, useEffect, useRef } from 'react';
import '../styles/GamePage.css';

const GamePage = () => {
  const [grid, setGrid] = useState([]);
  const [nextNum, setNextNum] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const size = 5; // Default 5x5 for now

  // Timer Ref to clear interval easily
  const timerRef = useRef(null);

  // Generate Grid
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const numbers = Array.from({ length: size * size }, (_, i) => i + 1);
    // Fisher-Yates Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setGrid(numbers);
    setNextNum(1);
    setElapsed(0);
    setIsGameActive(false);
    setFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleCellClick = (num) => {
    if (finished) return;

    // Logic: Timer starts ONLY when 1 is clicked
    if (num === 1 && !isGameActive) {
      setIsGameActive(true);
      const start = Date.now();
      setStartTime(start);
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - start) / 1000);
      }, 100);
    }

    if (num === nextNum) {
      if (num === size * size) {
        endGame();
      } else {
        setNextNum(nextNum + 1);
      }
    }
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setFinished(true);
    setIsGameActive(false);
    // TODO: Send score to Backend here
  };

  return (
    <div className="game-container">
      <div className="sidebar">
        <div className="info-box">
          <h3>Find: {finished ? "Done!" : nextNum}</h3>
          <h3>Time: {elapsed.toFixed(1)}s</h3>
        </div>
        <button onClick={resetGame}>Reset</button>
      </div>
      
      <div 
        className="grid-container" 
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {grid.map((num) => (
          <div 
            key={num} 
            className={`grid-cell ${num < nextNum ? 'clicked' : ''}`}
            onClick={() => handleCellClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;