import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>The Schulte Table</h1>
      <section className="history-section">
        <h2>History & Science</h2>
        <p>
          Originally developed by German psychiatrist Walter Schulte, these tables 
          are grids of randomly distributed numbers used to study attention properties 
          and speed reading. Training with them improves peripheral vision and 
          visual search speed.
        </p>
      </section>
      {/* FIX: Navigate to '/game' instead of '/setup' */}
      <button className="start-btn" onClick={() => navigate('/game')}>
        Start Training
      </button>
    </div>
  );
};

export default LandingPage;