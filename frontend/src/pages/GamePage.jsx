import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure you ran: npm install axios
import '../styles/GamePage.css';

const GamePage = () => {
  const navigate = useNavigate();
  
  // Game States: 'SETUP', 'PLAYING', 'FINISHED'
  const [gameState, setGameState] = useState('SETUP');
  
  // Settings
  const [gridSize, setGridSize] = useState(5); // Default 5x5
  const [grid, setGrid] = useState([]);
  
  // Gameplay Data
  const [nextNum, setNextNum] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ best: 0, average: 0, last: 0 });

  const timerRef = useRef(null);

  // --- Fetch Stats on Load ---
  useEffect(() => {
    // Replace with your actual AWS/Backend URL later
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
    setNextNum(1);
    setElapsed(0);
    setStartTime(null); // Timer doesn't start until user clicks '1'
    setGameState('PLAYING');
  };

  const handleCellClick = (num) => {
    // 1. Start Timer on first click (Number 1)
    if (num === 1 && !startTime) {
      const start = Date.now();
      setStartTime(start);
      timerRef.current = setInterval(() => {
        setElapsed((Date.now() - start) / 1000);
      }, 100);
    }

    // 2. Validate Click
    if (num === nextNum) {
      if (num === gridSize * gridSize) {
        finishGame();
      } else {
        setNextNum(prev => prev + 1);
      }
    }
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    const finalTime = elapsed;
    setGameState('FINISHED');

    // Send Score to Backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    axios.post(`${API_URL}/submit-score`, { 
      time_taken: finalTime, 
      grid_size: gridSize 
    }).then(() => {
      // Refresh stats after submission
      return axios.get(`${API_URL}/stats`);
    }).then(res => {
      setStats(res.data);
    }).catch(e => console.error("Error saving score", e));
  };

  // --- Render Helpers ---
  if (gameState === 'SETUP') {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <h2>Configure Table</h2>
          <div className="option-group">
            <label>Grid Size:</label>
            <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))}>
              <option value={3}>3 x 3 (Easy)</option>
              <option value={5}>5 x 5 (Standard)</option>
              <option value={7}>7 x 7 (Hard)</option>
            </select>
          </div>
          <div className="option-group">
            <label>Mode:</label>
            <select disabled>
              <option>Random Shuffle</option>
            </select>
          </div>
          <button className="start-btn" onClick={startGame}>Start Game</button>
          <button className="back-btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-wrapper">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="hud-card">
          <h3>Find Number</h3>
          <div className="target-number">{nextNum}</div>
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

      {/* Main Grid Area */}
      <main className="grid-area">
        <div 
          className={`schulte-grid size-${gridSize}`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {grid.map((num) => (
            <div 
              key={num} 
              className={`grid-cell ${num < nextNum ? 'clicked' : ''}`}
              onMouseDown={() => handleCellClick(num)} 
            >
              {num}
            </div>
          ))}
        </div>
        
        {/* Finished Overlay */}
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