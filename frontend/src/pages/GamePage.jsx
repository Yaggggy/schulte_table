import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/GamePage.css';

const GamePage = () => {
  const navigate = useNavigate();
  
  // Game States
  const [gameState, setGameState] = useState('SETUP'); // 'SETUP', 'PLAYING', 'FINISHED'
  
  // Settings
  const [gridSize, setGridSize] = useState(5);
  const [gameMode, setGameMode] = useState('STANDARD'); // 'STANDARD' or 'REVERSE'
  const [visualFeedback, setVisualFeedback] = useState(true); // Toggle green highlight
  
  // Gameplay Data
  const [grid, setGrid] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ best: 0, average: 0, last: 0 });

  const timerRef = useRef(null);

  // --- Fetch Stats ---
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios.get(`${API_URL}/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.log("Backend not connected yet"));
  }, []);

  // --- Game Logic ---
  const startGame = () => {
    const totalCells = gridSize * gridSize;
    const numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
    
    // Fisher-Yates Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    setGrid(numbers);
    
    // Set Target based on Mode
    if (gameMode === 'REVERSE') {
        setCurrentTarget(totalCells); // Start from Max (e.g., 25)
    } else {
        setCurrentTarget(1); // Start from 1
    }

    setElapsed(0);
    setStartTime(null);
    setGameState('PLAYING');
  };

  const handleCellClick = (num) => {
    // 1. Start Timer on first correct click
    const isFirstClick = (gameMode === 'STANDARD' && num === 1) || 
                         (gameMode === 'REVERSE' && num === gridSize * gridSize);

    if (isFirstClick && !startTime) {
      const start = Date.now();
      setStartTime(start);
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - start) / 1000);
      }, 100);
    }

    // 2. Validate Click
    if (num === currentTarget) {
      // Check Win Condition
      const isWin = (gameMode === 'STANDARD' && num === gridSize * gridSize) || 
                    (gameMode === 'REVERSE' && num === 1);

      if (isWin) {
        finishGame();
      } else {
        // Increment or Decrement target based on mode
        setCurrentTarget(prev => gameMode === 'REVERSE' ? prev - 1 : prev + 1);
      }
    }
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    const finalTime = elapsed;
    setGameState('FINISHED');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios.post(`${API_URL}/submit-score`, { 
      time_taken: finalTime, 
      grid_size: gridSize 
    }).then(() => {
      return axios.get(`${API_URL}/stats`);
    }).then(res => {
      setStats(res.data);
    }).catch(e => console.error("Error saving score", e));
  };

  // --- Helper to check if a cell should look "clicked" ---
  const isCellClicked = (num) => {
      if (gameMode === 'REVERSE') {
          return num > currentTarget;
      }
      return num < currentTarget;
  };

  // --- Render Helpers ---
  if (gameState === 'SETUP') {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <h2>Configure Table</h2>
          
          {/* Grid Size Selection */}
          <div className="option-group">
            <label>Grid Size:</label>
            <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))}>
              <option value={3}>3 x 3 (Easy)</option>
              <option value={5}>5 x 5 (Standard)</option>
              <option value={7}>7 x 7 (Hard)</option>
            </select>
          </div>

          {/* Mode Selection (Unlocked) */}
          <div className="option-group">
            <label>Game Mode:</label>
            <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
              <option value="STANDARD">1 to {gridSize*gridSize} (Standard)</option>
              <option value="REVERSE">{gridSize*gridSize} to 1 (Reverse)</option>
            </select>
          </div>

          {/* Visual Feedback Toggle */}
          <div className="option-group checkbox-group">
             <label className="checkbox-label">
                <input 
                    type="checkbox" 
                    checked={visualFeedback} 
                    onChange={(e) => setVisualFeedback(e.target.checked)} 
                />
                Show green highlight on click
             </label>
          </div>

          <button className="start-btn" onClick={startGame}>Start Game</button>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrapper">
      <aside className="sidebar">
        <div className="hud-card">
          <h3>Find Number</h3>
          <div className="target-number">{currentTarget}</div>
        </div>
        
        <div className="hud-card">
          <h3>Timer</h3>
          <div className="timer-display">{elapsed.toFixed(1)}s</div>
        </div>

        <div className="score-card">
          <h4>Statistics</h4>
          <p>Best: <span>{stats.best.toFixed(2)}s</span></p>
          <p>Avg: <span>{stats.average.toFixed(2)}s</span></p>
          <p>Last: <span>{stats.last.toFixed(2)}s</span></p>
        </div>

        <button className="reset-btn" onClick={() => setGameState('SETUP')}>
          New Game
        </button>
      </aside>

      <main className="grid-area">
        <div 
          className={`schulte-grid size-${gridSize}`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {grid.map((num) => {
            // Only apply 'clicked' class if the number is found AND visual feedback is ON
            const alreadyFound = isCellClicked(num);
            const classNames = `grid-cell ${alreadyFound && visualFeedback ? 'clicked' : ''}`;
            
            return (
                <div 
                key={num} 
                className={classNames}
                onMouseDown={() => handleCellClick(num)} 
                >
                {num}
                </div>
            )
          })}
        </div>
        
        {gameState === 'FINISHED' && (
          <div className="finish-overlay">
            <div className="result-box">
              <h2>Complete!</h2>
              <p className="final-time">{elapsed.toFixed(2)}s</p>
              <button onClick={() => setGameState('SETUP')}>Play Again</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;